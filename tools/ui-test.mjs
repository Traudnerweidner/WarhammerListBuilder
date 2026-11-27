import { spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { root } from "./lib/runtime.mjs";

const EDGE = process.env.EDGE_PATH ?? "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const PORT = Number(process.env.CDP_PORT ?? 9333);
const profile = mkdtempSync(join(tmpdir(), "armeewerkstatt-ui-"));
const page = pathToFileURL(root + "index.html").href;
const browser = spawn(EDGE, ["--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check", `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, "about:blank"], { stdio: "ignore" });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let socket;
let nextId = 1;
const pending = new Map();
const problems = [];

async function connect() {
  for (let attempt = 0; attempt < 50; attempt++) {
    try {
      const targets = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      const target = targets.find((entry) => entry.type === "page");
      if (target) return target.webSocketDebuggerUrl;
    } catch (error) {
      await sleep(200);
    }
  }
  throw new Error("Edge DevTools endpoint not reachable");
}

function send(method, params = {}) {
  const id = nextId++;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

async function evaluate(expression) {
  const result = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text);
  return result.result.value;
}

async function load(url) {
  await send("Page.navigate", { url });
  for (let i = 0; i < 100; i++) {
    await sleep(100);
    const ready = await evaluate("document.readyState === 'complete' && !document.documentElement.classList.contains('is-loading') && !!document.querySelector('#detachments .detachment')").catch(() => false);
    if (ready) return;
  }
  throw new Error("Page did not finish loading: " + await evaluate("document.getElementById('save-status') && document.getElementById('save-status').textContent"));
}

const helpers = `
  window.confirm = function () { return true; };
  window.alert = function () {};
  window.__fire = function (element, type) { element.dispatchEvent(new Event(type, { bubbles: true })); };
  window.__wait = function (test) { return new Promise(function (resolve, reject) { var n = 0; (function poll() { if (test()) return resolve(true); if (++n > 200) return reject(new Error('timeout')); setTimeout(poll, 50); })(); }); };
`;

async function run() {
  socket = new WebSocket(await connect());
  await new Promise((resolve) => socket.addEventListener("open", resolve, { once: true }));
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) reject(new Error(message.error.message)); else resolve(message.result);
    } else if (message.method === "Runtime.exceptionThrown") {
      problems.push("Exception: " + (message.params.exceptionDetails.exception?.description ?? message.params.exceptionDetails.text));
    } else if (message.method === "Runtime.consoleAPICalled" && (message.params.type === "error" || message.params.type === "warning")) {
      problems.push("Console " + message.params.type + ": " + message.params.args.map((arg) => arg.value ?? arg.description).join(" "));
    } else if (message.method === "Log.entryAdded" && message.params.entry.level === "error") {
      problems.push("Log: " + message.params.entry.text + " " + (message.params.entry.url ?? ""));
    }
  });
  await send("Runtime.enable");
  await send("Page.enable");
  await send("Log.enable");

  // 1. Legacy Sororitas list migration
  await load(page);
  await evaluate(`localStorage.clear(); localStorage.setItem('sororitas-workshop-v1', JSON.stringify({ version: 2, name: 'Alte Liste', battleSize: 'strike-force', budget: 2000,
    detachments: ['army-of-faith'], warlordId: 'entry-1', entries: [
      { id: 'entry-1', unitId: 'canoness', points: null, choices: ['default'], enhancementId: 'army-of-faith--litanies-of-faith', attachedTo: 'entry-2' },
      { id: 'entry-2', unitId: 'battle-sisters-squad', points: null, choices: ['default','default','default','default','default','default','default','default','default','default'], enhancementId: null, attachedTo: null },
      { id: 'entry-3', unitId: 'aveline', points: 45, choices: ['default'], enhancementId: null, attachedTo: null } ] })); true`);
  await load(page);
  const migrated = await evaluate(`({ status: document.getElementById('save-status').textContent, notices: Array.prototype.map.call(document.querySelectorAll('#storage-notices li'), function (li) { return li.textContent; }),
    eyebrow: document.getElementById('faction-eyebrow').textContent, entries: document.querySelectorAll('#selection-list li').length,
    errors: Array.prototype.map.call(document.querySelectorAll('#validation li.error'), function (li) { return li.textContent; }) })`);
  console.log("Migration:", JSON.stringify(migrated, null, 1));
  if (migrated.entries !== 2) problems.push("Migration: expected 2 entries, got " + migrated.entries);
  if (!/ADEPTA SORORITAS/.test(migrated.eyebrow)) problems.push("Migration: faction header wrong");

  // 2. Every faction: add units, open entries, change wargear, open game view
  await evaluate(helpers + "true");
  const factions = await evaluate("ListRules.factionIndex().map(function (f) { return f.id; })");
  for (const id of factions) {
    const result = await evaluate(`(async function () {
      ${helpers}
      var select = document.getElementById('faction');
      select.value = '${id}'; __fire(select, 'change');
      await __wait(function () { return !document.documentElement.classList.contains('is-loading') && ListRules.faction() && ListRules.faction().id === '${id}'; });
      document.getElementById('tab-detachments-step').click();
      var detachment = document.querySelector('#detachments input[type=checkbox]:not(:disabled)');
      if (detachment) { detachment.checked = true; __fire(detachment, 'change'); }
      document.getElementById('tab-units-step').click();
      var buttons = Array.prototype.slice.call(document.querySelectorAll('#catalogue button.add'));
      var picks = [];
      for (var i = 0; i < buttons.length && picks.length < 6; i += Math.max(1, Math.floor(buttons.length / 6))) picks.push(buttons[i].id);
      picks.forEach(function (bid) { document.getElementById(bid).click(); });
      var changed = 0;
      Array.prototype.forEach.call(document.querySelectorAll('#selection-list .entry-select'), function (entryButton) {
        entryButton.click();
        var details = document.querySelector('#roster details[data-models]');
        if (details) details.open = true;
        var gear = document.querySelector('#roster select[id^="gear-"]');
        if (gear) {
          var option = Array.prototype.find.call(gear.options, function (o) { return !o.disabled && o.value !== gear.value; });
          if (option) { gear.value = option.value; __fire(gear, 'change'); changed++; }
        }
        var size = document.querySelector('#roster select[id^="size-"]');
        if (size && size.options.length > 1) { size.value = size.options[size.options.length - 1].value; __fire(size, 'change'); }
        var enh = document.querySelector('#roster select[id^="enhancement-"]');
        if (enh && enh.options.length > 1) { enh.value = enh.options[1].value; __fire(enh, 'change'); }
        var att = document.querySelector('#roster select[id^="attachment-"]');
        if (att && att.options.length > 1) { att.value = att.options[1].value; __fire(att, 'change'); }
      });
      var warlord = document.getElementById('warlord');
      if (warlord.options.length > 1) { warlord.value = warlord.options[1].value; __fire(warlord, 'change'); }
      document.getElementById('tab-review-step').click();
      document.getElementById('tab-game-step').click();
      document.getElementById('tab-references').click();
      document.getElementById('ref-tab-faction').click();
      var dialogTerm = document.querySelector('#game-units .rule-term');
      if (dialogTerm) { dialogTerm.click(); document.getElementById('rule-dialog-close').click(); }
      document.getElementById('tab-list-settings').click();
      return { entries: document.querySelectorAll('#selection-list li').length, changed: changed,
        cheat: document.querySelectorAll('#cheatsheet .cheat-item').length, units: document.querySelectorAll('#game-units details').length,
        errors: document.querySelectorAll('#validation li.error').length, eyebrow: document.getElementById('faction-eyebrow').textContent };
    })()`);
    console.log(id.padEnd(24), JSON.stringify(result));
    if (!result.entries) problems.push(`${id}: no entries added`);
  }

  // 3. Reload keeps the last list
  const before = await evaluate("localStorage.getItem('armeewerkstatt-v3')");
  await load(page);
  const after = await evaluate("({ status: document.getElementById('save-status').textContent, entries: document.querySelectorAll('#selection-list li').length })");
  console.log("Reload:", JSON.stringify(after));
  if (!before || !after.entries) problems.push("Reload lost the saved list");
}

try {
  await run();
} catch (error) {
  problems.push("Runner: " + error.stack);
} finally {
  try { socket?.close(); } catch (error) { /* ignore */ }
  browser.kill();
  await sleep(500);
  try { rmSync(profile, { recursive: true, force: true }); } catch (error) { /* profile still locked */ }
}
if (problems.length) {
  console.error("\nUI problems:\n  " + problems.join("\n  "));
  process.exit(1);
}
console.log("\nUI smoke test passed.");

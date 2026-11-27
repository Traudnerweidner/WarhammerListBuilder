import { writeFileSync, mkdirSync, readdirSync, unlinkSync } from "node:fs";
import { dataset, packageJson } from "./lib/library.mjs";
import { convertFaction, unitPool, factionDetachments, alliance, datasetInfo } from "./lib/convert.mjs";
import { loadOverlays } from "./lib/overlay.mjs";
import { createRuntime, root } from "./lib/runtime.mjs";

function es3Literal(value) {
  return JSON.stringify(value).replace(/[\u007f-\uffff]/g, (char) => "\\u" + char.charCodeAt(0).toString(16).padStart(4, "0"));
}

const runtime = createRuntime();
const ListRules = runtime.ListRules;
const outDir = root + "data/factions/";
mkdirSync(outDir, { recursive: true });
for (const file of readdirSync(outDir)) if (file.endsWith(".js")) unlinkSync(outDir + file);

const { latest } = datasetInfo();
const index = [];
const summary = [];
const excluded = [];
const reports = {};

for (const view of dataset.factions.all.slice().sort((a, b) => a.name.localeCompare(b.name))) {
  const id = view.id;
  if (!unitPool(id).length || !factionDetachments(id).length) {
    excluded.push(`${view.name} (${id}): ${unitPool(id).length} units, ${factionDetachments(id).length} detachments`);
    continue;
  }
  const overlay = loadOverlays(id);
  const { data, report } = convertFaction(id, overlay, ListRules);
  reports[id] = report;
  const file = `data/factions/${id}.js`;
  writeFileSync(root + file, `FACTION_LIBRARY.register(${es3Literal(data)});\n`, "utf8");
  index.push({
    id,
    name: data.name,
    alliance: alliance(data.keywords),
    parentId: data.parentId,
    file,
    units: data.units.length,
    detachments: data.detachments.length,
    texts: overlay !== null
  });
  summary.push(`${id}: ${data.units.length} units, ${data.detachments.length} detachments${report.skipped.length ? `, ${report.skipped.length} skipped` : ""}`);
}

const library = {
  dataset: {
    name: packageJson.name,
    version: packageJson.version,
    homepage: packageJson.homepage,
    edition: latest.edition,
    dataslate: latest.dataslate,
    effectiveDate: latest.effective_date,
    label: latest.label
  },
  index
};

writeFileSync(root + "data/index.js",
  "var FACTION_LIBRARY = " + es3Literal(library).replace(/}$/, ",\"factions\":{}}") + ";\n" +
  "FACTION_LIBRARY.register = function (data) {\n  FACTION_LIBRARY.factions[data.id] = data;\n};\n", "utf8");

writeFileSync(root + "tools/build-report.json", JSON.stringify({ dataset: library.dataset, summary, excluded, reports }, null, 2) + "\n", "utf8");

console.log(`Dataset ${packageJson.name}@${packageJson.version} (${latest.label})`);
console.log(summary.join("\n"));
if (excluded.length) console.log("Excluded (no own units or no detachments):\n  " + excluded.join("\n  "));
for (const [id, report] of Object.entries(reports)) {
  if (report.skipped.length) console.log(`${id} skipped:\n  ` + report.skipped.join("\n  "));
  if (report.notes.length) console.log(`${id} notes: ${report.notes.length}`);
  if (report.missingTexts.length) console.log(`${id} entries without overlay text: ${report.missingTexts.length}`);
}

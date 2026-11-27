import { readFileSync } from "node:fs";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

export const root = fileURLToPath(new URL("../../", import.meta.url));

export function createRuntime(files = []) {
  const context = vm.createContext({});
  vm.runInContext("var FACTION_LIBRARY = { index: [], factions: {}, register: function (data) { FACTION_LIBRARY.factions[data.id] = data; } };", context);
  for (const file of files) vm.runInContext(readFileSync(root + file, "utf8"), context, { filename: file });
  vm.runInContext(readFileSync(root + "rules.js", "utf8"), context, { filename: "rules.js" });
  return {
    context,
    ListRules: vm.runInContext("ListRules", context),
    register(faction) {
      context.__faction = faction;
      vm.runInContext("FACTION_LIBRARY.register(__faction); delete __faction;", context);
    },
    run(code) {
      return vm.runInContext(code, context);
    }
  };
}

export function loadOverlay(file) {
  const context = vm.createContext({});
  vm.runInContext(readFileSync(root + file, "utf8") + "\n;this.__data = FACTION_DATA;", context, { filename: file });
  return JSON.parse(JSON.stringify(context.__data));
}

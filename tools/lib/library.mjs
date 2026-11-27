import * as lib from "@alpaca-software/40kdc-data";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const indexUrl = import.meta.resolve("@alpaca-software/40kdc-data");
const internal = (path) => import(new URL(path, indexUrl).href);

export const mfm = await internal("./data/mfm-loadout.js");
export const mfmUnit = await internal("./data/mfm-loadout-unit.js");
export const mfmSearch = await internal("./data/mfm-loadout-search.js");
export const unitLoadoutModule = await internal("./data/unit-loadout.js");
export const listBuildingKeywords = await internal("./data/list-building-keywords.js");
export const abilityRefs = await internal("./data/ability-refs.js");
export const rosterResolve = await internal("./data/roster-resolve.js");

export const packageJson = JSON.parse(readFileSync(fileURLToPath(new URL("../package.json", indexUrl)), "utf8"));

export { lib };
export const dataset = lib.dataset;

import { readFileSync, existsSync } from "node:fs";
import { loadOverlay, root } from "./runtime.mjs";
import { normalizeName } from "./format.mjs";

function slug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function loadOverlays(factionId) {
  const file = `tools/overlays/${factionId}.js`;
  if (!existsSync(root + file)) return null;
  const data = loadOverlay(file);
  const hintsFile = root + `tools/overlays/${factionId}-hints.json`;
  const hints = existsSync(hintsFile) ? JSON.parse(readFileSync(hintsFile, "utf8")) : {};
  const aliasesFile = root + `tools/overlays/${factionId}-aliases.json`;
  const aliases = existsSync(aliasesFile) ? JSON.parse(readFileSync(aliasesFile, "utf8")) : {};
  const units = new Map(data.units.map((unit) => [unit.id, unit]));
  const detachments = new Map(data.detachments.map((detachment) => [detachment.id, detachment]));
  const findAbility = (unit, name) => (unit?.abilities ?? []).find((ability) => normalizeName(ability.name) === normalizeName(name)) ?? null;
  return {
    source: data.source,
    armyRule: data.armyRule ?? null,
    hints,
    unit(id) {
      return units.get(id) ?? null;
    },
    abilityText(unitId, name) {
      const unit = units.get(unitId);
      const alias = aliases[unitId]?.[name];
      if (alias) {
        const parts = alias.map((entry) => {
          const found = findAbility(unit, entry);
          if (!found) throw new Error(`Overlay alias ${unitId}/${entry} not found`);
          return alias.length > 1 && entry !== name ? `${found.name}: ${found.text}` : found.text;
        });
        return parts.join("\n");
      }
      const found = findAbility(unit, name);
      return found ? found.text : "";
    },
    detachment(id) {
      return detachments.get(id) ?? null;
    },
    enhancement(detachmentId, name) {
      const detachment = detachments.get(detachmentId);
      return (detachment?.enhancements ?? []).find((item) => normalizeName(item.name) === normalizeName(name)) ?? null;
    },
    stratagem(detachmentId, name) {
      const detachment = detachments.get(detachmentId);
      return (detachment?.stratagems ?? []).find((item) => normalizeName(item.name) === normalizeName(name)) ?? null;
    },
    legacyEnhancementIds(mapping) {
      const result = {};
      for (const detachment of data.detachments) {
        for (const item of detachment.enhancements) {
          const id = mapping(detachment.id, item.name);
          if (id) result[`${detachment.id}--${slug(item.name)}`] = id;
        }
      }
      return result;
    },
    unmatched: { abilities: [], enhancements: [], stratagems: [] }
  };
}

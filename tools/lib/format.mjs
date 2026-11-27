export function capitalize(text) {
  const value = String(text ?? "").trim();
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
}

export function normalizeName(text) {
  return String(text ?? "")
    .toLowerCase()
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/^\s*the\s+/, "")
    .replace(/\(upgrade\)|\bupgrade\b/g, "")
    .replace(/[^a-z0-9]+/g, "");
}

const plus = (value) => (value === null || value === undefined ? "-" : `${value}+`);
const plain = (value) => (value === null || value === undefined ? "-" : String(value));

export function profileRow(profile) {
  const notes = [];
  if (profile.invuln_sv_melee != null) notes.push(`Invulnerable save ${profile.invuln_sv_melee}+ against melee attacks`);
  if (profile.invuln_sv_ranged != null) notes.push(`Invulnerable save ${profile.invuln_sv_ranged}+ against ranged attacks`);
  return {
    name: profile.name,
    stats: {
      M: profile.M === null || profile.M === undefined ? "-" : `${profile.M}"`,
      T: plain(profile.T),
      SV: plus(profile.Sv),
      W: plain(profile.W),
      LD: plus(profile.Ld),
      OC: plain(profile.OC),
      INV: plus(profile.invuln_sv)
    },
    notes: notes.join("; ")
  };
}

export function baseText(base) {
  if (!base || !base.shape) return "";
  if (base.shape === "round" && base.diameter) return `${base.diameter}mm`;
  if (base.shape === "oval" && base.width && base.length) return `${base.width} x ${base.length}mm`;
  if (base.shape === "hull") return "Hull";
  if (base.shape === "flying-base") return `Flying base${base.size ? ` (${base.size})` : ""}`;
  return capitalize(base.shape);
}

function targetText(keywords) {
  return (keywords ?? []).join(" / ");
}

export function weaponKeywordText(reference, catalog) {
  const entry = catalog.get(reference.keyword_id);
  const name = entry ? entry.name : capitalize(reference.keyword_id.replace(/-/g, " "));
  const p = reference.parameters ?? {};
  let text;
  if (reference.keyword_id === "anti") {
    text = p.target_keyword ? `Anti-${p.target_keyword} ${p.threshold}+` : `Anti ${p.threshold}+`;
  } else if (reference.keyword_id === "hunter") {
    text = `${name}${p.target_keyword ? ` (${p.target_keyword})` : ""}`;
  } else if (p.value !== undefined && p.value !== null) {
    text = `${name} ${p.value}`;
  } else {
    text = name;
  }
  if (p.required_target_keywords_any?.length) text += ` (vs ${targetText(p.required_target_keywords_any)})`;
  if (p.excluded_target_keywords?.length) text += ` (not vs ${targetText(p.excluded_target_keywords)})`;
  return text;
}

export function weaponProfile(profile, catalog) {
  const stats = profile.stats ?? {};
  const melee = profile.range === "Melee";
  const skill = melee ? stats.WS : stats.BS;
  const abilities = (profile.keywords ?? []).map((reference) => weaponKeywordText(reference, catalog));
  if (profile.target_restrictions?.required_keywords_any?.length) {
    abilities.push(`Only vs ${targetText(profile.target_restrictions.required_keywords_any)}`);
  }
  return {
    name: profile.name,
    range: typeof profile.range === "number" ? `${profile.range}"` : String(profile.range ?? "-"),
    a: plain(stats.A),
    skill: skill === null || skill === undefined ? "N/A" : `${skill}+`,
    s: plain(stats.S),
    ap: plain(stats.AP),
    d: plain(stats.D),
    abilities
  };
}

export function coreAbilityLabel(id, name, value) {
  if (value === undefined || value === null) return name;
  switch (id) {
    case "feel-no-pain":
      return `Feel No Pain ${value}+`;
    case "scouts":
      return `Scouts ${value}"`;
    case "damaged":
      return `Damaged: 1-${value} Wounds Remaining`;
    case "damaged-objective-control":
      return `Damaged: -${value} OC`;
    default:
      return `${name} ${value}`;
  }
}

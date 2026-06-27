import { C } from "../theme.js";

export const FAMILY_RIME_COLORS = {
  an: C.red,
  at: C.green,
};

export const familyForWord = (word, preferredFamily) => {
  const clean = String(word || "").toLowerCase();
  const preferred = String(preferredFamily || "").toLowerCase();

  if (preferred && clean.endsWith(preferred)) return preferred;
  return Object.keys(FAMILY_RIME_COLORS).find((family) =>
    clean.endsWith(family),
  );
};

export const familyRimeColor = (family) =>
  FAMILY_RIME_COLORS[String(family || "").toLowerCase()] || C.red;

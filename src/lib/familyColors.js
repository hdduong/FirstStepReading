import { C } from "../theme.js";

export const FAMILY_RIME_COLORS = {
  an: C.red,
  at: C.red,
};

const CROSS_FAMILY_RIME_COLORS = {
  an: {
    at: C.green,
  },
};

export const familyForWord = (word, preferredFamily) => {
  const clean = String(word || "").toLowerCase();
  const preferred = String(preferredFamily || "").toLowerCase();

  if (preferred && clean.endsWith(preferred)) return preferred;

  return Object.keys(CROSS_FAMILY_RIME_COLORS[preferred] || {}).find((family) =>
    clean.endsWith(family),
  );
};

export const familyRimeColor = (family, preferredFamily) => {
  const display = String(family || "").toLowerCase();
  const preferred = String(preferredFamily || "").toLowerCase();
  return (
    CROSS_FAMILY_RIME_COLORS[preferred]?.[display] ||
    FAMILY_RIME_COLORS[display] ||
    C.red
  );
};

import { C } from "../theme.js";

// Renders a word with its family ending colored red (e.g. M + at, C + an, H + am).
export default function FamilyWord({ word, family, size = 30 }) {
  const m = word.match(/^([^A-Za-z']*)([A-Za-z']+)([^A-Za-z']*)$/) || [
    null,
    "",
    word,
    "",
  ];
  const lead = m[1];
  const clean = m[2];
  const tail = m[3];
  const hit = clean.toLowerCase().endsWith(family);
  const onset = hit ? clean.slice(0, clean.length - family.length) : clean;
  const rime = hit ? clean.slice(clean.length - family.length) : "";
  return (
    <span style={{ fontSize: size, fontWeight: 700, letterSpacing: 1 }}>
      {lead && <span style={{ color: C.blueDark }}>{lead}</span>}
      <span style={{ color: hit ? C.blue : C.blueDark }}>{onset}</span>
      {hit && <span style={{ color: C.red }}>{rime}</span>}
      {tail && <span style={{ color: C.blueDark }}>{tail}</span>}
    </span>
  );
}

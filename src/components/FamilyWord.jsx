import { C } from "../theme.js";
import { familyForWord, familyRimeColor } from "../lib/familyColors.js";

// Renders a word with its family ending colored for easy rime recognition.
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
  const displayFamily = familyForWord(clean, family);
  const hit = Boolean(displayFamily);
  const onset = hit ? clean.slice(0, clean.length - displayFamily.length) : clean;
  const rime = hit ? clean.slice(clean.length - displayFamily.length) : "";
  return (
    <span style={{ fontSize: size, fontWeight: 700, letterSpacing: 1 }}>
      {lead && <span style={{ color: C.blueDark }}>{lead}</span>}
      <span style={{ color: hit ? C.blue : C.blueDark }}>{onset}</span>
      {hit && <span style={{ color: familyRimeColor(displayFamily) }}>{rime}</span>}
      {tail && <span style={{ color: C.blueDark }}>{tail}</span>}
    </span>
  );
}

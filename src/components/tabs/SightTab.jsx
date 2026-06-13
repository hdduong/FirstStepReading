import { C, cardStyle, ring, h2Style } from "../../theme.js";
import Pill from "../Pill.jsx";

export default function SightTab({ lesson, speech }) {
  return (
    <section>
      <h2 style={h2Style}>
        Sight words for pages {lesson.pages} — know them by heart! ⭐
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: 12,
        }}
      >
        {lesson.sight.map((w) => (
          <div
            key={w}
            style={{
              ...cardStyle,
              background: C.yellowSoft,
              borderColor: "#f2d878",
              boxShadow:
                speech.speakingKey === `s-${w}` || speech.speakingKey === `w-${w}`
                  ? ring
                  : "0 2px 0 rgba(0,0,0,0.05)",
            }}
          >
            <div style={{ fontSize: 26 }}>⭐</div>
            <div style={{ fontSize: 36, fontWeight: 700, color: C.blue }}>
              {w}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <Pill small onClick={() => speech.sayWord(w)}>
                🔊 Say
              </Pill>
              <Pill small bg={C.pink} onClick={() => speech.spellWord(w)}>
                🔡 Spell
              </Pill>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

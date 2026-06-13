import { C, cardStyle, ring, h2Style } from "../../theme.js";
import Pill from "../Pill.jsx";
import FamilyWord from "../FamilyWord.jsx";
import { Mat, Pat, Dan } from "../characters.jsx";
import { VOWEL_INFO, vowelOf } from "../../lib/phonics.js";

export default function WordsTab({ lesson, speech }) {
  const v = vowelOf(lesson.family);
  const info = VOWEL_INFO[v] ?? { sound: v, word: lesson.family, emoji: "" };
  return (
    <section>
      <div
        style={{
          ...cardStyle,
          flexDirection: "row",
          justifyContent: "space-between",
          background: C.sky,
          padding: "12px 16px",
          marginBottom: 14,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 42, fontWeight: 700 }}>
            <span style={{ color: C.blue }}>{v.toUpperCase()}</span>
            <span style={{ color: C.red }}>{v}</span>
          </span>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontWeight: 700, fontSize: 16 }}>
              Short {v.toUpperCase()} says “{info.sound}” {info.emoji}
            </div>
            <div style={{ fontSize: 13, color: C.gray }}>
              like in {info.word} and {lesson.family}
            </div>
          </div>
        </div>
        <Pill small onClick={() => speech.playVowelIntro(lesson.family)}>
          🔊 Hear it
        </Pill>
      </div>

      <h2 style={h2Style}>The “-{lesson.family}” words — tap to hear!</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: 12,
        }}
      >
        {lesson.words.map((w) => (
          <div
            key={w.word}
            style={{
              ...cardStyle,
              boxShadow:
                speech.speakingKey === `w-${w.word}`
                  ? ring
                  : "0 2px 0 rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                height: 80,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {w.pic === "mat" ? (
                <Mat size={56} />
              ) : w.pic === "pat" ? (
                <Pat size={56} />
              ) : w.pic === "dan" ? (
                <Dan size={56} />
              ) : (
                <span style={{ fontSize: 48 }}>{w.pic}</span>
              )}
            </div>
            <FamilyWord word={w.word} family={lesson.family} size={32} />
            <div style={{ display: "flex", gap: 6 }}>
              <Pill small bg={C.red} onClick={() => speech.soundOut(w.word, lesson.family)}>
                🧩 Sound it
              </Pill>
              <Pill small onClick={() => speech.sayWord(w.word)}>
                🔊 Say
              </Pill>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

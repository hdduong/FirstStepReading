import { useState } from "react";
import { C } from "../theme.js";
import { VOWEL_INFO, vowelOf } from "../lib/phonics.js";

const VOWEL_ORDER = ["a", "e", "i", "o", "u"];

// Left rail: choose a book, then choose a set of pages (a word-family story)
// within that book. Stories are grouped into collapsible short-vowel sections.
export default function Sidebar({ books, bookIdx, onBook, lessons, lessonIdx, onLesson }) {
  // Group lessons by short vowel, keeping each lesson's original index (onLesson
  // and lessonIdx index into the full book.lessons array).
  const groups = VOWEL_ORDER.map((v) => ({
    vowel: v,
    info: VOWEL_INFO[v],
    items: lessons
      .map((L, i) => ({ L, i }))
      .filter(({ L }) => vowelOf(L.family) === v),
  })).filter((g) => g.items.length > 0);

  // The section holding the current lesson is always shown expanded; the user
  // can additionally expand any other section.
  const activeVowel = lessons[lessonIdx]
    ? vowelOf(lessons[lessonIdx].family)
    : null;
  const [open, setOpen] = useState(() => new Set());

  const toggle = (v) =>
    setOpen((s) => {
      const next = new Set(s);
      if (next.has(v)) next.delete(v);
      else next.add(v);
      return next;
    });

  return (
    <aside className="pagemenu">
      <div style={labelStyle}>📚 Choose your book</div>
      <select
        value={bookIdx}
        onChange={(e) => onBook(Number(e.target.value))}
        aria-label="Choose your book"
        style={bookSelectStyle}
      >
        {books.map((b, i) => (
          <option key={b.id} value={i}>
            {`Book ${i + 1} — ${b.theme}${b.comingSoon ? " (coming soon)" : ""}`}
          </option>
        ))}
      </select>

      {groups.length > 0 && (
        <>
          <div style={labelStyle}>📖 Choose your pages</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {groups.map((g) => {
              const isOpen = g.vowel === activeVowel || open.has(g.vowel);
              return (
                <div key={g.vowel}>
                  <button
                    type="button"
                    className="press"
                    onClick={() => toggle(g.vowel)}
                    aria-expanded={isOpen}
                    style={vowelHeaderStyle(isOpen)}
                  >
                    <span>
                      {g.info.emoji} Short {g.vowel.toUpperCase()}
                      <span style={{ opacity: 0.7 }}> · {g.items.length}</span>
                    </span>
                    <span style={{ fontSize: 12 }}>{isOpen ? "▾" : "▸"}</span>
                  </button>
                  {isOpen && (
                    <div
                      className="pagebtns"
                      style={{ marginTop: 8, flexWrap: "wrap" }}
                    >
                      {g.items.map(({ L, i }) => {
                        const on = i === lessonIdx;
                        return (
                          <button
                            key={L.id}
                            className="press"
                            onClick={() => onLesson(i)}
                            style={menuBtnStyle(on)}
                          >
                            <div style={{ fontWeight: 700, fontSize: 22 }}>
                              -{L.family}
                            </div>
                            <div
                              style={{ fontSize: 12, fontWeight: 700, opacity: 0.95 }}
                            >
                              Pages {L.pages}
                            </div>
                            <div style={{ fontSize: 11, opacity: 0.85 }}>
                              {L.title}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </aside>
  );
}

const labelStyle = {
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: 1.5,
  color: C.gray,
  textTransform: "uppercase",
  marginBottom: 8,
};

const bookSelectStyle = {
  width: "100%",
  marginBottom: 16,
  background: "#fff",
  color: C.blueDark,
  border: `3px solid ${C.blue}`,
  borderRadius: 16,
  padding: "12px 14px",
  fontWeight: 700,
  fontSize: 15,
  fontFamily: "inherit",
  cursor: "pointer",
};

const vowelHeaderStyle = (open) => ({
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 8,
  background: open ? C.blue : C.sky,
  color: open ? "#fff" : C.blueDark,
  border: `3px solid ${open ? C.blue : C.border}`,
  borderRadius: 14,
  padding: "10px 12px",
  fontWeight: 700,
  fontSize: 14,
  cursor: "pointer",
  fontFamily: "inherit",
});

const menuBtnStyle = (on) => ({
  flex: 1,
  background: on ? C.blue : "#fff",
  color: on ? "#fff" : C.blueDark,
  border: `3px solid ${on ? C.blue : C.border}`,
  borderRadius: 16,
  padding: "12px 8px",
  cursor: "pointer",
  fontFamily: "inherit",
});

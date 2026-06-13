import { C } from "../theme.js";

// Left rail: choose a book, then choose a set of pages (a word-family lesson)
// within that book.
export default function Sidebar({ books, bookIdx, onBook, lessons, lessonIdx, onLesson }) {
  return (
    <aside className="pagemenu">
      <div style={labelStyle}>📚 Choose your book</div>
      <div className="pagebtns" style={{ marginBottom: 16 }}>
        {books.map((b, i) => {
          const on = i === bookIdx;
          return (
            <button
              key={b.id}
              className="press"
              onClick={() => onBook(i)}
              style={{
                ...menuBtnStyle(on),
                opacity: b.comingSoon ? 0.6 : 1,
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 15 }}>
                Book {i + 1}
              </div>
              <div style={{ fontSize: 11, opacity: 0.9 }}>{b.vowel}</div>
            </button>
          );
        })}
      </div>

      {lessons.length > 0 && (
        <>
          <div style={labelStyle}>📖 Choose your pages</div>
          <div className="pagebtns">
            {lessons.map((L, i) => {
              const on = i === lessonIdx;
              return (
                <button
                  key={L.id}
                  className="press"
                  onClick={() => onLesson(i)}
                  style={menuBtnStyle(on)}
                >
                  <div style={{ fontWeight: 700, fontSize: 22 }}>-{L.family}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.95 }}>
                    Pages {L.pages}
                  </div>
                  <div style={{ fontSize: 11, opacity: 0.85 }}>{L.title}</div>
                </button>
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

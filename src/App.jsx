import { useState } from "react";
import { C, cardStyle } from "./theme.js";
import { BOOKS } from "./data/index.js";
import { useSpeech } from "./lib/useSpeech.js";
import { Mat, Pat } from "./components/characters.jsx";
import Sidebar from "./components/Sidebar.jsx";
import VoiceSettings from "./components/VoiceSettings.jsx";
import WordsTab from "./components/tabs/WordsTab.jsx";
import SightTab from "./components/tabs/SightTab.jsx";
import ReadTab from "./components/tabs/ReadTab.jsx";
import GameTab from "./components/tabs/GameTab.jsx";

const TABS = [
  ["words", "🔤 Words"],
  ["sight", "⭐ Sight Words"],
  ["read", "📖 Read It"],
  ["game", "🎮 Game"],
];
const TAB_COMPONENTS = { words: WordsTab, sight: SightTab, read: ReadTab, game: GameTab };

export default function App() {
  const [bookIdx, setBookIdx] = useState(0);
  const [lessonIdx, setLessonIdx] = useState(0);
  const [tab, setTab] = useState("words");
  const speech = useSpeech();

  const book = BOOKS[bookIdx];
  const lesson = book.lessons[lessonIdx];

  const chooseBook = (i) => {
    speech.cancel();
    setBookIdx(i);
    setLessonIdx(0);
  };
  const chooseLesson = (i) => {
    speech.cancel();
    setLessonIdx(i);
  };
  const chooseTab = (t) => {
    speech.cancel();
    setTab(t);
  };

  const TabEl = TAB_COMPONENTS[tab];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.cream,
        backgroundImage:
          "radial-gradient(rgba(29,79,145,0.06) 2px, transparent 2px)",
        backgroundSize: "26px 26px",
        fontFamily:
          "'Fredoka','Comic Sans MS','Chalkboard SE','Comic Neue',sans-serif",
        color: C.blueDark,
        paddingBottom: 32,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&display=swap');
        * { -webkit-tap-highlight-color: transparent; box-sizing: border-box; }
        .press:active { transform: scale(0.94); }
        .wiggle { animation: wiggle .5s ease; }
        .pop { animation: pop .45s ease; }
        @keyframes wiggle { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-7px)} 75%{transform:translateX(7px)} }
        @keyframes pop { 0%{transform:scale(1)} 50%{transform:scale(1.14)} 100%{transform:scale(1)} }
        @media (prefers-reduced-motion: reduce) { .wiggle,.pop{animation:none} .press:active{transform:none} }
        button:focus-visible { outline: 3px solid ${C.blue}; outline-offset: 2px; }
        .layout { display: flex; gap: 18px; max-width: 880px; margin: 0 auto; padding: 14px 14px 0; align-items: flex-start; }
        .pagemenu { flex: 0 0 176px; position: sticky; top: 12px; }
        .pagemenu .pagebtns { display: flex; flex-direction: column; gap: 8px; }
        .content { flex: 1; min-width: 0; }
        @media (max-width: 720px) {
          .layout { flex-direction: column; gap: 12px; }
          .pagemenu { position: static; flex: none; width: 100%; }
          .pagemenu .pagebtns { flex-direction: row; }
        }
      `}</style>

      {/* ----- Book-cover header ----- */}
      <header
        style={{
          background: C.yellow,
          borderRadius: "0 0 36px 36px",
          padding: "16px 14px 20px",
          textAlign: "center",
          position: "relative",
          boxShadow: "0 4px 0 rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 12,
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: C.blue,
            color: "#fff",
            border: "3px dashed #fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            transform: "rotate(8deg)",
          }}
        >
          <span style={{ fontSize: 9, letterSpacing: 1 }}>STEP</span>
          <span style={{ fontSize: 22, lineHeight: 1 }}>{book.step}</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            gap: 6,
          }}
        >
          <Mat size={58} />
          <div style={{ padding: "0 2px" }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 2,
                color: C.blueDark,
                textTransform: "uppercase",
              }}
            >
              FirstStepReading • Step {book.step}
            </div>
            <h1
              style={{
                margin: "2px 0 0",
                color: C.blue,
                fontSize: 30,
                lineHeight: 1.05,
              }}
            >
              {book.theme}
            </h1>
            <div style={{ fontWeight: 600, fontSize: 16 }}>
              {lesson
                ? `${lesson.title} • Pages ${lesson.pages}`
                : "Coming soon"}
            </div>
          </div>
          <Pat size={58} />
        </div>
      </header>

      {!speech.canSpeak && (
        <p
          style={{
            textAlign: "center",
            color: C.red,
            fontWeight: 600,
            margin: "10px 14px 0",
            fontSize: 14,
          }}
        >
          This device can’t play speech, so the sound buttons won’t talk.
        </p>
      )}

      {/* ----- Body: left menu + content ----- */}
      <div className="layout">
        <Sidebar
          books={BOOKS}
          bookIdx={bookIdx}
          onBook={chooseBook}
          lessons={book.lessons}
          lessonIdx={lessonIdx}
          onLesson={chooseLesson}
        />

        <div className="content">
          {lesson ? (
            <>
              <nav
                style={{
                  display: "flex",
                  gap: 8,
                  overflowX: "auto",
                  padding: "0 0 4px",
                }}
              >
                {TABS.map(([id, label]) => (
                  <button
                    key={id}
                    className="press"
                    onClick={() => chooseTab(id)}
                    style={{
                      flex: "0 0 auto",
                      background: tab === id ? C.blue : "#fff",
                      color: tab === id ? "#fff" : C.blue,
                      border: `3px solid ${C.blue}`,
                      borderRadius: 999,
                      padding: "9px 16px",
                      fontWeight: 700,
                      fontSize: 15,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </nav>

              <main style={{ padding: "12px 0 0" }}>
                <VoiceSettings speech={speech} />
                <TabEl
                  key={`${book.id}-${lessonIdx}`}
                  book={book}
                  lesson={lesson}
                  speech={speech}
                />
              </main>
            </>
          ) : (
            <main style={{ padding: "12px 0 0" }}>
              <div style={{ ...cardStyle, padding: 28 }}>
                <div style={{ fontSize: 50 }}>📚</div>
                <p style={{ fontSize: 18, fontWeight: 700, margin: "6px 0 0" }}>
                  Book {bookIdx + 1} is coming soon!
                </p>
                <p style={{ fontSize: 14, color: C.gray, margin: 0 }}>
                  Pick Book 1 to start reading.
                </p>
              </div>
            </main>
          )}
        </div>
      </div>

      <footer
        style={{
          textAlign: "center",
          color: C.gray,
          fontSize: 12,
          marginTop: 26,
          padding: "0 16px",
          lineHeight: 1.8,
        }}
      >
        Practice app for FirstStepReading • Sounds use recorded clips when
        available, otherwise your device’s voice 🔊
        <br />
        <a
          href="/privacy"
          style={{ color: C.blue, fontWeight: 700, textDecoration: "none" }}
        >
          Privacy Policy
        </a>
        {" • "}
        <a
          href="/copyright"
          style={{ color: C.blue, fontWeight: 700, textDecoration: "none" }}
        >
          Copyright
        </a>
        {" • "}
        <a
          href="https://firststepreadingapp.com/support"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: C.blue, fontWeight: 700, textDecoration: "none" }}
        >
          Support
        </a>
        {" • "}
        <a
          href="mailto:support@firststepreadingapp.com"
          style={{ color: C.blue, fontWeight: 700, textDecoration: "none" }}
        >
          support@firststepreadingapp.com
        </a>
        <br />
        <span>Reading content © FirstStepReading.com</span>
      </footer>
    </div>
  );
}

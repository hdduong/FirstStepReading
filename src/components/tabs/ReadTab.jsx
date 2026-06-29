import { useState } from "react";
import { C, cardStyle, h2Style } from "../../theme.js";
import Pill from "../Pill.jsx";
import FamilyWord from "../FamilyWord.jsx";
import BookPagePicture from "../BookPagePicture.jsx";
import VideoClipButton from "../VideoClipButton.jsx";
import { sentenceToken, wordToken } from "../../lib/phonics.js";

export default function ReadTab({ book, lesson, speech }) {
  // Which word is currently lit up: { s: sentence index, w: word index }.
  const [active, setActive] = useState({ s: -1, w: -1 });

  const chipTap = (i, j) => {
    const word = lesson.sentences[i].words[j];
    speech.speak([wordToken(word)], undefined, { rate: 0.78 }, {
      onStart: () => setActive({ s: i, w: j }),
      onEnd: () => setActive({ s: -1, w: -1 }),
    });
  };

  const playSentence = (i) => {
    const sentence = lesson.sentences[i];
    const phrase = sentenceToken(book.id, lesson.id, sentence);
    speech.speakPhrase(
      phrase,
      sentence.words,
      `sent-${i}`,
      { rate: 0.78 },
      {
        onStart: (j) => setActive({ s: i, w: j }),
        onEnd: () => setActive({ s: -1, w: -1 }),
      },
    );
  };

  return (
    <section>
      <h2 style={h2Style}>Read pages {lesson.pages} — tap any word 👇</h2>
      {lesson.sentences.map((s, i) => (
        <div
          key={s.page}
          style={{
            ...cardStyle,
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            marginBottom: 14,
            padding: 16,
          }}
        >
          <BookPagePicture bookId={book.id} page={s.page} fallbackPic={s.pic} />
          <div style={{ flex: 1, textAlign: "left" }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 1.5,
                color: C.gray,
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Page {s.page}
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginBottom: 12,
              }}
            >
              {s.words.map((word, j) => {
                const on = active.s === i && active.w === j;
                return (
                  <span
                    key={j}
                    style={{
                      display: "inline-flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <button
                      className="press"
                      onClick={() => chipTap(i, j)}
                      style={{
                        background: on ? C.yellow : C.sky,
                        border: `2px solid ${on ? "#e3b416" : C.border}`,
                        borderRadius: 14,
                        padding: "8px 12px",
                        cursor: "pointer",
                        transform: on ? "scale(1.1)" : "none",
                        transition: "all .15s",
                        fontFamily: "inherit",
                      }}
                    >
                      <FamilyWord word={word} family={lesson.family} size={24} />
                    </button>
                    <VideoClipButton word={word} />
                  </span>
                );
              })}
            </div>
            <Pill bg={C.green} onClick={() => playSentence(i)}>
              ▶ Read it to me
            </Pill>
          </div>
        </div>
      ))}
    </section>
  );
}

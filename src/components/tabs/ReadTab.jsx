import { useState } from "react";
import { C, cardStyle, h2Style } from "../../theme.js";
import Pill from "../Pill.jsx";
import FamilyWord from "../FamilyWord.jsx";
import BookPagePicture from "../BookPagePicture.jsx";
import PopOut from "../PopOut.jsx";
import VideoClipButton from "../VideoClipButton.jsx";
import { sentenceToken, wordToken } from "../../lib/phonics.js";

export default function ReadTab({ book, lesson, speech }) {
  // Which word is currently lit up: { s: sentence index, w: word index }.
  const [active, setActive] = useState({ s: -1, w: -1 });
  const [popSentenceIndex, setPopSentenceIndex] = useState(null);
  const popSentence =
    popSentenceIndex === null ? null : lesson.sentences[popSentenceIndex];

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

  const openReadCard = (index) => setPopSentenceIndex(index);

  const openReadCardFromCard = (event, index) => {
    if (event.defaultPrevented) return;
    const interactive = event.target.closest(
      "button, a, input, select, textarea, [role='button']",
    );
    if (interactive) return;
    openReadCard(index);
  };

  const renderReadCardContent = (s, i, { popOut = false } = {}) => {
    const wordSize = popOut ? 30 : 24;
    const wordPadding = popOut ? "10px 14px" : "8px 12px";

    return (
      <>
        <BookPagePicture
          bookId={book.id}
          page={s.page}
          fallbackPic={s.pic}
          large={popOut}
          onOpen={popOut ? undefined : () => openReadCard(i)}
        />
        <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
          <div
            style={{
              fontSize: popOut ? 14 : 12,
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
              gap: popOut ? 10 : 8,
              marginBottom: popOut ? 14 : 12,
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
                      padding: wordPadding,
                      cursor: "pointer",
                      transform: on ? "scale(1.1)" : "none",
                      transition: "all .15s",
                      fontFamily: "inherit",
                    }}
                  >
                    <FamilyWord word={word} family={lesson.family} size={wordSize} />
                  </button>
                  <VideoClipButton word={word} small={!popOut} />
                </span>
              );
            })}
          </div>
          <Pill bg={C.green} onClick={() => playSentence(i)}>
            ▶ Read it to me
          </Pill>
        </div>
      </>
    );
  };

  return (
    <section>
      <h2 style={h2Style}>Read pages {lesson.pages} — tap any word 👇</h2>
      {lesson.sentences.map((s, i) => (
        <div
          key={s.page}
          data-testid={`read-card-page-${s.page}`}
          title={`Open read page ${s.page}`}
          onClick={(event) => openReadCardFromCard(event, i)}
          style={{
            ...cardStyle,
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            marginBottom: 14,
            padding: 16,
            cursor: "pointer",
          }}
        >
          {renderReadCardContent(s, i)}
        </div>
      ))}
      {popSentence && (
        <PopOut
          label={`Read page ${popSentence.page}`}
          maxWidth={780}
          padding="48px 24px 24px"
          onClose={() => setPopSentenceIndex(null)}
        >
          <div
            data-testid={`read-card-popout-page-${popSentence.page}`}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 18,
              flexWrap: "wrap",
            }}
          >
            {renderReadCardContent(popSentence, popSentenceIndex, { popOut: true })}
          </div>
        </PopOut>
      )}
    </section>
  );
}

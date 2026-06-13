import { useState } from "react";
import { C, cardStyle, ring, h2Style } from "../../theme.js";
import Pill from "../Pill.jsx";
import { shuffle, wordToken } from "../../lib/phonics.js";

export default function GameTab({ lesson, speech }) {
  const [game, setGame] = useState(null);
  const [score, setScore] = useState(0);

  const pool = [
    ...new Set([...lesson.words.map((w) => w.word), ...lesson.sight]),
  ];

  const newRound = () => {
    const target = shuffle(pool)[0];
    const others = shuffle(pool.filter((w) => w !== target)).slice(0, 3);
    setGame({
      target,
      choices: shuffle([target, ...others]),
      status: "idle",
      picked: null,
    });
    setTimeout(() => speech.sayWord(target, "game"), 350);
  };

  const pick = (c) => {
    if (!game || game.status === "right") return;
    if (c === game.target) {
      setGame((g) => ({ ...g, status: "right", picked: c }));
      setScore((s) => s + 1);
      speech.speak([{ say: "Yes!" }, wordToken(game.target)], "game", {
        rate: 0.85,
        pitch: 1.3,
      });
      setTimeout(newRound, 1700);
    } else {
      setGame((g) => ({ ...g, status: "wrong", picked: c }));
      speech.speak([{ say: "Try again!" }], "game", { rate: 0.9 });
      setTimeout(
        () =>
          setGame((g) =>
            g && g.status === "wrong"
              ? { ...g, status: "idle", picked: null }
              : g,
          ),
        800,
      );
    }
  };

  return (
    <section>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ ...h2Style, margin: 0 }}>Listen and find 👂</h2>
        <div style={{ fontSize: 20, fontWeight: 700 }}>⭐ {score}</div>
      </div>
      <div style={{ fontSize: 13, color: C.gray, marginTop: 4 }}>
        Words from pages {lesson.pages}
      </div>

      {!game ? (
        <div style={{ ...cardStyle, marginTop: 14, padding: 24 }}>
          <div style={{ fontSize: 50 }}>👂</div>
          <p style={{ margin: "4px 0 10px", fontSize: 17, fontWeight: 600 }}>
            I’ll say a word from pages {lesson.pages}.
            <br />
            Tap the word you hear!
          </p>
          <Pill bg={C.green} onClick={newRound}>
            ▶ Start
          </Pill>
        </div>
      ) : (
        <div style={{ marginTop: 14 }}>
          <div style={{ textAlign: "center", marginBottom: 14 }}>
            <button
              className="press"
              onClick={() => speech.sayWord(game.target, "game")}
              style={{
                width: 78,
                height: 78,
                borderRadius: "50%",
                border: "none",
                background: C.blue,
                color: "#fff",
                fontSize: 34,
                cursor: "pointer",
                boxShadow:
                  speech.speakingKey === "game"
                    ? ring
                    : "0 4px 0 rgba(0,0,0,0.2)",
              }}
            >
              🔊
            </button>
            <div style={{ fontSize: 13, color: C.gray, marginTop: 6 }}>
              Tap to hear it again
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            {game.choices.map((c) => {
              const wrongPick = game.status === "wrong" && game.picked === c;
              const right = game.status === "right" && c === game.target;
              return (
                <button
                  key={c}
                  className={`press ${wrongPick ? "wiggle" : ""} ${right ? "pop" : ""}`}
                  onClick={() => pick(c)}
                  style={{
                    background: right
                      ? C.green
                      : wrongPick
                        ? "#fde2de"
                        : "#fff",
                    color: right ? "#fff" : C.blueDark,
                    border: `3px solid ${right ? C.green : wrongPick ? C.red : C.border}`,
                    borderRadius: 20,
                    padding: "22px 8px",
                    fontSize: 28,
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  {c}
                </button>
              );
            })}
          </div>

          <div style={{ textAlign: "center", marginTop: 16 }}>
            <button
              onClick={newRound}
              style={{
                background: "none",
                border: "none",
                color: C.blue,
                fontWeight: 700,
                fontSize: 15,
                cursor: "pointer",
                textDecoration: "underline",
                fontFamily: "inherit",
              }}
            >
              ↻ New word
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

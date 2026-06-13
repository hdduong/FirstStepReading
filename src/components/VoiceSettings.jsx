import { C, cardStyle } from "../theme.js";
import Pill from "./Pill.jsx";

// Voice picker + speed controls. Driven entirely by the useSpeech hook.
export default function VoiceSettings({ speech }) {
  const { voiceList, voiceName, speed, SPEEDS, pickVoice, changeSpeed, testVoice } = speech;
  return (
    <div
      style={{
        ...cardStyle,
        alignItems: "stretch",
        textAlign: "left",
        padding: "12px 14px",
        marginBottom: 14,
        gap: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontWeight: 700, fontSize: 14, flex: "0 0 auto" }}>
          🗣️ Voice
        </span>
        <select
          value={voiceName}
          onChange={(e) => pickVoice(e.target.value)}
          style={{
            flex: 1,
            minWidth: 150,
            fontFamily: "inherit",
            fontWeight: 600,
            fontSize: 14,
            padding: "8px 10px",
            borderRadius: 12,
            border: `2px solid ${C.border}`,
            color: C.blueDark,
            background: "#fff",
          }}
        >
          {voiceList.length === 0 && <option value="">Default voice</option>}
          {voiceList.map((v) => (
            <option key={v.name} value={v.name}>
              {v.name.split(" - ")[0].replace("Desktop", "").trim()}
            </option>
          ))}
        </select>
        <Pill small onClick={testVoice}>
          🔊 Test
        </Pill>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontWeight: 700, fontSize: 14 }}>⏱️ Speed</span>
        {SPEEDS.map(([label, v]) => (
          <button
            key={label}
            className="press"
            onClick={() => changeSpeed(v)}
            style={{
              background: speed === v ? C.blue : "#fff",
              color: speed === v ? "#fff" : C.blue,
              border: `2px solid ${C.blue}`,
              borderRadius: 999,
              padding: "7px 14px",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <div style={{ fontSize: 12, color: C.gray }}>
        Recorded clips are used when available; otherwise the app uses your
        device's most natural-sounding American English (en-US) voice. For
        richer fallback voices on Windows, open this app in Microsoft Edge, or
        add voices in Settings ▸ Time &amp; language ▸ Speech.
      </div>
    </div>
  );
}

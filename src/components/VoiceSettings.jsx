import { C, cardStyle } from "../theme.js";
import Pill from "./Pill.jsx";

const rowStyle = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  flexWrap: "wrap",
};

const labelStyle = {
  fontWeight: 700,
  fontSize: 14,
  flex: "0 0 auto",
};

const selectStyle = {
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
};

export default function VoiceSettings({ speech }) {
  const {
    voicePacks,
    voicePackId,
    speed,
    SPEEDS,
    pickVoicePack,
    changeSpeed,
    testVoice,
  } = speech;

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
      <div style={rowStyle}>
        <span style={labelStyle}>Voice</span>
        <select
          value={voicePackId}
          onChange={(e) => pickVoicePack(e.target.value)}
          aria-label="Choose a voice"
          style={selectStyle}
        >
          {voicePacks.map((pack) => (
            <option key={pack.id} value={pack.id}>
              {pack.label}
            </option>
          ))}
        </select>
        <Pill small onClick={testVoice}>
          Test
        </Pill>
      </div>

      <div style={rowStyle}>
        <span style={labelStyle}>Speed</span>
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
    </div>
  );
}

import { C } from "../theme.js";

// Rounded action button used throughout the app.
export default function Pill({ children, onClick, bg = C.blue, small }) {
  return (
    <button
      className="press"
      onClick={onClick}
      style={{
        background: bg,
        color: "#fff",
        border: "none",
        borderRadius: 999,
        padding: small ? "7px 12px" : "10px 18px",
        fontWeight: 700,
        fontSize: small ? 13 : 16,
        cursor: "pointer",
        boxShadow: "0 3px 0 rgba(0,0,0,0.18)",
        fontFamily: "inherit",
      }}
    >
      {children}
    </button>
  );
}

import { useEffect } from "react";
import { C, cardStyle } from "../theme.js";

// Full-screen pop-out used by the Words and Sight tabs: a big, focus-holding
// view of a single word. Closes on a backdrop tap, the ✕ button, or Escape.
// Callers supply the inner content (picture/word and action buttons).
export default function PopOut({
  label,
  onClose,
  children,
  maxWidth = 420,
  padding = "34px 24px 26px",
}) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "rgba(20,30,60,0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        className="pop"
        role="dialog"
        aria-modal="true"
        aria-label={label}
        onClick={(e) => e.stopPropagation()}
        style={{
          ...cardStyle,
          position: "relative",
          width: "100%",
          maxWidth,
          padding,
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            width: 42,
            height: 42,
            borderRadius: "50%",
            border: `3px solid ${C.border}`,
            background: "#fff",
            color: C.blueDark,
            fontSize: 20,
            fontWeight: 700,
            lineHeight: 1,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}

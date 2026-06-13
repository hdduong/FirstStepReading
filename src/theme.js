// Palette drawn from the book cover: royal blue, sunny yellow, Mat's red, Pat's pink.
export const C = {
  blue: "#1d4f91",
  blueDark: "#143a6d",
  red: "#e8503a",
  yellow: "#ffd23f",
  yellowSoft: "#fff3c4",
  pink: "#ef4d8d",
  cream: "#fffaf0",
  sky: "#eef5ff",
  border: "#d8e6f7",
  gray: "#5b6770",
  green: "#3aa655",
};

// Shared style tokens reused across cards and headings.
export const cardStyle = {
  background: "#fff",
  border: `3px solid ${C.border}`,
  borderRadius: 22,
  padding: "14px 10px 12px",
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 8,
  transition: "box-shadow .2s",
};

// Yellow focus/active ring used to show which card is currently speaking.
export const ring = `0 0 0 5px ${C.yellow}`;

export const h2Style = {
  color: C.blueDark,
  fontSize: 20,
  margin: "4px 0 12px",
  fontWeight: 700,
};

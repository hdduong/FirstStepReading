import { Mat, Pat, Dan } from "./characters.jsx";

// Picture for a sentence/word card: a character drawing or a big emoji.
export default function PicFor({ pic, size = 84 }) {
  if (pic === "mat") return <Mat size={size} />;
  if (pic === "pat") return <Pat size={size} />;
  if (pic === "dan") return <Dan size={size} />;
  if (pic === "matpat")
    return (
      <div style={{ display: "flex" }}>
        <Mat size={size * 0.68} />
        <Pat size={size * 0.68} />
      </div>
    );
  return <span style={{ fontSize: size * 0.66 }}>{pic}</span>;
}

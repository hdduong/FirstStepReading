import { useState } from "react";
import { C } from "../theme.js";
import { bookPageImageSrc } from "../lib/bookPageImages.js";
import PicFor from "./PicFor.jsx";

export default function BookPagePicture({
  bookId,
  page,
  fallbackPic,
  onOpen,
  large = false,
}) {
  const [failedSrc, setFailedSrc] = useState(null);
  const src = bookPageImageSrc(bookId, page);
  const showImage = src && failedSrc !== src;
  const canOpen = showImage && onOpen;
  const frameStyle = {
    width: large ? "clamp(132px, 26vw, 178px)" : "clamp(92px, 18vw, 124px)",
    aspectRatio: "4 / 5",
    flex: "0 0 auto",
    borderRadius: 14,
    border: `2px solid ${C.border}`,
    background: "#fff",
    boxShadow: "0 2px 0 rgba(0,0,0,0.06)",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const image = showImage ? (
    <img
      src={src}
      alt={`Book page ${page} picture`}
      loading="lazy"
      onError={() => setFailedSrc(src)}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: "top center",
        display: "block",
      }}
    />
  ) : (
    <PicFor pic={fallbackPic} size={large ? 98 : 78} />
  );

  if (canOpen) {
    return (
      <button
        type="button"
        className="press"
        aria-label={`Open book page ${page} picture`}
        onClick={() => onOpen({ page, src })}
        style={{
          ...frameStyle,
          padding: 0,
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        {image}
      </button>
    );
  }

  return (
    <div style={frameStyle}>{image}</div>
  );
}

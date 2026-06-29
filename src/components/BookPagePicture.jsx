import { useState } from "react";
import { C } from "../theme.js";
import PicFor from "./PicFor.jsx";

const BOOK_PAGE_IMAGE_ROOTS = {
  book1: "/images/book1/pages",
};

function bookPageImageSrc(bookId, page) {
  const root = BOOK_PAGE_IMAGE_ROOTS[bookId];
  if (!root || !Number.isInteger(page)) return null;
  return `${root}/page-${String(page).padStart(3, "0")}.webp`;
}

export default function BookPagePicture({ bookId, page, fallbackPic }) {
  const [failedSrc, setFailedSrc] = useState(null);
  const src = bookPageImageSrc(bookId, page);
  const showImage = src && failedSrc !== src;

  return (
    <div
      style={{
        width: "clamp(92px, 18vw, 124px)",
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
      }}
    >
      {showImage ? (
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
        <PicFor pic={fallbackPic} size={78} />
      )}
    </div>
  );
}

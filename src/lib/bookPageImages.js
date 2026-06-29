const BOOK_PAGE_IMAGE_ROOTS = {
  book1: "/images/book1/pages",
};

const BOOK_PAGE_IMAGE_OFFSETS = {
  book1: 1,
};

const BOOK_PAGE_IMAGE_LAST_PAGE = {
  book1: 92,
};

export function bookPageImageSrc(bookId, bookPage) {
  const root = BOOK_PAGE_IMAGE_ROOTS[bookId];
  if (!root || !Number.isInteger(bookPage)) return null;

  const imagePage = bookPage + (BOOK_PAGE_IMAGE_OFFSETS[bookId] ?? 0);
  const lastPage = BOOK_PAGE_IMAGE_LAST_PAGE[bookId] ?? Infinity;

  if (imagePage < 1 || imagePage > lastPage) return null;

  return `${root}/page-${String(imagePage).padStart(3, "0")}.webp`;
}

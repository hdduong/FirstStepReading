import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("**/api/health", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ status: "ok", tts: false }),
    }),
  );
  await page.goto("/", { waitUntil: "domcontentloaded" });
});

test("loads Book 1 and shows the -at words", async ({ page }) => {
  await expect(
    page.getByRole("heading", { name: "ABC's and Short Vowels" }),
  ).toBeVisible();
  await expect(page.getByText(/tap a word to pop it big/i)).toBeVisible();
  await expect(page.getByRole("button", { name: "Pop out Cat" })).toBeVisible();
});

test("tapping a word pops it out; ✕ and Escape close it", async ({ page }) => {
  await page.getByRole("button", { name: "Pop out Cat" }).click();
  const dialog = page.getByRole("dialog", { name: "Cat" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Close" }).click();
  await expect(dialog).toBeHidden();

  await page.getByRole("button", { name: "Pop out Cat" }).click();
  await expect(page.getByRole("dialog", { name: "Cat" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Cat" })).toBeHidden();
});

test("sidebar groups by vowel; picking The Pig (Short I) switches the words", async ({
  page,
}) => {
  await expect(page.getByRole("button", { name: "Pop out Cat" })).toBeVisible();
  await page.getByRole("button", { name: /Short I/ }).click();
  await page.getByRole("button", { name: /The Pig/ }).click();
  await expect(page.getByRole("button", { name: "Pop out Pig" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Pop out Cat" })).toHaveCount(0);
});

test("switches between the four tabs", async ({ page }) => {
  await page.getByRole("button", { name: "Sight Words" }).click();
  await expect(page.getByText(/Sight words for pages/i)).toBeVisible();
  await page.getByRole("button", { name: "Read It" }).click();
  await expect(page.getByText(/tap any word/i)).toBeVisible();
  await page.getByRole("button", { name: "Game" }).click();
  await expect(page.getByText(/Listen and find/i)).toBeVisible();
});

test("read pages show book page pictures", async ({ page }) => {
  await page.getByRole("button", { name: "Read It" }).click();

  await expect(page.getByRole("img", { name: "Book page 2 picture" })).toHaveAttribute(
    "src",
    "/images/book1/original-pages/page-002.webp",
  );
  await expect(page.getByRole("img", { name: "Book page 3 picture" })).toHaveAttribute(
    "src",
    "/images/book1/original-pages/page-003.webp",
  );
  await expect(page.getByRole("img", { name: "Book page 4 picture" })).toHaveAttribute(
    "src",
    "/images/book1/original-pages/page-004.webp",
  );
  await expect(page.getByRole("img", { name: "Book page 5 picture" })).toHaveAttribute(
    "src",
    "/images/book1/original-pages/page-005.webp",
  );
  await expect(page.getByRole("img", { name: "Book page 6 picture" })).toHaveAttribute(
    "src",
    "/images/book1/original-pages/page-006.webp",
  );
});

test("read page pictures and cards pop out into a full read card", async ({ page }) => {
  await page.getByRole("button", { name: "Read It" }).click();
  const readCard = page.getByTestId("read-card-page-2");

  await readCard.getByText("Page 2").click();

  const dialog = page.getByRole("dialog", { name: "Read page 2" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByTestId("read-card-popout-page-2")).toBeVisible();
  await expect(dialog.getByRole("img", { name: "Book page 2 picture" }))
    .toHaveAttribute("src", "/images/book1/original-pages/page-002.webp");
  await expect(dialog.getByText("Page 2")).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Mat" })).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Read it to me" })).toBeVisible();

  await dialog.getByRole("button", { name: "Close" }).click();
  await expect(dialog).toBeHidden();

  await page.getByRole("button", { name: "Open book page 2 picture" }).click();
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Close" }).click();
  await expect(dialog).toBeHidden();

  await page.getByRole("button", { name: "Open book page 3 picture" }).click();
  await expect(page.getByRole("dialog", { name: "Read page 3" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Read page 3" })).toBeHidden();
});

test("book dropdown can select a coming-soon book", async ({ page }) => {
  await page.getByLabel("Choose your book").selectOption("1");
  await expect(page.getByText("Book 2 is coming soon!")).toBeVisible();
});

test("voice picker is present with a default voice selected", async ({ page }) => {
  const picker = page.getByLabel("Choose a voice");
  await expect(picker).toBeVisible();
  await expect(picker).not.toHaveValue("");
});

test("footer links to the privacy policy", async ({ page }) => {
  const privacyLink = page.getByRole("link", { name: "Privacy Policy" });
  await expect(privacyLink).toHaveAttribute("href", "/privacy");

  await privacyLink.click();

  await expect(page).toHaveURL(/\/privacy$/);
  await expect(
    page.getByRole("heading", { name: "Privacy Policy" }),
  ).toBeVisible();
});

test("footer links to the copyright notice", async ({ page }) => {
  const copyrightLink = page.getByRole("link", { name: "Copyright" });
  await expect(copyrightLink).toHaveAttribute("href", "/copyright");

  await copyrightLink.click();

  await expect(page).toHaveURL(/\/copyright$/);
  await expect(
    page.getByRole("heading", { name: "Copyright Notice" }),
  ).toBeVisible();
});

test("privacy policy is available at /privacy", async ({ page }) => {
  await page.goto("/privacy");
  await expect(
    page.getByRole("heading", { name: "Privacy Policy" }),
  ).toBeVisible();
  await expect(page.getByText(/no accounts, no ads, no analytics/i)).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Back to FirstStepReading" }),
  ).toHaveAttribute("href", "/");
});

test("copyright notice is available at /copyright", async ({ page }) => {
  await page.goto("/copyright");
  await expect(
    page.getByRole("heading", { name: "Copyright Notice" }),
  ).toBeVisible();
  await expect(page.getByText(/copyright © 2026 FirstStepReadingApp/i)).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Back to FirstStepReading" }),
  ).toHaveAttribute("href", "/");
});

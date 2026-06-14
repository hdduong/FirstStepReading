import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
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

test("book dropdown can select a coming-soon book", async ({ page }) => {
  await page.getByLabel("Choose your book").selectOption("1");
  await expect(page.getByText("Book 2 is coming soon!")).toBeVisible();
});

test("voice picker is present with a default voice selected", async ({ page }) => {
  const picker = page.getByLabel("Choose a voice");
  await expect(picker).toBeVisible();
  await expect(picker).not.toHaveValue("");
});

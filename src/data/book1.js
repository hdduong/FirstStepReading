// Book 1 — Short Vowel A (pages 1–16).
// Each lesson is one word family (-at, -an, -am) and drives every tab.
export default {
  id: "book1",
  step: 1,
  vowel: "Short Vowel A",
  pageRange: "1–16",
  lessons: [
    {
      id: "at",
      family: "at",
      title: "Mat and Pat",
      pages: "1–6",
      words: [
        { word: "At", pic: "🎯" },
        { word: "Bat", pic: "🦇" },
        { word: "Cat", pic: "🐱" },
        { word: "Fat", pic: "🐷" },
        { word: "Hat", pic: "🎩" },
        { word: "Mat", pic: "mat" },
        { word: "Pat", pic: "pat" },
        { word: "Rat", pic: "🐀" },
        { word: "Sat", pic: "🪑" },
        { word: "That", pic: "👉" },
      ],
      sight: ["Is", "A", "Has", "And", "Not", "The", "At"],
      sentences: [
        {
          page: 2,
          pic: "matpat",
          words: ["Mat", "is", "a", "rat.", "Pat", "is", "a", "rat."],
        },
        {
          page: 3,
          pic: "mat",
          words: ["Mat", "has", "a", "hat", "and", "a", "bat."],
        },
        {
          page: 4,
          pic: "🐱",
          words: ["Mat", "has", "not", "pat", "that", "fat", "cat."],
        },
        {
          page: 5,
          pic: "pat",
          words: ["Pat", "has", "not", "pat", "that", "fat", "cat."],
        },
        {
          page: 6,
          pic: "🐱",
          words: ["The", "fat", "cat", "sat", "at", "a", "mat."],
        },
      ],
    },
    {
      id: "an",
      family: "an",
      title: "Dan",
      pages: "7–11",
      words: [
        { word: "An", pic: "🍎" },
        { word: "Can", pic: "🥫" },
        { word: "Dan", pic: "dan" },
        { word: "Man", pic: "👨" },
        { word: "Pan", pic: "🍳" },
        { word: "Ran", pic: "🏃" },
        { word: "Van", pic: "🚐" },
      ],
      sight: ["Is", "A", "And", "Has", "Said", "To", "Not", "An"],
      sentences: [
        { page: 8, pic: "dan", words: ["Dan", "is", "a", "man."] },
        {
          page: 9,
          pic: "🍎",
          words: ["Dan", "has", "an", "apple.", "Dan", "has", "a", "can."],
        },
        {
          page: 10,
          pic: "🍳",
          words: ["Dan", "has", "a", "pan.", "Dan", "said,", "“Not", "rats!”"],
        },
        {
          page: 11,
          pic: "🚐",
          words: ["Mat", "and", "Pat", "ran", "to", "a", "van."],
        },
      ],
    },
    {
      id: "am",
      family: "am",
      title: "Not Sam and Not Pam",
      pages: "12–16",
      words: [
        { word: "Am", pic: "🙋" },
        { word: "Ham", pic: "🍖" },
        { word: "Jam", pic: "🍓" },
        { word: "Pam", pic: "👧" },
        { word: "Sam", pic: "👦" },
        { word: "Yam", pic: "🍠" },
      ],
      sight: ["I", "A", "Am", "Not", "Has", "And", "Have"],
      sentences: [
        { page: 13, pic: "mat", words: ["I", "am", "Mat,", "not", "Sam."] },
        { page: 14, pic: "pat", words: ["I", "am", "Pat,", "not", "Pam."] },
        {
          page: 15,
          pic: "matpat",
          words: ["Pat", "has", "a", "yam.", "Mat", "has", "ham", "and", "jam."],
        },
        {
          page: 16,
          pic: "matpat",
          words: [
            "Mat",
            "and",
            "Pat",
            "have",
            "ham,",
            "jam,",
            "and",
            "a",
            "yam.",
          ],
        },
      ],
    },
  ],
};

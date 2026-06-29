import LegalPageLayout from "./components/LegalPageLayout.jsx";

const sections = [
  {
    title: "Contact us",
    body: [
      <>
        Email{" "}
        <a href="mailto:support@firststepreadingapp.com">
          support@firststepreadingapp.com
        </a>{" "}
        and we will get back to you. It helps to include your device, your
        browser, and a short description of what happened.
      </>,
    ],
  },
  {
    title: "Is it free?",
    body: [
      "Yes — FirstStepReadingApp is completely free, has no ads, and needs no account or sign-in.",
    ],
  },
  {
    title: "I cannot hear any sound",
    body: [
      "Tap (don't hover over) a word, letter, or the sound buttons to play them, and make sure your device is not muted and the volume is up.",
      "Use the voice picker above the lessons to change the voice or speed. If you see a note that the device cannot play speech, your browser's voices may be unavailable — try a current version of Chrome or Safari.",
    ],
  },
  {
    title: "How to use the app",
    body: [
      "Pick a book and a lesson from the menu, then use the tabs — Words, Sight Words, Read It, and Game — to practice. Tap any word to hear it; in Read It, tap a word to pop it big.",
    ],
  },
  {
    title: "Privacy and content",
    body: [
      <>
        We do not collect personal information or require sign-in — see the{" "}
        <a href="/privacy">Privacy Policy</a>.
      </>,
      <>
        The reading content is based on the FirstStepReading program — see the{" "}
        <a href="/copyright">Copyright Notice</a>.
      </>,
    ],
  },
  {
    title: "Devices",
    body: [
      "FirstStepReadingApp runs in any modern web browser on phones, tablets, and computers.",
    ],
  },
];

export default function SupportPage() {
  return (
    <LegalPageLayout
      title="Support"
      intro="Need a hand with FirstStepReadingApp? Here are answers to common questions and how to reach us."
      sections={sections}
    />
  );
}

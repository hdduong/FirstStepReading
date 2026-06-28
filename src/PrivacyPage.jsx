import LegalPageLayout from "./components/LegalPageLayout.jsx";

const LAST_UPDATED = "June 28, 2026";

const sections = [
  {
    title: "Information We Collect",
    body: [
      "FirstStepReading does not collect personal information from children, parents, teachers, or other visitors.",
      "The app does not use accounts, login, analytics, advertising identifiers, tracking cookies, location, camera, microphone, or in-app purchases.",
    ],
  },
  {
    title: "Local Device Preferences",
    body: [
      "The app may save a voice choice on your device so the same reading voice is selected the next time you open the app.",
      "This preference stays in your browser or app storage. It is not sent to FirstStepReading and is not used to identify you.",
    ],
  },
  {
    title: "Audio, Video, and Reading Practice",
    body: [
      "FirstStepReading plays built-in audio and video clips to help children practice letter sounds, word families, sight words, and early reading.",
      "The app does not record children, upload speech, or send reading activity to a server.",
    ],
  },
  {
    title: "Ads, Tracking, and Selling Data",
    body: [
      "FirstStepReading is free and ad-free.",
      "We do not sell data, share data for advertising, or track users across apps or websites.",
    ],
  },
  {
    title: "Children's Privacy",
    body: [
      "FirstStepReading is designed for early readers and families.",
      "Because the app does not collect personal information, we do not knowingly collect personal information from children.",
    ],
  },
  {
    title: "Third-Party Services",
    body: [
      "The web version may request font files from Google Fonts to display the app's friendly reading style.",
      "FirstStepReading does not use this for analytics, advertising, or tracking.",
    ],
  },
  {
    title: "Changes to This Policy",
    body: [
      "If this privacy policy changes, the updated version will be posted on this page with a new last updated date.",
    ],
  },
  {
    title: "Contact",
    body: [
      "For privacy questions, use the developer support contact listed for FirstStepReading in the App Store.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      lastUpdated={LAST_UPDATED}
      intro="FirstStepReading is a free, ad-free reading practice app for kids. We keep the experience simple: no accounts, no ads, no analytics, and no personal data collection."
      sections={sections}
    />
  );
}

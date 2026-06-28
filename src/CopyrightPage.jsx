import LegalPageLayout from "./components/LegalPageLayout.jsx";

const LAST_UPDATED = "June 28, 2026";

const sections = [
  {
    title: "App and Website",
    body: [
      "The FirstStepReadingApp website, app interface, software implementation, page organization, and app-specific learning experience are copyright © 2026 FirstStepReadingApp. All rights reserved.",
      "You may use the app for personal, family, or classroom reading practice and may share links to the public website.",
    ],
  },
  {
    title: "Reading Program Materials",
    body: [
      "FirstStepReading.com books, videos, lesson content, characters, illustrations, reading passages, word lists, audio, and video materials remain copyrighted by FirstStepReading.com or their respective owners.",
      "Those materials are provided in this companion app for reading practice and may not be copied, redistributed, republished, sold, or repackaged without written permission.",
    ],
  },
  {
    title: "Audio and Video",
    body: [
      "Recorded clips, generated voice audio, and read-aloud materials are included only for use inside FirstStepReadingApp.",
      "Do not extract, host, train on, resell, or redistribute the audio or video materials separately from the app without permission.",
    ],
  },
  {
    title: "Third-Party Rights",
    body: [
      "Third-party names, services, trademarks, and tools remain the property of their respective owners.",
      "Use of a third-party service in the app does not transfer ownership of that service or its materials.",
    ],
  },
  {
    title: "Permissions",
    body: [
      "For permission to reuse FirstStepReadingApp materials outside the app, contact support@firststepreadingapp.com.",
      "For FirstStepReading.com book, video, character, or lesson permissions, contact the FirstStepReading.com rights holder.",
    ],
  },
];

export default function CopyrightPage() {
  return (
    <LegalPageLayout
      title="Copyright Notice"
      lastUpdated={LAST_UPDATED}
      intro="FirstStepReadingApp is a free reading practice companion. The app is made for learning use, while the app design, code, reading content, artwork, audio, and video materials remain protected by copyright."
      sections={sections}
    />
  );
}

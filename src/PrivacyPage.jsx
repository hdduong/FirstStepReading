import { C } from "./theme.js";

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
    <main
      style={{
        minHeight: "100vh",
        background: C.cream,
        backgroundImage:
          "radial-gradient(rgba(29,79,145,0.06) 2px, transparent 2px)",
        backgroundSize: "26px 26px",
        color: C.blueDark,
        fontFamily:
          "'Fredoka','Comic Sans MS','Chalkboard SE','Comic Neue',sans-serif",
        padding: "28px 16px 44px",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&display=swap');
        a:focus-visible { outline: 3px solid ${C.blue}; outline-offset: 3px; }
      `}</style>

      <article
        style={{
          maxWidth: 780,
          margin: "0 auto",
          background: "#fff",
          border: `3px solid ${C.border}`,
          borderRadius: 22,
          boxShadow: "0 6px 0 rgba(29,79,145,0.08)",
          padding: "28px clamp(18px, 4vw, 40px)",
        }}
      >
        <a
          href="/"
          style={{
            color: C.blue,
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Back to FirstStepReading
        </a>

        <header style={{ marginTop: 22, marginBottom: 24 }}>
          <p
            style={{
              color: C.green,
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 1,
              margin: "0 0 8px",
              textTransform: "uppercase",
            }}
          >
            FirstStepReading
          </p>
          <h1
            style={{
              color: C.blue,
              fontSize: "clamp(34px, 8vw, 56px)",
              lineHeight: 1,
              margin: 0,
            }}
          >
            Privacy Policy
          </h1>
          <p
            style={{
              color: C.gray,
              fontSize: 16,
              fontWeight: 600,
              margin: "12px 0 0",
            }}
          >
            Last updated: {LAST_UPDATED}
          </p>
        </header>

        <p
          style={{
            color: C.blueDark,
            fontSize: 20,
            fontWeight: 700,
            lineHeight: 1.45,
            margin: "0 0 24px",
          }}
        >
          FirstStepReading is a free, ad-free reading practice app for kids. We
          keep the experience simple: no accounts, no ads, no analytics, and no
          personal data collection.
        </p>

        <div style={{ display: "grid", gap: 20 }}>
          {sections.map((section) => (
            <section key={section.title}>
              <h2
                style={{
                  color: C.blueDark,
                  fontSize: 22,
                  margin: "0 0 8px",
                }}
              >
                {section.title}
              </h2>
              {section.body.map((paragraph) => (
                <p
                  key={paragraph}
                  style={{
                    color: C.gray,
                    fontSize: 16,
                    lineHeight: 1.6,
                    margin: "0 0 8px",
                  }}
                >
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}

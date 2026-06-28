import { C } from "../theme.js";

export default function LegalPageLayout({
  eyebrow = "FirstStepReading",
  title,
  lastUpdated,
  intro,
  sections,
}) {
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
            {eyebrow}
          </p>
          <h1
            style={{
              color: C.blue,
              fontSize: "clamp(34px, 8vw, 56px)",
              lineHeight: 1,
              margin: 0,
            }}
          >
            {title}
          </h1>
          <p
            style={{
              color: C.gray,
              fontSize: 16,
              fontWeight: 600,
              margin: "12px 0 0",
            }}
          >
            Last updated: {lastUpdated}
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
          {intro}
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

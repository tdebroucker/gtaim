import type { Metadata } from "next";
import LinkedInLink from "./LinkedInLink";

export const metadata: Metadata = {
  title: "GTAIM — AI-powered GTM, right on target",
  description:
    "Generate a complete Go-To-Market Playbook from a product URL — powered by Claude AI.",
};

export default function Home() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=Inter:wght@400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #0A0A0F;
          --bg2: #13131A;
          --accent: #FF6B35;
          --cyan: #00D4FF;
          --text: #F0F0F0;
          --muted: #8B8B9E;
          --border: #2A2A3A;
        }

        body {
          background: var(--bg);
          color: var(--text);
          font-family: 'Inter', sans-serif;
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* NAV */
        .nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 48px;
          border-bottom: 1px solid var(--border);
          position: sticky;
          top: 0;
          background: rgba(10,10,15,0.92);
          backdrop-filter: blur(12px);
          z-index: 100;
        }
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }
        .nav-logo-text {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: var(--text);
          letter-spacing: -0.5px;
        }
        .nav-badge {
          font-size: 11px;
          font-weight: 600;
          color: var(--accent);
          border: 1px solid var(--accent);
          border-radius: 4px;
          padding: 2px 8px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          opacity: 0.85;
        }

        /* HERO */
        .hero {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 120px 24px 100px;
          position: relative;
          overflow: hidden;
        }
        .hero::before {
          content: '';
          position: absolute;
          top: -200px;
          left: 50%;
          transform: translateX(-50%);
          width: 800px;
          height: 800px;
          background: radial-gradient(circle, rgba(255,107,53,0.08) 0%, transparent 70%);
          pointer-events: none;
        }
        .hero-eyebrow {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 24px;
          opacity: 0.9;
        }
        .hero-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(40px, 6vw, 72px);
          font-weight: 700;
          line-height: 1.05;
          letter-spacing: -2px;
          max-width: 760px;
          margin-bottom: 24px;
        }
        .hero-title span {
          color: var(--accent);
        }
        .hero-sub {
          font-size: 18px;
          color: var(--muted);
          max-width: 520px;
          line-height: 1.7;
          margin-bottom: 48px;
        }
        .btn-cta {
          display: inline-flex;
          align-items: center;
          background: #FF6B35;
          color: #FFFFFF;
          border: none;
          border-radius: 4px;
          padding: 14px 28px;
          font-family: 'Inter', sans-serif;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          letter-spacing: 0.3px;
          text-decoration: none;
        }
        .btn-cta:hover {
          background: #e85e2a;
        }

        /* HOW IT WORKS */
        .section {
          padding: 100px 24px;
          max-width: 1100px;
          margin: 0 auto;
        }
        .section-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 16px;
          text-align: center;
        }
        .section-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(28px, 3vw, 40px);
          font-weight: 700;
          letter-spacing: -1px;
          text-align: center;
          margin-bottom: 64px;
        }

        .steps {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          position: relative;
        }
        .steps::before {
          content: '';
          position: absolute;
          top: 36px;
          left: calc(16.66% + 12px);
          right: calc(16.66% + 12px);
          height: 1px;
          background: linear-gradient(90deg, var(--accent), var(--border), var(--accent));
          opacity: 0.3;
        }
        .step {
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 40px 32px;
          position: relative;
          transition: border-color 0.2s;
        }
        .step:hover {
          border-color: rgba(255,107,53,0.3);
        }
        .step-number {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 48px;
          font-weight: 700;
          color: var(--accent);
          opacity: 0.15;
          line-height: 1;
          margin-bottom: 16px;
        }
        .step-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 12px;
        }
        .step-desc {
          font-size: 14px;
          color: var(--muted);
          line-height: 1.7;
        }
        .step-icon {
          width: 40px;
          height: 40px;
          background: rgba(255,107,53,0.1);
          border: 1px solid rgba(255,107,53,0.2);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          font-size: 18px;
        }

        /* OUTPUT SECTIONS */
        .divider {
          height: 1px;
          background: var(--border);
          max-width: 1100px;
          margin: 0 auto;
        }

        .outputs {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2px;
          background: var(--border);
          border: 1px solid var(--border);
          border-radius: 8px;
          overflow: hidden;
        }
        .output-card {
          background: var(--bg2);
          padding: 40px;
          transition: background 0.2s;
        }
        .output-card:hover {
          background: #16161F;
        }
        .output-num {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 12px;
          font-weight: 600;
          color: var(--accent);
          letter-spacing: 1.5px;
          margin-bottom: 16px;
        }
        .output-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 12px;
          letter-spacing: -0.3px;
        }
        .output-desc {
          font-size: 14px;
          color: var(--muted);
          line-height: 1.7;
        }
        .output-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 20px;
        }
        .tag {
          font-size: 11px;
          font-weight: 500;
          color: var(--muted);
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border);
          border-radius: 4px;
          padding: 4px 10px;
        }

        /* FOOTER */
        .footer {
          border-top: 1px solid var(--border);
          padding: 40px 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .footer-left {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .footer-name {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: var(--text);
        }
        .footer-tagline {
          font-size: 13px;
          color: var(--muted);
          font-style: italic;
        }
        .footer-right {
          font-size: 12px;
          color: var(--muted);
        }

        @media (max-width: 768px) {
          .nav { padding: 16px 24px; }
          .steps { grid-template-columns: 1fr; }
          .steps::before { display: none; }
          .outputs { grid-template-columns: 1fr; }
          .footer { flex-direction: column; gap: 16px; text-align: center; }
        }
      `}</style>

      {/* NAV */}
      <nav className="nav">
        <a href="/" className="nav-logo">
          <svg width="28" height="28" viewBox="0 0 200 200" fill="none">
            <circle cx="100" cy="100" r="95" stroke="url(#g1)" strokeWidth="10"/>
            <circle cx="100" cy="100" r="68" stroke="url(#g2)" strokeWidth="8"/>
            <circle cx="100" cy="100" r="42" stroke="url(#g3)" strokeWidth="6"/>
            <circle cx="100" cy="100" r="20" fill="url(#g4)"/>
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="200" y2="200">
                <stop stopColor="#B83A00"/><stop offset="1" stopColor="#F07030"/>
              </linearGradient>
              <linearGradient id="g2" x1="0" y1="0" x2="200" y2="200">
                <stop stopColor="#D95A10"/><stop offset="1" stopColor="#F89060"/>
              </linearGradient>
              <linearGradient id="g3" x1="0" y1="0" x2="200" y2="200">
                <stop stopColor="#F07040"/><stop offset="1" stopColor="#FBBB90"/>
              </linearGradient>
              <linearGradient id="g4" x1="0" y1="0" x2="200" y2="200">
                <stop stopColor="#F5C4A0"/><stop offset="1" stopColor="#FFFFFF"/>
              </linearGradient>
            </defs>
          </svg>
          <span className="nav-logo-text">GTAIM</span>
        </a>
        <span className="nav-badge">Coming Soon</span>
      </nav>

      {/* HERO */}
      <section className="hero">
        <p className="hero-eyebrow">AI-powered GTM</p>
        <h1 className="hero-title">
          Your GTM Playbook,<br />
          <span>right on target.</span>
        </h1>
        <p className="hero-sub">
          Paste your product URL. Answer 8 questions. Get a complete,
          structured Go-To-Market Playbook — powered by Claude AI.
        </p>
        <a href="/intake" className="btn-cta">
          Generate my GTM Playbook →
        </a>
        <p style={{marginTop: "20px", fontSize: "13px", color: "var(--muted)"}}>
          🇫🇷 Starting with France — TAM/SAM/SOM powered by SIRENE (INSEE) data.
        </p>
      </section>

      <div className="divider" />

      {/* HOW IT WORKS */}
      <div className="section">
        <p className="section-label">How it works</p>
        <h2 className="section-title">From URL to Playbook in minutes</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">01</div>
            <div className="step-icon">🔗</div>
            <div className="step-title">Drop your URL</div>
            <p className="step-desc">
              Paste your product or landing page URL. GTAIM scrapes and analyzes
              your product automatically.
            </p>
          </div>
          <div className="step">
            <div className="step-number">02</div>
            <div className="step-icon">✏️</div>
            <div className="step-title">Complete the intake</div>
            <p className="step-desc">
              A short 8-question form — pre-filled by AI from your URL. Validate,
              adjust, and add strategic context.
            </p>
          </div>
          <div className="step">
            <div className="step-number">03</div>
            <div className="step-icon">🎯</div>
            <div className="step-title">Get your Playbook</div>
            <p className="step-desc">
              Claude generates a structured GTM Playbook across 4 sections,
              ready to act on immediately.
            </p>
          </div>
        </div>
      </div>

      <div className="divider" />

      {/* OUTPUTS */}
      <div className="section">
        <p className="section-label">Playbook output</p>
        <h2 className="section-title">4 sections. Everything you need.</h2>
        <div className="outputs">
          <div className="output-card">
            <div className="output-num">01</div>
            <div className="output-title">Market & ICP</div>
            <p className="output-desc">
              Target segments, Ideal Customer Profile, and market sizing —
              TAM/SAM/SOM calculated from real data.
            </p>
            <div className="output-tags">
              <span className="tag">Segments</span>
              <span className="tag">ICP</span>
              <span className="tag">TAM/SAM/SOM</span>
              <span className="tag">🇫🇷 France-first</span>
            </div>
          </div>
          <div className="output-card">
            <div className="output-num">02</div>
            <div className="output-title">Positioning & Messaging</div>
            <p className="output-desc">
              Value proposition and key messages tailored to each persona —
              ready to use in your copy and sales deck.
            </p>
            <div className="output-tags">
              <span className="tag">Value prop</span>
              <span className="tag">Messaging</span>
              <span className="tag">Personas</span>
            </div>
          </div>
          <div className="output-card">
            <div className="output-num">03</div>
            <div className="output-title">Competitive Analysis</div>
            <p className="output-desc">
              Battlecards, key differentiators, and positioning gaps — know
              exactly where you win and why.
            </p>
            <div className="output-tags">
              <span className="tag">Battlecards</span>
              <span className="tag">Differentiators</span>
              <span className="tag">Gaps</span>
            </div>
          </div>
          <div className="output-card">
            <div className="output-num">04</div>
            <div className="output-title">GTM Recommendations</div>
            <p className="output-desc">
              PLG, SLG, or ABM initiatives recommended based on your growth
              stage — prioritized and actionable.
            </p>
            <div className="output-tags">
              <span className="tag">PLG</span>
              <span className="tag">SLG</span>
              <span className="tag">ABM</span>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-left">
          <span className="footer-name">GTAIM — {new Date().getFullYear()}</span>
          <span className="footer-tagline">AI-powered GTM, right on target.</span>
        </div>
        <span className="footer-right">
          A personal project by{" "}
          <LinkedInLink />{" "}
          — putting Claude Code to work for the GTM community.
        </span>
      </footer>
    </>
  );
}

"use client";

import { useState } from "react";

type Step = 0 | 1 | 2 | 3 | 4;

type Step1Data = {
  productName: string;
  valueProposition: string;
  targetSectors: string;
  customerType: string;
};

const initialStep1: Step1Data = {
  productName: "",
  valueProposition: "",
  targetSectors: "",
  customerType: "",
};

const URL_REGEX = /^https?:\/\/([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#\-_]*)?$/i;

export default function IntakePage() {
  const [step, setStep] = useState<Step>(0);

  // Step 0 state
  const [url, setUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [urlError, setUrlError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  // Step 1 state
  const [step1, setStep1] = useState<Step1Data>(initialStep1);

  // Step 2–4 state
  const [purchaseTrigger, setPurchaseTrigger] = useState("");
  const [painPoint, setPainPoint] = useState("");
  const [competitors, setCompetitors] = useState("");
  const [companyStage, setCompanyStage] = useState("");

  const progressPercent = step === 0 ? 0 : step * 25;

  function validateUrl(value: string): boolean {
    if (!value.trim()) {
      setUrlError("Please enter a valid URL (e.g. https://yourproduct.com)");
      return false;
    }
    if (!URL_REGEX.test(value.trim())) {
      setUrlError("Please enter a valid URL (e.g. https://yourproduct.com)");
      return false;
    }
    setUrlError("");
    return true;
  }

  async function handleAnalyze() {
    if (!validateUrl(url)) return;
    setLoading(true);
    try {
      const res = await fetch("/api/analyze-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), apiKey }),
      });
      const data = await res.json();
      setStep1({
        productName: data.productName ?? "",
        valueProposition: data.valueProposition ?? "",
        targetSectors: data.targetSectors ?? "",
        customerType: data.customerType ?? "",
      });
      setStep(1);
    } catch {
      // stay on step 0
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setStep(0);
    setUrl("");
    setApiKey("");
    setUrlError("");
    setStep1(initialStep1);
    setPurchaseTrigger("");
    setPainPoint("");
    setCompetitors("");
    setCompanyStage("");
  }

  const btnBase: React.CSSProperties = {
    width: "100%",
    padding: "13px 0",
    backgroundColor: "#FF6B35",
    color: "#FFFFFF",
    fontFamily: "Inter, sans-serif",
    fontWeight: 600,
    fontSize: 15,
    borderRadius: 4,
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.15s",
  };

  const btnDisabled: React.CSSProperties = {
    ...btnBase,
    backgroundColor: "#4A3020",
    cursor: "not-allowed",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0A0A0F",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 16px",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=Inter:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input, textarea, select {
          width: 100%;
          background: #0A0A0F;
          border: 1px solid #2A2A3A;
          border-radius: 8px;
          color: #F0F0F0;
          font-family: Inter, sans-serif;
          font-size: 15px;
          padding: 12px 14px;
          outline: none;
          transition: border-color 0.15s;
          resize: vertical;
        }
        input::placeholder, textarea::placeholder { color: #8B8B9E; }
        input:focus, textarea:focus, select:focus { border-color: #FF6B35; }
        select option { background: #13131A; color: #F0F0F0; }
        label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: Inter, sans-serif;
          font-size: 12px;
          font-weight: 500;
          color: #8B8B9E;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Logo */}
      <a
        href="/"
        style={{
          fontFamily: "Space Grotesk, sans-serif",
          fontWeight: 700,
          fontSize: 22,
          color: "#FF6B35",
          marginBottom: 32,
          letterSpacing: "-0.02em",
          textDecoration: "none",
        }}
      >
        GTAIM
      </a>

      {/* Progress bar (steps 1–4 only) */}
      {step > 0 && (
        <div style={{ width: "100%", maxWidth: 520, marginBottom: 24 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#8B8B9E" }}>
              Step {step} of 4
            </span>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#8B8B9E" }}>
              {progressPercent}%
            </span>
          </div>
          <div
            style={{
              height: 4,
              backgroundColor: "#2A2A3A",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progressPercent}%`,
                backgroundColor: "#FF6B35",
                borderRadius: 2,
                transition: "width 0.3s ease",
              }}
            />
          </div>
        </div>
      )}

      {/* Card */}
      <div
        style={{
          width: "100%",
          maxWidth: 520,
          backgroundColor: "#13131A",
          border: "1px solid #2A2A3A",
          borderRadius: 8,
          boxShadow: "0 4px 20px rgba(255, 107, 53, 0.05)",
          padding: "36px 40px",
        }}
      >
        {/* ───── STEP 0 ───── */}
        {step === 0 && (
          <div>
            <h1
              style={{
                fontFamily: "Space Grotesk, sans-serif",
                fontSize: 24,
                fontWeight: 600,
                color: "#F0F0F0",
                marginBottom: 8,
              }}
            >
              Generate your GTM Playbook
            </h1>
            <p
              style={{
                fontSize: 15,
                color: "#8B8B9E",
                marginBottom: 28,
                lineHeight: 1.5,
              }}
            >
              Paste your product URL and we'll analyze it to pre-fill your playbook in seconds.
            </p>

            {/* URL field */}
            <div style={{ marginBottom: 20 }}>
              <label>Product URL</label>
              <input
                type="text"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (urlError) setUrlError("");
                }}
                placeholder="https://yourproduct.com"
                style={urlError ? { borderColor: "#FF4444" } : {}}
              />
              {urlError && (
                <p
                  style={{
                    fontSize: 12,
                    color: "#FF4444",
                    marginTop: 6,
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {urlError}
                </p>
              )}
            </div>

            {/* API Key field with tooltip */}
            <div style={{ marginBottom: 8 }}>
              <label>
                Anthropic API Key
                <span style={{ position: "relative", display: "inline-flex" }}>
                  <button
                    type="button"
                    onMouseEnter={() => setTooltipVisible(true)}
                    onMouseLeave={() => setTooltipVisible(false)}
                    onClick={() => setTooltipVisible((v) => !v)}
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      border: "1px solid #2A2A3A",
                      background: "#0A0A0F",
                      color: "#8B8B9E",
                      fontSize: 10,
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 0,
                      lineHeight: 1,
                      flexShrink: 0,
                    }}
                    aria-label="API key help"
                  >
                    ?
                  </button>
                  {tooltipVisible && (
                    <div
                      style={{
                        position: "absolute",
                        left: 22,
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 10,
                        backgroundColor: "#13131A",
                        border: "1px solid #2A2A3A",
                        borderRadius: 8,
                        padding: "12px 14px",
                        maxWidth: 300,
                        width: "max-content",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
                      }}
                    >
                      <p
                        style={{
                          fontSize: 12,
                          color: "#F0F0F0",
                          lineHeight: 1.6,
                          fontFamily: "Inter, sans-serif",
                          fontWeight: 400,
                          textTransform: "none",
                          letterSpacing: "normal",
                        }}
                      >
                        GTAIM uses your own Anthropic API key to analyze your product and generate
                        your playbook. Your key is never stored on our servers.
                        <br />
                        <br />
                        → Get your key at{" "}
                        <span style={{ color: "#FF6B35" }}>console.anthropic.com</span> (API Keys →
                        Create Key)
                        <br />
                        → Save it in a password manager (e.g. 1Password) for future use
                      </p>
                    </div>
                  )}
                </span>
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-ant-..."
              />
            </div>

            <p style={{ fontSize: 12, color: "#8B8B9E", marginBottom: 28 }}>
              Your key is used only for this session and never stored.
            </p>

            <button
              onClick={handleAnalyze}
              disabled={loading || !url.trim() || !apiKey.trim()}
              style={
                loading || !url.trim() || !apiKey.trim() ? btnDisabled : btnBase
              }
            >
              {loading ? (
                <span
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                >
                  <span
                    style={{
                      width: 16,
                      height: 16,
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: "#FFFFFF",
                      borderRadius: "50%",
                      display: "inline-block",
                      animation: "spin 0.7s linear infinite",
                    }}
                  />
                  Analyzing…
                </span>
              ) : (
                "Analyze my product →"
              )}
            </button>
          </div>
        )}

        {/* ───── STEP 1 ───── */}
        {step === 1 && (
          <div>
            <button
              onClick={() => setStep(0)}
              style={{
                background: "none",
                border: "none",
                color: "#8B8B9E",
                fontFamily: "Inter, sans-serif",
                fontSize: 14,
                cursor: "pointer",
                padding: 0,
                marginBottom: 20,
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              ← Back
            </button>

            <h2
              style={{
                fontFamily: "Space Grotesk, sans-serif",
                fontSize: 22,
                fontWeight: 600,
                color: "#F0F0F0",
                marginBottom: 8,
              }}
            >
              Here's what we found — confirm or adjust
            </h2>
            <p style={{ fontSize: 14, color: "#8B8B9E", marginBottom: 28 }}>
              Claude analyzed your product page. Edit anything that's off.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div>
                <label>Product name</label>
                <input
                  type="text"
                  value={step1.productName}
                  onChange={(e) => setStep1((s) => ({ ...s, productName: e.target.value }))}
                />
              </div>
              <div>
                <label>Value proposition in one sentence</label>
                <textarea
                  rows={2}
                  value={step1.valueProposition}
                  onChange={(e) => setStep1((s) => ({ ...s, valueProposition: e.target.value }))}
                />
              </div>
              <div>
                <label>Target sector(s)</label>
                <input
                  type="text"
                  value={step1.targetSectors}
                  onChange={(e) => setStep1((s) => ({ ...s, targetSectors: e.target.value }))}
                  placeholder="e.g. HR Tech, Mid-Market SaaS"
                />
              </div>
              <div>
                <label>Primary customer type</label>
                <select
                  value={step1.customerType}
                  onChange={(e) => setStep1((s) => ({ ...s, customerType: e.target.value }))}
                >
                  <option value="" disabled>Select…</option>
                  <option value="PME">PME</option>
                  <option value="Mid-Market">Mid-Market</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
              </div>
            </div>

            <button onClick={() => setStep(2)} style={{ ...btnBase, marginTop: 28 }}>
              Looks good, continue →
            </button>

            <StartOver onReset={handleReset} />
          </div>
        )}

        {/* ───── STEP 2 ───── */}
        {step === 2 && (
          <div>
            <button
              onClick={() => setStep(1)}
              style={{
                background: "none",
                border: "none",
                color: "#8B8B9E",
                fontFamily: "Inter, sans-serif",
                fontSize: 14,
                cursor: "pointer",
                padding: 0,
                marginBottom: 20,
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              ← Back
            </button>

            <h2
              style={{
                fontFamily: "Space Grotesk, sans-serif",
                fontSize: 22,
                fontWeight: 600,
                color: "#F0F0F0",
                marginBottom: 28,
              }}
            >
              Who triggers the purchase?
            </h2>

            <textarea
              rows={5}
              value={purchaseTrigger}
              onChange={(e) => setPurchaseTrigger(e.target.value)}
              placeholder="Describe the situation or context that makes someone buy your product. e.g. A startup that just raised a Seed round and needs to structure their sales process. A VP Sales with a team > 5 reps."
            />

            <button
              onClick={() => setStep(3)}
              disabled={!purchaseTrigger.trim()}
              style={
                purchaseTrigger.trim()
                  ? { ...btnBase, marginTop: 28 }
                  : { ...btnDisabled, marginTop: 28 }
              }
            >
              Continue →
            </button>

            <StartOver onReset={handleReset} />
          </div>
        )}

        {/* ───── STEP 3 ───── */}
        {step === 3 && (
          <div>
            <button
              onClick={() => setStep(2)}
              style={{
                background: "none",
                border: "none",
                color: "#8B8B9E",
                fontFamily: "Inter, sans-serif",
                fontSize: 14,
                cursor: "pointer",
                padding: 0,
                marginBottom: 20,
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              ← Back
            </button>

            <h2
              style={{
                fontFamily: "Space Grotesk, sans-serif",
                fontSize: 22,
                fontWeight: 600,
                color: "#F0F0F0",
                marginBottom: 28,
              }}
            >
              What's the #1 pain point you solve?
            </h2>

            <textarea
              rows={5}
              value={painPoint}
              onChange={(e) => setPainPoint(e.target.value)}
              placeholder="Be specific. e.g. Sales reps waste 3h/week copy-pasting data between tools. No visibility on pipeline health until it's too late."
            />

            <button
              onClick={() => setStep(4)}
              disabled={!painPoint.trim()}
              style={
                painPoint.trim()
                  ? { ...btnBase, marginTop: 28 }
                  : { ...btnDisabled, marginTop: 28 }
              }
            >
              Continue →
            </button>

            <StartOver onReset={handleReset} />
          </div>
        )}

        {/* ───── STEP 4 ───── */}
        {step === 4 && (
          <div>
            <button
              onClick={() => setStep(3)}
              style={{
                background: "none",
                border: "none",
                color: "#8B8B9E",
                fontFamily: "Inter, sans-serif",
                fontSize: 14,
                cursor: "pointer",
                padding: 0,
                marginBottom: 20,
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              ← Back
            </button>

            <h2
              style={{
                fontFamily: "Space Grotesk, sans-serif",
                fontSize: 22,
                fontWeight: 600,
                color: "#F0F0F0",
                marginBottom: 8,
              }}
            >
              Last two questions
            </h2>
            <p style={{ fontSize: 14, color: "#8B8B9E", marginBottom: 28 }}>
              Almost there — just the competitive context.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div>
                <label>Top 2-3 competitors your prospects mention</label>
                <input
                  type="text"
                  value={competitors}
                  onChange={(e) => setCompetitors(e.target.value)}
                  placeholder="e.g. HubSpot, Pipedrive, Monday"
                />
              </div>
              <div>
                <label>Company stage</label>
                <select
                  value={companyStage}
                  onChange={(e) => setCompanyStage(e.target.value)}
                >
                  <option value="" disabled>Select…</option>
                  <option value="Pre-seed">Pre-seed</option>
                  <option value="Seed">Seed</option>
                  <option value="Series A">Series A</option>
                  <option value="Scale">Scale</option>
                </select>
              </div>
            </div>

            <button
              disabled={!competitors.trim() || !companyStage}
              style={
                competitors.trim() && companyStage
                  ? { ...btnBase, marginTop: 28 }
                  : { ...btnDisabled, marginTop: 28 }
              }
            >
              Generate my GTM Playbook →
            </button>

            <StartOver onReset={handleReset} />
          </div>
        )}
      </div>
    </div>
  );
}

function StartOver({ onReset }: { onReset: () => void }) {
  return (
    <div style={{ textAlign: "center", marginTop: 20 }}>
      <button
        onClick={onReset}
        style={{
          background: "none",
          border: "none",
          color: "#8B8B9E",
          fontFamily: "Inter, sans-serif",
          fontSize: 12,
          cursor: "pointer",
          textDecoration: "underline",
          padding: 0,
        }}
      >
        Start over
      </button>
    </div>
  );
}

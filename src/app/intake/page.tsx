"use client";

import { useState, useEffect, useRef } from "react";

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

function normalizeUrl(value: string): string {
  if (!/^https?:\/\//i.test(value)) return "https://" + value;
  return value;
}

export default function IntakePage() {
  const [step, setStep] = useState<Step>(0);

  // Step 0
  const [url, setUrl] = useState("");
  const [noWebsite, setNoWebsite] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [urlError, setUrlError] = useState("");
  const [apiKeyError, setApiKeyError] = useState("");
  const [urlWarning, setUrlWarning] = useState(""); // non-blocking fetch warning
  const [loading, setLoading] = useState(false);
  const [apiKeyTooltip, setApiKeyTooltip] = useState(false);

  // Step 1
  const [step1, setStep1] = useState<Step1Data>(initialStep1);

  // Steps 2–4
  const [purchaseTrigger, setPurchaseTrigger] = useState("");
  const [painPoint, setPainPoint] = useState("");
  const [competitors, setCompetitors] = useState("");
  const [companyStage, setCompanyStage] = useState("");

  // Tooltips for steps 2 & 3
  const [tooltip2, setTooltip2] = useState(false);
  const [tooltip3, setTooltip3] = useState(false);

  const progressPercent = step === 0 ? 0 : step * 25;

  function validateUrl(value: string): boolean {
    const v = value.trim();
    if (!v || v.includes(" ") || !v.includes(".")) {
      setUrlError("Please enter a valid URL (e.g. https://yourproduct.com)");
      return false;
    }
    setUrlError("");
    return true;
  }

  async function handleAnalyze() {
    // API key always required
    if (!apiKey.trim()) {
      setApiKeyError("Please enter your Anthropic API key to continue.");
      return;
    }
    setApiKeyError("");

    // No website — skip analysis, go straight to step 1 empty
    if (noWebsite) {
      setStep1(initialStep1);
      setStep(1);
      return;
    }

    // URL validation
    if (!validateUrl(url)) return;

    setLoading(true);
    setUrlWarning("");

    try {
      const normalizedUrl = normalizeUrl(url.trim());
      const res = await fetch("/api/analyze-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: normalizedUrl, apiKey }),
      });
      const data = await res.json();

      if (data.error === "auth_error") {
        setApiKeyError(
          "Invalid API key. Check your key at console.anthropic.com"
        );
        return;
      }

      if (data.error === "url_unreachable" || data.error) {
        setUrlWarning(
          "We couldn't read this URL. Please fill in the fields manually."
        );
        setStep1(initialStep1);
        return; // stay on step 0 — user can "Continue anyway"
      }

      setStep1({
        productName: data.productName ?? "",
        valueProposition: data.valueProposition ?? "",
        targetSectors: data.targetSectors ?? "",
        customerType: data.customerType ?? "",
      });
      if (data.primaryPainPoint) setPainPoint(data.primaryPainPoint);
      setStep(1);
    } catch {
      setUrlWarning(
        "We couldn't read this URL. Please fill in the fields manually."
      );
      setStep1(initialStep1);
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setStep(0);
    setUrl("");
    setNoWebsite(false);
    setApiKey("");
    setUrlError("");
    setApiKeyError("");
    setUrlWarning("");
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

  const backBtn: React.CSSProperties = {
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
  };

  const tooltipBox: React.CSSProperties = {
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
  };

  const tooltipText: React.CSSProperties = {
    fontSize: 12,
    color: "#F0F0F0",
    lineHeight: 1.6,
    fontFamily: "Inter, sans-serif",
    fontWeight: 400,
    textTransform: "none",
    letterSpacing: "normal",
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
        input:not([type="checkbox"]), textarea, select {
          width: 100%;
          background: #0A0A0F;
          border: 1px solid #2A2A3A;
          border-radius: 8px;
          color: #F0F0F0;
          font-family: Inter, sans-serif;
          font-size: 15px;
          padding: 12px 14px 14px;
          outline: none;
          transition: border-color 0.15s;
          resize: none;
        }
        input:not([type="checkbox"])::placeholder, textarea::placeholder { color: #8B8B9E; }
        input:not([type="checkbox"]):focus, textarea:focus, select:focus { border-color: #FF6B35; }
        input:not([type="checkbox"]):disabled { opacity: 0.4; cursor: not-allowed; }
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

      {/* Progress bar */}
      {step > 0 && (
        <div style={{ width: "100%", maxWidth: 720, marginBottom: 24 }}>
          <div
            style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}
          >
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#8B8B9E" }}>
              Step {step} of 4
            </span>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#8B8B9E" }}>
              {progressPercent}%
            </span>
          </div>
          <div style={{ height: 4, backgroundColor: "#2A2A3A", borderRadius: 2, overflow: "hidden" }}>
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
          maxWidth: 720,
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
            <p style={{ fontSize: 15, color: "#8B8B9E", marginBottom: 28, lineHeight: 1.5 }}>
              Paste your product URL and we'll analyze it to pre-fill your playbook in seconds.
            </p>

            {/* URL field */}
            <div style={{ marginBottom: 16 }}>
              <label>Product URL</label>
              <input
                type="text"
                value={url}
                disabled={noWebsite}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (urlError) setUrlError("");
                  if (urlWarning) setUrlWarning("");
                }}
                placeholder="https://yourproduct.com"
                style={urlError ? { borderColor: "#FF4444" } : {}}
              />
              {urlError && (
                <p style={{ fontSize: 12, color: "#FF4444", marginTop: 6, fontFamily: "Inter, sans-serif" }}>
                  {urlError}
                </p>
              )}

              {/* Checkbox */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginTop: 10 }}>
                <input
                  type="checkbox"
                  id="no-website"
                  checked={noWebsite}
                  onChange={(e) => {
                    setNoWebsite(e.target.checked);
                    if (e.target.checked) { setUrlError(""); setUrlWarning(""); }
                  }}
                  style={{ marginTop: 2, accentColor: "#FF6B35", width: 14, height: 14, flexShrink: 0 }}
                />
                <label
                  htmlFor="no-website"
                  style={{
                    textTransform: "none",
                    letterSpacing: "normal",
                    fontSize: 13,
                    color: "#8B8B9E",
                    cursor: "pointer",
                    marginBottom: 0,
                  }}
                >
                  I don't have a website yet
                </label>
              </div>

              {noWebsite && (
                <p style={{ marginTop: 10, fontSize: 13, color: "#FF6B35", lineHeight: 1.6 }}>
                  Without a URL, Claude won't be able to pre-fill the form. The quality of your GTM
                  Playbook will depend entirely on the information you provide in the next steps.
                </p>
              )}
            </div>

            {/* API Key field */}
            <div style={{ marginBottom: 8 }}>
              <label>
                Anthropic API Key
                <span style={{ position: "relative", display: "inline-flex" }}>
                  <button
                    type="button"
                    onMouseEnter={() => setApiKeyTooltip(true)}
                    onMouseLeave={() => setApiKeyTooltip(false)}
                    onClick={() => setApiKeyTooltip((v) => !v)}
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      border: "1px solid rgba(255,107,53,0.4)",
                      background: "#0A0A0F",
                      color: "#FF6B35",
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
                  {apiKeyTooltip && (
                    <div style={{ ...tooltipBox, maxWidth: 320 }}>
                      <p style={tooltipText}>
                        GTAIM uses your own Anthropic API key to analyze your product and generate
                        your playbook. Your key is never stored on our servers.
                      </p>

                      <p style={{ ...tooltipText, marginTop: 10 }}>
                        → Get your free API key at{" "}
                        <a
                          href="https://console.anthropic.com/settings/api-keys"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#FF6B35", textDecoration: "underline" }}
                        >
                          console.anthropic.com
                        </a>{" "}
                        → API keys
                      </p>

                      <div
                        style={{
                          marginTop: 10,
                          padding: "8px 10px",
                          backgroundColor: "rgba(255,107,53,0.08)",
                          border: "1px solid rgba(255,107,53,0.25)",
                          borderRadius: 6,
                        }}
                      >
                        <p style={{ ...tooltipText, color: "#FF6B35" }}>
                          ⚠️ Claude.ai Pro/Max subscriptions don't include API access. You need a
                          separate account at console.anthropic.com with prepaid credits.
                        </p>
                      </div>

                      <p style={{ ...tooltipText, marginTop: 10, color: "#8B8B9E" }}>
                        GTAIM uses ~$0.04 per playbook generated. $5 in credits = ~125 playbooks.
                      </p>

                      <p style={{ ...tooltipText, marginTop: 8 }}>
                        →{" "}
                        <a
                          href="https://console.anthropic.com/settings/billing"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#FF6B35", textDecoration: "underline" }}
                        >
                          console.anthropic.com/settings/billing
                        </a>
                      </p>
                    </div>
                  )}
                </span>
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  if (apiKeyError) setApiKeyError("");
                }}
                placeholder="sk-ant-..."
                style={apiKeyError ? { borderColor: "#FF4444" } : {}}
              />
              {apiKeyError && (
                <p style={{ fontSize: 12, color: "#FF4444", marginTop: 6, fontFamily: "Inter, sans-serif" }}>
                  {apiKeyError}
                </p>
              )}
            </div>

            <p style={{ fontSize: 12, color: "#8B8B9E", marginBottom: 28 }}>
              Your key is used only for this session and never stored.
            </p>

            <button
              onClick={handleAnalyze}
              disabled={loading || !apiKey.trim() || (!noWebsite && !url.trim())}
              style={
                loading || !apiKey.trim() || (!noWebsite && !url.trim())
                  ? btnDisabled
                  : btnBase
              }
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
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

            {/* Non-blocking URL warning */}
            {urlWarning && (
              <div
                style={{
                  marginTop: 16,
                  padding: "14px 16px",
                  backgroundColor: "rgba(255,107,53,0.07)",
                  border: "1px solid rgba(255,107,53,0.3)",
                  borderRadius: 8,
                }}
              >
                <p style={{ fontSize: 13, color: "#FF6B35", lineHeight: 1.5, marginBottom: 12 }}>
                  {urlWarning}
                </p>
                <button
                  onClick={() => { setUrlWarning(""); setStep(1); }}
                  style={{ ...btnBase, padding: "10px 0", fontSize: 14 }}
                >
                  Continue anyway →
                </button>
              </div>
            )}
          </div>
        )}

        {/* ───── STEP 1 ───── */}
        {step === 1 && (
          <div>
            <button onClick={() => setStep(0)} style={backBtn}>← Back</button>

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
                <AutoTextarea
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
                  <option value="B2C">B2C / Particulier</option>
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
            <button onClick={() => setStep(1)} style={backBtn}>← Back</button>

            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
              <h2
                style={{
                  fontFamily: "Space Grotesk, sans-serif",
                  fontSize: 22,
                  fontWeight: 600,
                  color: "#F0F0F0",
                }}
              >
                Who triggers the purchase?
              </h2>
              <span style={{ position: "relative", display: "inline-flex", flexShrink: 0 }}>
                <button
                  type="button"
                  onMouseEnter={() => setTooltip2(true)}
                  onMouseLeave={() => setTooltip2(false)}
                  onClick={() => setTooltip2((v) => !v)}
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    border: "1px solid rgba(255,107,53,0.4)",
                    background: "#0A0A0F",
                    color: "#FF6B35",
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0,
                    flexShrink: 0,
                  }}
                >
                  ?
                </button>
                {tooltip2 && (
                  <div style={tooltipBox}>
                    <p style={tooltipText}>
                      Claude has pre-filled this based on your product URL. Enrich or correct it
                      for a more accurate GTM Playbook.
                    </p>
                  </div>
                )}
              </span>
            </div>

            <AutoTextarea
              value={purchaseTrigger}
              onChange={(e) => setPurchaseTrigger(e.target.value)}
              placeholder="Describe the situation or context that makes someone buy your product. e.g. A startup that just raised a Seed round and needs to structure their sales process. A VP Sales with a team > 5 reps."
              minRows={5}
            />

            <button onClick={() => setStep(3)} style={{ ...btnBase, marginTop: 28 }}>
              Continue →
            </button>
            <StartOver onReset={handleReset} />
          </div>
        )}

        {/* ───── STEP 3 ───── */}
        {step === 3 && (
          <div>
            <button onClick={() => setStep(2)} style={backBtn}>← Back</button>

            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
              <h2
                style={{
                  fontFamily: "Space Grotesk, sans-serif",
                  fontSize: 22,
                  fontWeight: 600,
                  color: "#F0F0F0",
                }}
              >
                What's the #1 pain point you solve?
              </h2>
              <span style={{ position: "relative", display: "inline-flex", flexShrink: 0 }}>
                <button
                  type="button"
                  onMouseEnter={() => setTooltip3(true)}
                  onMouseLeave={() => setTooltip3(false)}
                  onClick={() => setTooltip3((v) => !v)}
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    border: "1px solid rgba(255,107,53,0.4)",
                    background: "#0A0A0F",
                    color: "#FF6B35",
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0,
                    flexShrink: 0,
                  }}
                >
                  ?
                </button>
                {tooltip3 && (
                  <div style={tooltipBox}>
                    <p style={tooltipText}>
                      Claude has pre-filled this based on your product URL. Enrich or correct it
                      for a more accurate GTM Playbook.
                    </p>
                  </div>
                )}
              </span>
            </div>

            <AutoTextarea
              value={painPoint}
              onChange={(e) => setPainPoint(e.target.value)}
              placeholder="Be specific. e.g. Sales reps waste 3h/week copy-pasting data between tools. No visibility on pipeline health until it's too late."
              minRows={5}
            />

            <button onClick={() => setStep(4)} style={{ ...btnBase, marginTop: 28 }}>
              Continue →
            </button>
            <StartOver onReset={handleReset} />
          </div>
        )}

        {/* ───── STEP 4 ───── */}
        {step === 4 && (
          <div>
            <button onClick={() => setStep(3)} style={backBtn}>← Back</button>

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
                  placeholder="We couldn't identify competitors — add them manually"
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
                <p style={{ fontSize: 12, color: "#8B8B9E", marginTop: 6, fontFamily: "Inter, sans-serif" }}>
                  Not sure? Check your last funding round or team size.
                </p>
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

function AutoTextarea({
  value,
  onChange,
  placeholder,
  minRows = 1,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  minRows?: number;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }, [value]);

  return (
    <textarea
      ref={ref}
      rows={minRows}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{ overflow: "hidden" }}
      onInput={(e) => {
        const t = e.currentTarget;
        t.style.height = "auto";
        t.style.height = t.scrollHeight + "px";
      }}
    />
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

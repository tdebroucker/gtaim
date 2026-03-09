"use client";

import { useState } from "react";

type Step1Data = {
  productName: string;
  valueProposition: string;
  targetSector: string;
  customerType: string;
};

type Step2Data = {
  purchaseTrigger: string;
  painPoint: string;
  competitors: string;
  companyStage: string;
};

const initialStep1: Step1Data = {
  productName: "",
  valueProposition: "",
  targetSector: "",
  customerType: "",
};

const initialStep2: Step2Data = {
  purchaseTrigger: "",
  painPoint: "",
  competitors: "",
  companyStage: "",
};

export default function IntakePage() {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [url, setUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [step1, setStep1] = useState<Step1Data>(initialStep1);
  const [step2, setStep2] = useState<Step2Data>(initialStep2);

  const progressPercent = step === 1 ? 50 : step === 2 ? 100 : 0;

  async function handleAnalyze() {
    setLoading(true);
    try {
      const res = await fetch("/api/analyze-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, apiKey }),
      });
      const data = await res.json();
      setStep1({
        productName: data.productName ?? "",
        valueProposition: data.valueProposition ?? "",
        targetSector: data.targetSector ?? "",
        customerType: data.customerType ?? "",
      });
      setStep(1);
    } catch {
      // keep loading off and stay on step 0
    } finally {
      setLoading(false);
    }
  }

  const step2Complete =
    step2.purchaseTrigger.trim() !== "" &&
    step2.painPoint.trim() !== "" &&
    step2.competitors.trim() !== "" &&
    step2.companyStage !== "";

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
        input::placeholder, textarea::placeholder {
          color: #8B8B9E;
        }
        input:focus, textarea:focus, select:focus {
          border-color: #FF6B35;
        }
        select option {
          background: #13131A;
          color: #F0F0F0;
        }
        label {
          display: block;
          font-family: Inter, sans-serif;
          font-size: 12px;
          font-weight: 500;
          color: #8B8B9E;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
      `}</style>

      {/* Logo / wordmark */}
      <div
        style={{
          fontFamily: "Space Grotesk, sans-serif",
          fontWeight: 700,
          fontSize: 22,
          color: "#FF6B35",
          marginBottom: 32,
          letterSpacing: "-0.02em",
        }}
      >
        GTAIM
      </div>

      {/* Progress bar (only steps 1 & 2) */}
      {step > 0 && (
        <div style={{ width: "100%", maxWidth: 520, marginBottom: 24 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 13,
                color: "#8B8B9E",
              }}
            >
              Step {step} of 2
            </span>
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 13,
                color: "#8B8B9E",
              }}
            >
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
                fontFamily: "Inter, sans-serif",
                fontSize: 15,
                color: "#8B8B9E",
                marginBottom: 28,
                lineHeight: 1.5,
              }}
            >
              Paste your product URL and we'll analyze it to pre-fill your playbook in seconds.
            </p>

            <div style={{ marginBottom: 20 }}>
              <label>Product URL</label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://yourproduct.com"
              />
            </div>

            <div style={{ marginBottom: 8 }}>
              <label>Anthropic API Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-ant-..."
              />
            </div>

            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 12,
                color: "#8B8B9E",
                marginBottom: 28,
              }}
            >
              Your key is used only for this session and never stored.
            </p>

            <button
              onClick={handleAnalyze}
              disabled={loading || !url.trim() || !apiKey.trim()}
              style={{
                width: "100%",
                padding: "13px 0",
                backgroundColor:
                  loading || !url.trim() || !apiKey.trim() ? "#4A3020" : "#FF6B35",
                color: "#FFFFFF",
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
                fontSize: 15,
                borderRadius: 4,
                border: "none",
                cursor:
                  loading || !url.trim() || !apiKey.trim() ? "not-allowed" : "pointer",
                transition: "background-color 0.15s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              {loading ? (
                <>
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
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                  Analyzing…
                </>
              ) : (
                "Analyze my product →"
              )}
            </button>
          </div>
        )}

        {/* ───── STEP 1 ───── */}
        {step === 1 && (
          <div>
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
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 14,
                color: "#8B8B9E",
                marginBottom: 28,
              }}
            >
              Claude analyzed your product page. Edit anything that's off.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div>
                <label>Product name</label>
                <input
                  type="text"
                  value={step1.productName}
                  onChange={(e) =>
                    setStep1((s) => ({ ...s, productName: e.target.value }))
                  }
                />
              </div>

              <div>
                <label>Value proposition in one sentence</label>
                <textarea
                  rows={2}
                  value={step1.valueProposition}
                  onChange={(e) =>
                    setStep1((s) => ({ ...s, valueProposition: e.target.value }))
                  }
                />
              </div>

              <div>
                <label>Target sector(s)</label>
                <input
                  type="text"
                  value={step1.targetSector}
                  onChange={(e) =>
                    setStep1((s) => ({ ...s, targetSector: e.target.value }))
                  }
                  placeholder="e.g. HR Tech, Mid-Market SaaS"
                />
              </div>

              <div>
                <label>Primary customer type</label>
                <select
                  value={step1.customerType}
                  onChange={(e) =>
                    setStep1((s) => ({ ...s, customerType: e.target.value }))
                  }
                >
                  <option value="" disabled>
                    Select…
                  </option>
                  <option value="SMB">PME</option>
                  <option value="Mid-Market">Mid-Market</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              style={{
                width: "100%",
                marginTop: 28,
                padding: "13px 0",
                backgroundColor: "#FF6B35",
                color: "#FFFFFF",
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
                fontSize: 15,
                borderRadius: 4,
                border: "none",
                cursor: "pointer",
              }}
            >
              Looks good, continue →
            </button>
          </div>
        )}

        {/* ───── STEP 2 ───── */}
        {step === 2 && (
          <div>
            <h2
              style={{
                fontFamily: "Space Grotesk, sans-serif",
                fontSize: 22,
                fontWeight: 600,
                color: "#F0F0F0",
                marginBottom: 8,
              }}
            >
              A few more details to sharpen your playbook
            </h2>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 14,
                color: "#8B8B9E",
                marginBottom: 28,
              }}
            >
              These signals help Claude craft a playbook that matches your real context.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div>
                <label>Who triggers the purchase?</label>
                <textarea
                  rows={2}
                  value={step2.purchaseTrigger}
                  onChange={(e) =>
                    setStep2((s) => ({ ...s, purchaseTrigger: e.target.value }))
                  }
                  placeholder="e.g. a startup that just raised, a Sales team > 5 people looking to structure their pipeline"
                />
              </div>

              <div>
                <label>Primary pain point you solve</label>
                <textarea
                  rows={2}
                  value={step2.painPoint}
                  onChange={(e) =>
                    setStep2((s) => ({ ...s, painPoint: e.target.value }))
                  }
                  placeholder="e.g. Sales reps waste 3h/week on manual reporting"
                />
              </div>

              <div>
                <label>Top 2-3 competitors your prospects mention</label>
                <input
                  type="text"
                  value={step2.competitors}
                  onChange={(e) =>
                    setStep2((s) => ({ ...s, competitors: e.target.value }))
                  }
                  placeholder="e.g. HubSpot, Pipedrive, Monday"
                />
              </div>

              <div>
                <label>Company stage</label>
                <select
                  value={step2.companyStage}
                  onChange={(e) =>
                    setStep2((s) => ({ ...s, companyStage: e.target.value }))
                  }
                >
                  <option value="" disabled>
                    Select…
                  </option>
                  <option value="Pre-seed">Pre-seed</option>
                  <option value="Seed">Seed</option>
                  <option value="Series A">Series A</option>
                  <option value="Scale">Scale</option>
                </select>
              </div>
            </div>

            <button
              disabled={!step2Complete}
              style={{
                width: "100%",
                marginTop: 28,
                padding: "13px 0",
                backgroundColor: step2Complete ? "#FF6B35" : "#4A3020",
                color: "#FFFFFF",
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
                fontSize: 15,
                borderRadius: 4,
                border: "none",
                cursor: step2Complete ? "pointer" : "not-allowed",
                transition: "background-color 0.15s",
              }}
            >
              Generate my GTM Playbook →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

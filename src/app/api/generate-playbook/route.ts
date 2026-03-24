import { NextRequest, NextResponse } from "next/server";

// Four sequential Anthropic calls — one per chapter, up to 4 000 tokens each
// Edge runtime: timeout applies per-chunk, not total duration — safe for long generations
// Combined stream is piped to the client without interruption
export const runtime = "edge";

function extractText(html: string): string {
  let text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ");
  text = text.replace(/<[^>]+>/g, " ");
  text = text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
  return text.replace(/\s+/g, " ").trim().slice(0, 12000);
}

async function pipeAnthropicStream(
  body: ReadableStream<Uint8Array>,
  controller: ReadableStreamDefaultController<Uint8Array>
): Promise<void> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const payload = line.slice(6).trim();
        if (payload === "[DONE]") continue;
        try {
          const evt = JSON.parse(payload);
          if (
            evt.type === "content_block_delta" &&
            evt.delta?.type === "text_delta"
          ) {
            controller.enqueue(new TextEncoder().encode(evt.delta.text));
          }
        } catch {
          // skip malformed SSE lines
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

function makeAnthropicRequest(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string
): Promise<Response> {
  return fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6",
      max_tokens: 4000,
      stream: true,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });
}

export async function POST(req: NextRequest) {
  const {
    url,
    apiKey,
    productName,
    valueProposition,
    targetSectors,
    customerType,
    purchaseTrigger,
    painPoint,
    competitors,
    disqualifiers,
    companyStage,
    acv,
    goal90days,
  } = await req.json();

  // Re-scrape product URL for richer context
  let scrapedContent = "";
  if (url) {
    try {
      const pageRes = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; GTAIMBot/1.0)" },
        signal: AbortSignal.timeout(8000),
      });
      const html = await pageRes.text();
      scrapedContent = extractText(html);
    } catch {
      // Not blocking — Claude will rely on intake data + general knowledge
    }
  }

  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const systemPrompt = `You are a senior Go-To-Market strategist. Your task is to generate one chapter of a structured GTM Playbook in Markdown format based on the product information provided.

CRITICAL RULES:

**On factual accuracy:**
- Only assert what you can reasonably infer from the scraped content or general market knowledge. If uncertain, flag it explicitly with ⚠️.
- NEVER invent features, pricing, or capabilities. If a feature appears to come from a third-party integration or partner (not native to the product), say so explicitly: e.g., "via [Partner] integration".
- For competitor analysis: use ONLY the competitors listed by the user. You may suggest 1-2 additional competitors, but ALWAYS mark them with "⚠️ Claude suggestion — to validate" and NEVER remove or substitute a competitor provided by the user.
- If data is insufficient to estimate ACV for a competitor, write: "Insufficient public data to estimate."

**On TAM/SAM/SOM:**
- No SIRENE API data is available for this generation. Always prefix the section with: ⚠️ "Estimated without SIRENE data — figures are approximate."
- Always show the calculation logic, not just the number.

**On GTM Motion:**
- NEVER ask the user what motion they prefer. Infer it from the product data.
- If multiple ICPs have clearly different buying profiles, generate a motion matrix per segment.
- When recommending multiple motions, always add an organizational implication note.

**On company stage:**
- Use the provided company stage ONLY as a signal for resource availability and SOM calculation. Do NOT label it explicitly in the output.

**Output format:**
- Strict Markdown. Use headers (##, ###), tables, and bullet points.
- Do NOT wrap your response in code blocks or backticks.
- Generate ONLY the chapter requested. Do not add preamble, conclusions, or other chapters.`;

  const productInfo = `## PRODUCT INFORMATION

**Product name:** ${productName}
**Value proposition:** ${valueProposition}
**Target sectors:** ${targetSectors}
**Customer type:** ${customerType}
**Purchase trigger:** ${purchaseTrigger}
**Primary pain point:** ${painPoint}
**Competitors:** ${competitors}
**Disqualifiers (who is NOT a good fit):** ${disqualifiers}
**Company stage:** ${companyStage}
**ACV range:** ${acv}
**90-day goal:** ${goal90days}

${
  scrapedContent
    ? `**Scraped content from product URL:**\n${scrapedContent}`
    : "**Note:** Product URL could not be scraped. Base the analysis on the product information above and your general knowledge."
}`;

  const userPrompt1 = `Generate Chapter 1 of a GTM Playbook for the following product.

${productInfo}

---

## OUTPUT

Start with the playbook title header, then generate Chapter 1 only. Do NOT generate any other chapter.

# GTM Playbook — ${productName}
*Generated by GTAIM · ${today} · Based on public data and AI inference*

---

## Chapter 1 — Market & ICP

### 1.1 — Ideal Customer Profiles
Generate 2-3 ICPs maximum. For each ICP include:
- **Firmographics**: sector, size, geography, digital maturity
- **Decision-maker persona**: title, responsibilities, definition of success
- **Jobs To Be Done** (3 levels):
  - Functional job → what they need to accomplish concretely
  - Emotional job → what they want to feel (infer carefully, flag if uncertain)
  - Social job → how they want to be perceived by peers
- **Pain points**: current frictions
- **Purchase triggers**: events that create urgency
- **Disqualifiers**: explicit exclusion criteria

### 1.2 — Market Segmentation
2-3 prioritized segments with justification.

### 1.3 — TAM / SAM / SOM
Prefix with ⚠️ (no SIRENE data). Show calculation logic. Apply penetration rate: Pre-seed 0.1% / Seed 0.3% / Series A 1% / Scale 3%. Add coherence check against the 90-day goal.`;

  const userPrompt2 = `Generate Chapter 2 of a GTM Playbook. This will be inserted directly after Chapter 1 — do NOT include a title header or any other chapter.

${productInfo}

---

## OUTPUT

Start directly with the Chapter 2 header. Do NOT generate any other chapter.

## Chapter 2 — Positioning & Messaging

### 2.1 — Positioning Statement
Template: "For [ICP] who [pain], [Product] is a [category] that [outcome]. Unlike [alternative], we [differentiation wedge]."

### 2.2 — Value Proposition by Persona (2-3 max)
For each persona, 4-layer Value Nugget Framework as a Markdown table:
| Layer | Content |
|---|---|
| Feature | ... |
| Benefit | ... |
| Proof | ... |
| Value | ... |
If Pre-seed or Seed: use placeholders for proof — never invent numbers.

### 2.3 — Differentiation Wedge per Competitor
Format: "Unlike [X], we [Y], which means [Z]."

### 2.4 — Key Messages by Audience
- End user (champion) → functional daily benefit
- Economic buyer → ROI and risk
- Peer / prescriber → social proof and credibility

### 2.5 — Elevator Pitch
30 seconds, ready to use.

### 2.6 — 💡 Tips: How to Test Your Messages
3 methods by reliability: customer interviews, 5-second tests, A/B testing. Keep it concise.`;

  const userPrompt3 = `Generate Chapter 3 of a GTM Playbook. This will be inserted directly after Chapter 2 — do NOT include a title header or any other chapter.

${productInfo}

---

## OUTPUT

Start directly with the Chapter 3 header. Do NOT generate any other chapter.

## Chapter 3 — Competitive Analysis

### 3.1 — Competitive Landscape Map
3 categories: Direct competitors / Substitutes / Indirect competitors.

### 3.2 — Battlecards (2-3 direct competitors max)
For each competitor, Markdown table:
| Field | Content |
|---|---|
| Positioning | ... |
| Estimated ACV | From public pricing. If unavailable: "Insufficient public data to estimate." |
| Perceived strengths | ... |
| Exploitable weaknesses | ... |
| Differentiation Wedge | Unlike [X], we [Y], which means [Z]. |
| Typical objection + response | ... |
Add after each card: *⚠️ Based on public data and Claude's training (cutoff Aug 2025). Validate with your own win/loss data.*

### 3.3 — Positioning Matrix
Markdown table: Solution / Pricing model / Primary target / Primary motion / France presence. 5-6 rows max.

### 3.4 — Defensible Advantage
2-3 sentences: what makes the position durable and hard to copy short-term.`;

  const userPrompt4 = `Generate Chapter 4 of a GTM Playbook. This is the final chapter — do NOT include a title header or any other chapter.

${productInfo}

---

## OUTPUT

Start directly with the Chapter 4 header.

## Chapter 4 — GTM Recommendations

### 4.1 — Recommended Sales Motion(s)
If multiple ICP segments, motion matrix per segment:
| Segment | Company size | Est. ACV | Motion | Rationale |
|---|---|---|---|---|
When multiple motions recommended: add organizational implication note.

### 4.2 — Priority Channels by Motion
For each motion, table of 3-4 channels:
| Channel | Why for this target |
|---|---|

### 4.3 — Priority Bets (3-5)
For each bet:
**Bet:** Concrete action
**Hypothesis:** What we're trying to validate
**Success signal:** Simple, observable metric
Order by estimated ROI. Only propose bets coherent with the recommended motion.

### 4.4 — Disclaimer
*This playbook was generated by AI based on the information you provided and public data (Claude knowledge cutoff: Aug 2025). It is a strategic starting point — not a validated GTM plan. Key assumptions should be challenged with your own market knowledge, customer interviews, and early sales data. ACV estimates marked ⚠️ are based on limited public data.*`;

  // Make Call 1 first — check for auth/API errors before committing to a stream
  let anthropicRes1: Response;
  try {
    anthropicRes1 = await makeAnthropicRequest(apiKey, systemPrompt, userPrompt1);
  } catch (err) {
    console.log("Anthropic Call 1 fetch failed:", String(err));
    return NextResponse.json(
      { error: "Generation failed. Please try again." },
      { status: 200 }
    );
  }

  if (anthropicRes1.status === 401) {
    return NextResponse.json({ error: "auth_error" }, { status: 200 });
  }

  if (!anthropicRes1.ok) {
    const errorText = await anthropicRes1.clone().text();
    console.log("Anthropic Call 1 error:", errorText);
    return NextResponse.json(
      { error: "Generation failed. Please try again." },
      { status: 200 }
    );
  }

  // Commit to streaming — pipe all 4 chapters sequentially
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const enc = new TextEncoder();
      try {
        // Chapter 1
        await pipeAnthropicStream(anthropicRes1.body!, controller);

        // Chapters 2, 3, 4 — failures are non-blocking
        const remainingPrompts = [userPrompt2, userPrompt3, userPrompt4];
        for (let i = 0; i < remainingPrompts.length; i++) {
          try {
            const res = await makeAnthropicRequest(
              apiKey,
              systemPrompt,
              remainingPrompts[i]
            );
            if (res.ok && res.body) {
              controller.enqueue(enc.encode("\n\n"));
              await pipeAnthropicStream(res.body, controller);
            } else {
              console.log(`Anthropic Call ${i + 2} failed:`, res.status);
            }
          } catch (err) {
            console.log(`Anthropic Call ${i + 2} fetch failed:`, String(err));
          }
        }
        // Tracking via Supabase REST API — works in Edge runtime without the JS client
        try {
          const trackRes = await fetch(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/playbook_generations`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "apikey": process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                "Authorization": `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
                "Prefer": "return=minimal",
              },
              body: JSON.stringify({
                url,
                product_name: productName,
                company_stage: companyStage,
                acv,
                success: true,
              }),
            }
          );
          if (!trackRes.ok) {
            const errText = await trackRes.text();
            console.log("Supabase tracking error:", trackRes.status, errText);
          } else {
            console.log("Supabase tracking success:", trackRes.status);
          }
        } catch (err) {
          console.log("Supabase tracking fetch failed:", String(err));
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

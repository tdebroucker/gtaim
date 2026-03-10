import { NextRequest, NextResponse } from "next/server";

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

  text = text.replace(/\s+/g, " ").trim();

  return text.slice(0, 15000);
}

function stripMarkdownJson(text: string): string {
  // Remove ```json ... ``` or ``` ... ``` wrappers if present
  return text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
}

export async function POST(req: NextRequest) {
  const { url, apiKey }: { url: string; apiKey: string } = await req.json();

  // 1. Fetch and extract page content
  let pageText = "";
  let urlFailed = false;
  try {
    const pageRes = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; GTAIMBot/1.0)" },
      signal: AbortSignal.timeout(10_000),
    });
    const html = await pageRes.text();
    pageText = extractText(html);
    console.log("URL fetch success, content length:", pageText.length);
  } catch (err) {
    console.log("URL fetch failed, continuing with domain inference:", String(err));
    urlFailed = true;
  }

  const FEW_SHOT_EXAMPLE = `
Example of expected output:
{
  "productName": "Pipedrive",
  "valueProposition": "Helps sales teams close more deals by keeping their pipeline visible and their follow-ups on track.",
  "targetSectors": "SMB and Mid-Market SaaS, Professional Services, Agencies",
  "customerType": "PME",
  "primaryPainPoint": "Sales reps lose track of deals and forget follow-ups without a structured pipeline view.",
  "purchaseTrigger": "A startup that just hired its 3rd sales rep and realizes Excel can no longer track their pipeline.",
  "competitors": ["Salesforce", "HubSpot CRM", "Sellsy"],
  "companyStage": "Scale-up",
  "estimatedACV": "1K-10K"
}`;

  // Build prompt — infer from domain if page content unavailable
  const userPrompt = pageText
    ? `Extract structured GTM information from the website content below and return it as a single valid JSON object. No markdown, no explanation, no preamble — JSON only.

Required fields:
- productName: the product or company name
- valueProposition: one benefit-focused sentence, no marketing fluff, written from the customer's perspective
- targetSectors: sector(s) and typical company size (e.g. "HR Tech, SMB to Mid-Market")
- customerType: one of "B2C", "PME", "Mid-Market", or "Enterprise"
- primaryPainPoint: the #1 pain point this product solves, one concrete and specific sentence
- purchaseTrigger: the situation or event that triggers someone to buy this product (1-2 sentences, from the customer's perspective)
- competitors: array of 2-3 competitors ACTIVELY present on the French market today. Look for "vs [product]", "[product] alternative", comparison pages, or integration pages in the content. If not found in content, use your general knowledge about the French market for this product category. Exclude companies that have withdrawn from France (e.g. QuickBooks left France in 2020). Prioritize French or European competitors over US-only players. Return as JSON array of strings.
- companyStage: one of "Pre-seed", "Seed", "Series A", "Scale-up", "Enterprise". Infer using ALL available signals — page content (employee count, customer count, funding mentions, press logos, "trusted by X" claims) AND your general knowledge (if the company is publicly known, a unicorn, listed, or widely covered, use that knowledge). Mapping: Pre-seed/Seed: <10 employees, just launched, no visible traction; Series A/B: 10-200 employees, visible funding, growing customer base; Scale-up: 200+ employees, strong brand, significant ARR or valuation (unicorn status counts), >1000 customers; Enterprise: publicly listed, multinational, >1000 employees.
- estimatedACV: infer from pricing page if found. Map to one of: "<1K", "1K-10K", "10K-50K", ">50K", "unknown". Use "unknown" if no pricing is visible.
${FEW_SHOT_EXAMPLE}

Website content:
${pageText}`
    : `The website at "${url}" could not be fetched. Based only on the domain name and URL path, infer the most plausible values and return a single valid JSON object. No markdown, no explanation — JSON only.

Required fields:
- productName: inferred from the domain
- valueProposition: one plausible benefit-focused sentence
- targetSectors: plausible sector(s) and company size
- customerType: one of "B2C", "PME", "Mid-Market", or "Enterprise"
- primaryPainPoint: the most plausible pain point based on the domain
- purchaseTrigger: the most plausible situation or event that triggers someone to buy this product (1-2 sentences)
- competitors: array of 2-3 most likely competitors inferred from general knowledge about the domain/industry
- companyStage: best guess from domain name and URL structure, one of "Pre-seed", "Seed", "Series A", "Scale-up", "Enterprise"
- estimatedACV: best guess, one of "<1K", "1K-10K", "10K-50K", ">50K", "unknown"
${FEW_SHOT_EXAMPLE}`;

  // 2. Call Anthropic API
  let anthropicRes: Response;
  try {
    anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6",
        max_tokens: 1500,
        system:
          "You are a GTM analyst expert. Your job is to extract structured product information from website content to pre-fill a GTM intake form. Always respond in valid JSON only, no markdown, no preamble.",
        messages: [{ role: "user", content: userPrompt }],
      }),
    });
  } catch (err) {
    console.log("Anthropic fetch failed:", String(err));
    return NextResponse.json(
      { error: "Analysis failed. Please fill in the fields manually." },
      { status: 200 }
    );
  }

  // 3. Parse and return
  if (anthropicRes.status === 401) {
    console.log("Anthropic returned 401 — invalid API key");
    return NextResponse.json({ error: "auth_error" }, { status: 200 });
  }
  if (!anthropicRes.ok) {
    const errorText = await anthropicRes.clone().text();
    console.log("Anthropic error body:", errorText);
    console.log("Model used:", process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6 (fallback)");
    console.log("Anthropic returned non-ok status:", anthropicRes.status);
    return NextResponse.json(
      { error: "Analysis failed. Please fill in the fields manually." },
      { status: 200 }
    );
  }

  try {
    const anthropicData = await anthropicRes.json();
    console.log("Anthropic raw response:", JSON.stringify(anthropicData));

    const raw: string = anthropicData.content?.[0]?.text ?? "";
    console.log("Raw text from Claude:", raw);

    const cleaned = stripMarkdownJson(raw);
    console.log("Cleaned text before parse:", cleaned);

    const parsed = JSON.parse(cleaned);
    console.log("Parsed result:", JSON.stringify(parsed));

    return NextResponse.json({ ...parsed, urlFailed }, { status: 200 });
  } catch (err) {
    console.log("JSON parse failed:", String(err));
    return NextResponse.json(
      { error: "Analysis failed. Please fill in the fields manually." },
      { status: 200 }
    );
  }
}

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
Example of a perfect output for Pipedrive (pipedrive.com):
{
  "productName": "Pipedrive",
  "valueProposition": "Sales teams close more deals by visualizing their entire pipeline and never missing a follow-up.",
  "targetSectors": "SMB and Mid-Market SaaS, Professional Services, Agencies",
  "customerType": "PME",
  "primaryPainPoint": "Sales reps lose track of deals and follow-ups when managing prospects in spreadsheets.",
  "purchaseTrigger": "A startup just hired its 3rd sales rep and the founder realizes spreadsheets can no longer track who said what, who to follow up with, and which deals are actually moving forward.",
  "competitors": ["Salesforce", "HubSpot", "Zoho CRM"],
  "estimatedACV": "1K-10K"
}`;

  // Build prompt — infer from domain if page content unavailable
  const userPrompt = pageText
    ? `Extract structured GTM information from the website content below and return it as a single valid JSON object. No markdown, no explanation, no preamble — JSON only.

Required fields:
- productName: the product or company name
- valueProposition: analyze ALL sections and segments of the website (not just the hero/first section). If the product serves multiple customer types, synthesize the ONE core promise that unifies all segments. Write from the customer's perspective, benefit-focused, no marketing fluff, 1 sentence. e.g. "Teams do X without needing Y"
- targetSectors: sector(s) and typical company size (e.g. "HR Tech, SMB to Mid-Market")
- customerType: one of "B2C", "PME", "Mid-Market", or "Enterprise"
- primaryPainPoint: the #1 pain point this product solves, one concrete and specific sentence
- purchaseTrigger: the specific moment or situation that makes someone decide to buy NOW. Look across the full site: testimonials, use cases, "who is it for" pages, onboarding flows, before/after scenarios. Focus on workflow or context triggers — not pricing or cost comparisons. e.g. a growth event, a broken process, a new obligation. 1-2 sentences, buyer's perspective, concrete.
- competitors: array of 2-3 competitors actively present on the French market in 2025-2026. Rules: same job-to-be-done as the analyzed product; same primary customer as the identified customerType; prefer modern SaaS tools unless (a) no modern SaaS alternative exists for this use case, or (b) the analyzed product is itself a legacy tool. Do not name specific products in this instruction — infer competitors from the product's category, positioning, and customerType.
- estimatedACV: infer from pricing page if found. Map to one of: "<1K", "1K-10K", "10K-50K", ">50K", "unknown". Use "unknown" if no pricing is visible.
- disqualifiers: array of 2-3 criteria that make a prospect a bad fit for this product. Infer from: pricing page (minimum plan size), customer logos (implied company size), integrations required, positioning language. Focus on: company size too small, wrong industry, missing tech stack, no dedicated budget. e.g. ["Less than 10 employees", "No existing CRM", "Public sector only"]. Return empty array [] if you cannot infer with confidence.
${FEW_SHOT_EXAMPLE}

Website content:
${pageText}`
    : `The website at "${url}" could not be fetched. Based on the domain name, URL path, and your general knowledge about this company or product category, infer the most plausible values and return a single valid JSON object. No markdown, no explanation — JSON only.

IMPORTANT: The URL was not accessible. Do NOT invent or guess any product information. Only populate fields if you have verified general knowledge about this exact brand. If the domain is unknown or fictional, return empty strings for ALL fields.

Required fields:
- productName: inferred from the domain
- valueProposition: infer the ONE core promise that unifies the product's offer. Write from the customer's perspective, benefit-focused, no marketing fluff, 1 sentence. e.g. "Teams do X without needing Y"
- targetSectors: plausible sector(s) and company size
- customerType: one of "B2C", "PME", "Mid-Market", or "Enterprise"
- primaryPainPoint: the most plausible pain point based on the domain
- purchaseTrigger: the specific moment or situation that makes someone decide to buy NOW. Focus on workflow or context triggers — not pricing or cost comparisons. e.g. a growth event, a broken process, a new obligation. 1-2 sentences, buyer's perspective, concrete.
- competitors: array of 2-3 competitors actively present on the French market in 2025-2026. Rules: same job-to-be-done as the analyzed product; same primary customer as the identified customerType; prefer modern SaaS tools unless (a) no modern SaaS alternative exists for this use case, or (b) the analyzed product is itself a legacy tool. Do not name specific products in this instruction — infer competitors from the product's category, positioning, and customerType.
- estimatedACV: best guess, one of "<1K", "1K-10K", "10K-50K", ">50K", "unknown"
- disqualifiers: array of 2-3 criteria that make a prospect a bad fit for this product. Infer from your general knowledge of this product: minimum company size, wrong industry, missing tech stack, no dedicated budget. e.g. ["Less than 10 employees", "No existing CRM", "Public sector only"]. Return empty array [] if you cannot infer with confidence.
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

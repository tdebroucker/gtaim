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
  "valueProposition": "Helps sales teams close more deals by giving them a visual pipeline that shows exactly where each deal stands.",
  "targetSectors": "SMB and Mid-Market SaaS, Professional Services, Agencies",
  "customerType": "PME",
  "primaryPainPoint": "Sales reps lose track of follow-ups and deals slip through the cracks without a structured pipeline view."
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
        max_tokens: 1000,
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

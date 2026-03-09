import { NextRequest, NextResponse } from "next/server";

function extractText(html: string): string {
  // Remove script and style blocks entirely
  let text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ");

  // Strip all remaining tags
  text = text.replace(/<[^>]+>/g, " ");

  // Decode common HTML entities
  text = text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");

  // Collapse whitespace and trim
  text = text.replace(/\s+/g, " ").trim();

  return text.slice(0, 3000);
}

export async function POST(req: NextRequest) {
  const { url, apiKey }: { url: string; apiKey: string } = await req.json();

  // 1. Fetch and extract page content
  let pageText: string;
  try {
    const pageRes = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; GTAIMBot/1.0)" },
      signal: AbortSignal.timeout(10_000),
    });
    const html = await pageRes.text();
    pageText = extractText(html);
  } catch {
    return NextResponse.json({ error: "url_unreachable" }, { status: 200 });
  }

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
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system:
          "You are a GTM analyst. Analyze website content and extract key product information. The default market is France.",
        messages: [
          {
            role: "user",
            content: `From this website content, return ONLY a valid JSON object with no markdown formatting and no explanation:
{
  "productName": "the product name",
  "valueProposition": "one benefit-focused sentence, no marketing fluff",
  "targetSectors": "sector(s) and typical company size",
  "customerType": "PME or Mid-Market or Enterprise"
}
Website content: ${pageText}`,
          },
        ],
      }),
    });
  } catch {
    return NextResponse.json(
      { error: "Analysis failed. Please fill in the fields manually." },
      { status: 200 }
    );
  }

  // 3. Parse and return
  if (anthropicRes.status === 401) {
    return NextResponse.json({ error: "auth_error" }, { status: 200 });
  }
  if (!anthropicRes.ok) {
    return NextResponse.json(
      { error: "Analysis failed. Please fill in the fields manually." },
      { status: 200 }
    );
  }

  try {
    const anthropicData = await anthropicRes.json();
    const raw: string = anthropicData.content?.[0]?.text ?? "";
    const parsed = JSON.parse(raw);
    return NextResponse.json(parsed, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Analysis failed. Please fill in the fields manually." },
      { status: 200 }
    );
  }
}

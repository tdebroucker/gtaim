# GTAIM — AI-powered GTM, right on target

> Generate a complete Go-To-Market Playbook from a product URL — powered by Claude AI.

![Status](https://img.shields.io/badge/status-in%20development-orange)
![Stack](https://img.shields.io/badge/stack-Next.js%20%7C%20Supabase%20%7C%20Vercel-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 🎯 What is GTAIM?

GTAIM is a web tool that automatically generates a structured GTM Playbook from a product URL and a short intake form — in minutes, not days.

**Target users:**
- Product Marketers (PMM)
- Early-stage Founders & Startups

**Job-to-be-done:** Structure your GTM strategy from scratch, fast — with reliable data and an actionable output.

---

## 🗺️ Roadmap

### ✅ MVP — Foundations (v0.1 → v0.3)
- [x] Landing page (EN) — vitrine with Coming Soon
- [x] 5-step intake form (11 fields)
- [x] Product URL web scraping (best-effort, fallback to manual)
- [x] Claude API — Step 1: auto-fill form from URL analysis
- [x] Claude API — Step 2: generate full GTM Playbook (4 chapters, streaming)
- [x] Structured web output (Markdown → HTML via react-markdown)
- [x] Guest mode (no account required)
- [x] BYOK — Bring Your Own Anthropic API Key (never stored server-side)
- [x] Edge runtime + streaming (4 sequential API calls, no timeout)
- [x] Playbook generation tracking (Supabase)
- [x] Unknown URL handling (empty strings + warning banner)

### 🔧 v0.4 — Prompt Enrichment (next)
- [ ] Enrich playbook prompts with GTM Strategist frameworks (beachhead scoring, April Dunford positioning, 4-category competitive map, motion scoring)
- [ ] Anti-verbosity directive in system prompt
- [ ] `max_tokens` increase (4 000 → 6 000)
- [ ] Condense ICP format (compact tables vs. verbose text)
- [ ] Tighten elevator pitch constraint (max 3 sentences)

### 🔧 v0.5 — Intake Enrichment
- [ ] Add "Key differentiator" field (Step 4 — after competitors)
- [ ] Add "Pricing model" select (Step 5 — above ACV)
- [ ] Add "GTM team size" select (Step 5 — after company stage)
- [ ] Add "Current traction" text field (Step 5 — after 90-day goal)
- [ ] Update playbook prompts to use new intake fields
- [ ] Update analyze-url prompt to pre-fill new fields from scraping

### 🔜 v1.0 — Polish & Ship
- [ ] Playbook result page design polish
- [ ] Copy-to-clipboard + share link
- [ ] Mobile responsiveness audit
- [ ] Error states & edge case handling review
- [ ] TAM/SAM/SOM via API SIRENE (INSEE) — France-first differentiator

### 🔜 v1.1 — Users & Deliverables
- [ ] User account creation
- [ ] Encrypted API key storage
- [ ] Playbook history
- [ ] PDF export

### 🔜 v1.2 — Playbook Expansion
- [ ] Pricing Positioning chapter (Ch.2.5 — product vs competitors on price/value grid)
- [ ] 90-Day Launch Plan chapter (actionable milestones aligned to user's goal)
- [ ] "Deep Dive" mode (interactive, question-by-question playbook generation)

### 🔜 v1.3 — Contextual Enrichment
- [ ] Integrations Hub (CRM, Sales call transcripts, user feedback)
- [ ] Dynamic ICP (updated via integrations)

### 🔜 v2 — Scale
- [ ] ICP Scoring
- [ ] Team collaboration
- [ ] Freemium model
- [ ] Multi-LLM support (OpenAI, Gemini, Mistral)

---

## 🧩 GTM Playbook Output (4 chapters)

1. **Market & ICP** — ICPs with JTBD, beachhead scoring, market segmentation, TAM/SAM/SOM
2. **Positioning & Messaging** — April Dunford framework, value props by persona, differentiation wedges, elevator pitch
3. **Competitive Analysis** — 4-category landscape (direct, indirect, status quo, do nothing), battlecards, positioning matrix
4. **GTM Recommendations** — Motion scoring & verdict, priority channels, priority bets with success signals

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend + Backend | [Next.js](https://nextjs.org) | Full-stack, large community, Claude Code friendly |
| Database | [Supabase](https://supabase.com) | Managed PostgreSQL, generous free tier |
| Hosting | [Vercel](https://vercel.com) | Auto-deploy from GitHub, free tier permanent |
| AI | [Anthropic Claude API](https://anthropic.com) | BYOK at MVP — zero infra AI cost |
| Domain | `gtaim.io` | Registered on Namecheap — March 2026 |

---

## 🌍 Environments

| Environment | Branch | URL |
|---|---|---|
| Production | `main` | [gtaim.io](https://gtaim.io) |
| Preview | `develop` | `gtaim-git-develop-tdebrouckers-projects.vercel.app` |

---

## 🔄 Workflow

```
develop (local) → git push → Vercel Preview URL (test)
                                      ↓ validated
                    merge develop → main → gtaim.io (production)
```

1. Always work on `develop` branch
2. Test on the Preview URL
3. Merge into `main` only when validated

```bash
# Switch to develop before coding
git checkout develop

# Push changes
git add .
git commit -m "feat: description"
git push

# When ready for production
git checkout main
git merge develop
git push
```

---

## 🚀 Local Setup

```bash
# 1. Clone the repo
git clone https://github.com/tdebroucker/gtaim.git
cd gtaim

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Fill in your Supabase and Anthropic keys

# 4. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔑 Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

> ⚠️ Never commit `.env.local` — it is git-ignored by default.

---

## 📦 Project Structure

```
gtaim/
├── src/app/
│   ├── page.tsx                    # Landing page
│   ├── intake/page.tsx             # 5-step intake form
│   ├── playbook/page.tsx           # Playbook result page
│   └── api/
│       ├── analyze-url/route.ts    # Claude API — URL analysis & form pre-fill
│       └── generate-playbook/route.ts  # Claude API — 4-chapter playbook generation (streaming)
├── public/                         # Static assets (logo, favicon)
│   ├── gtaim-logo-v6.svg
│   └── gtaim-favicon.svg
├── CLAUDE.md                       # Instructions for Claude Code
├── DESIGN_SYSTEM.md                # Brand & design reference
└── README.md
```

---

## 🎨 Branding

| Element | Value |
|---|---|
| Name | GTAIM |
| Baseline | *"AI-powered GTM, right on target"* |
| Domain | `gtaim.io` |
| Logo | Concentric target — orange palette with relief |
| Design reference | See `DESIGN_SYSTEM.md` |

---

## ⚠️ Technical Decisions

| Decision | Rationale |
|---|---|
| BYOK at MVP | No API key stored server-side — zero AI infra cost |
| Double Claude API call | Call 1: infer form answers from URL / Call 2: generate playbook |
| 4 sequential streaming calls | One per chapter, Edge runtime keeps connection alive — no timeout |
| `max_tokens: 6000` per call | Allows rich structured output (tables, scoring) without truncation |
| Scraping best-effort | Manual fallback if site is JS-heavy or inaccessible |
| France-first | SIRENE API as differentiator — TAM/SAM/SOM from public INSEE data |
| PDF deferred to V1.1 | Web output sufficient to validate usage before investing in rendering |
| Next.js over Flask | Better free tier (Vercel), larger community, stronger for personal branding |
| develop branch | Feature work isolated from production — merge to main only when validated |
| Prompt frameworks | Beachhead scoring, April Dunford, 4-cat competitive map — inspired by GTM Strategist methodology |

---

## 📅 Changelog

| Date | Version | Notes |
|---|---|---|
| March 2026 | 0.3 | Intake form + playbook generation live (5 steps, 4-chapter streaming, Edge runtime). Prompt enrichment with GTM Strategist frameworks (beachhead, April Dunford, 4-cat competitive map, motion scoring). Anti-verbosity directive. |
| March 2026 | 0.2 | Landing page live — GitHub + Vercel + custom domain setup, develop branch |
| March 2026 | 0.1 | Project init — branding, domain, design system, stack decisions |

---

## 📄 License

MIT — free to use, fork, and learn from.

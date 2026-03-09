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

### ✅ MVP — Foundations
- [x] Landing page (EN) — vitrine with Coming Soon
- [ ] 2-step intake form (8 questions)
- [ ] Product URL web scraping
- [ ] Claude API — Step 1: auto-fill form from URL analysis
- [ ] Claude API — Step 2: generate full GTM Playbook
- [ ] TAM/SAM/SOM via API SIRENE (INSEE)
- [ ] Structured web output (4 sections)
- [ ] Guest mode (no account required)
- [ ] BYOK — Bring Your Own Anthropic API Key

### 🔜 V1.1 — Users & Deliverables
- [ ] User account creation
- [ ] Encrypted API key storage
- [ ] Playbook history
- [ ] PDF export

### 🔜 V1.2 — Contextual Enrichment
- [ ] Integrations Hub (CRM, Sales call transcripts, user feedback)
- [ ] Dynamic ICP (updated via integrations)

### 🔜 V2 — Scale
- [ ] ICP Scoring
- [ ] Team collaboration
- [ ] Freemium model
- [ ] Multi-LLM support (OpenAI, Gemini, Mistral)

---

## 🧩 GTM Playbook Output (4 sections)

1. **Market & ICP** — Target segments, TAM/SAM/SOM (SIRENE data — France-first)
2. **Positioning & Messaging** — Value prop, key messages per persona
3. **Competitive Analysis** — Battlecards, differentiators
4. **GTM Recommendations** — PLG / SLG / ABM initiatives based on stage

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
| Preview | `develop` | `gtaim-akh43vrdp-tdebrouckers-projects.vercel.app` |

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
│   ├── page.tsx          # Landing page
│   ├── intake/           # Intake form (2 steps)
│   └── playbook/         # Playbook output
├── components/           # Reusable UI components
├── lib/                  # Claude API, Supabase, scraping utils
├── public/               # Static assets (logo, favicon)
│   ├── gtaim-logo.svg
│   └── gtaim-favicon.svg
├── DESIGN_SYSTEM.md      # Brand & design reference
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
| Scraping best-effort | Manual fallback if site is JS-heavy or inaccessible |
| France-first | SIRENE API as differentiator — TAM/SAM/SOM from public INSEE data |
| PDF deferred to V1.1 | Web output sufficient to validate usage before investing in rendering |
| Next.js over Flask | Better free tier (Vercel), larger community, stronger for personal branding |
| develop branch | Feature work isolated from production — merge to main only when validated |

---

## 📝 Learnings & LinkedIn

This project is documented live on LinkedIn as a learning journey around **Claude Code** and **AI-assisted product building**.

Key posts planned:
- "I launched a side project — here's why"
- "How I position a GTM tool in 2026"
- "The 8 questions every good GTM must answer"
- "Reducing form friction by 80% with Claude"
- "How I instruct Claude to generate a GTM Playbook"
- "Calculating TAM with French public data (SIRENE API)"
- "My no-budget stack to ship a side project in 2026"

---

## 📅 Changelog

| Date | Version | Notes |
|---|---|---|
| March 2026 | 0.2 | Landing page live — GitHub + Vercel + custom domain setup, develop branch |
| March 2026 | 0.1 | Project init — branding, domain, design system, stack decisions |

---

## 📄 License

MIT — free to use, fork, and learn from.

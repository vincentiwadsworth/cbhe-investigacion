# Skill Registry

**Delegator use only.** Any agent that launches sub-agents reads this registry to resolve compact rules, then injects them directly into sub-agent prompts. Sub-agents do NOT read this registry or individual SKILL.md files.

See `_shared/skill-resolver.md` for the full resolution protocol.

## User Skills

| Trigger | Skill | Path |
|---------|-------|------|
| Creating a pull request, opening a PR | branch-pr | ~/.config/opencode/skills/branch-pr/SKILL.md |
| chatbot Julia, debug, n8n_chat_histories | chat-debug | ~/.config/opencode/skills/chat-debug/SKILL.md |
| limpieza, data cleaning, anuncios_v2 | citrino-data-cleaning | ~/.config/opencode/skills/citrino-data-cleaning/SKILL.md |
| vps, hostinger, docker, n8n server | citrino-vps | ~/.config/opencode/skills/citrino-vps/SKILL.md |
| resumir documento, documento de referencia | doc-summarizer | ~/.config/opencode/skills/doc-summarizer/SKILL.md |
| ER, diagrama entidad-relación, schema | er-diagram | ~/.config/opencode/skills/er-diagram/SKILL.md |
| go tests, Bubbletea TUI testing | go-testing | ~/.config/opencode/skills/go-testing/SKILL.md |
| creating a GitHub issue, reporting a bug | issue-creation | ~/.config/opencode/skills/issue-creation/SKILL.md |
| judgment day, doble review, juzgar | judgment-day | ~/.config/opencode/skills/judgment-day/SKILL.md |
| delegate() model error, fallback | model-fallback-handler | ~/.config/opencode/skills/model-fallback-handler/SKILL.md |
| n8n, flujos, workflows, chatbot Julia | n8n-flow | ~/.config/opencode/skills/n8n-flow/SKILL.md |
| PlantUML, diagrama de actividad, swimlanes | plantuml-diagram | ~/.config/opencode/skills/plantuml-diagram/SKILL.md |
| slides, presentation, pitch deck, action titles | presentation-skills | ~/.config/opencode/skills/presentation-skills/SKILL.md |
| create a new skill, agent instructions | skill-creator | ~/.config/opencode/skills/skill-creator/SKILL.md |
| how do I do X, find a skill for X | find-skills | ~/.agents/skills/find-skills/SKILL.md |
| gh, GitHub CLI, issues, PRs, releases | gh-cli | ~/.agents/skills/gh-cli/SKILL.md |
| /commit, commit changes, create a git commit | git-commit | ~/.agents/skills/git-commit/SKILL.md |
| OCR, PDF, ocrmypdf, pdfminer | ocr-processor | ~/.agents/skills/ocr-processor/SKILL.md |
| Supabase, auth, database, edge functions | supabase | ~/.agents/skills/supabase/SKILL.md |
| Postgres performance, query optimization | supabase-postgres-best-practices | ~/.agents/skills/supabase-postgres-best-practices/SKILL.md |
| review my UI, check accessibility, audit design | web-design-guidelines | ~/.agents/skills/web-design-guidelines/SKILL.md |

## Project Skills

| Trigger | Skill | Path |
|---------|-------|------|
| Astro, .astro files, SSG, content collections | astro | .agents/skills/astro/SKILL.md |
| write copy, improve copy, marketing copy, CTA | copywriting | .agents/skills/copywriting/SKILL.md |
| extract design system, design primitives | extract-design-system | .agents/skills/extract-design-system/SKILL.md |
| publish to GitHub Pages, deploy presentation | publish-to-pages | .agents/skills/publish-to-pages/SKILL.md |
| UI/UX design, color palette, typography, components | ui-ux-pro-max | .agents/skills/ui-ux-pro-max/SKILL.md |

## Compact Rules

Pre-digested rules per skill. Delegators copy matching blocks into sub-agent prompts as `## Project Standards (auto-resolved)`.

### astro
- `.astro` files: frontmatter in `---` fences, HTML below, zero JS by default
- Content Collections: config at `src/content.config.ts` (Astro 6+), use `defineCollection` + `z` from `astro/zod` + `glob` loader from `astro/loaders`
- NEVER use `astro:content` for `z` — import from `astro/zod` in v6
- `getCollection("name")` in frontmatter, filter with `({ data }) => !data.draft`
- `base` config only prefixes assets, NOT `<a href>` — use `<base href={import.meta.env.BASE_URL}>` in Layout
- `import.meta.env.WEB3FORMS_KEY` for build-time env vars (no `PUBLIC_` prefix needed in frontmatter)
- `npx astro dev` → `localhost:4321`, `npx astro build` → `dist/`

### ui-ux-pro-max
- Priority 1 (CRITICAL): color contrast ≥4.5:1, focus-visible rings, alt text, aria-labels, keyboard nav
- Priority 2 (CRITICAL): touch targets ≥44×44px/48×48dp, 8px+ spacing between touch targets
- Priority 3 (HIGH): WebP/AVIF, lazy loading, explicit width/height on images (CLS), font-display: swap
- No emojis as icons — use SVG icon sets (Heroicons, Lucide, Material Symbols)
- `text-wrap: balance` on headings; `text-pretty` on body
- Reduced motion: `@media (prefers-reduced-motion: reduce)` must disable all animations
- `…` not `...`; curly quotes `"` `"` not straight `"`
- Forms: visible labels (never placeholder-only), errors near fields, required indicators

### web-design-guidelines
- Icon-only buttons need `aria-label`; decorative icons need `aria-hidden="true"`
- `<button>` for actions, `<a>` for navigation — never `<div onClick>`
- Images need `alt` (or `alt=""` if decorative) + explicit `width`/`height`
- `:focus-visible` over `:focus`; never `outline-none` without replacement
- Forms: inputs need `autocomplete` and `name`; correct `type` (`email`, `tel`, `url`)
- `touch-action: manipulation` (prevents 300ms tap delay)
- `scroll-margin-top` on anchor targets (offset for sticky nav)
- Animate only `transform`/`opacity`; never `transition: all`
- `font-variant-numeric: tabular-nums` for number columns
- Loading states end with `…`: `"Loading…"`, `"Saving…"`

### git-commit
- Conventional Commits: `type[scope]: description` (feat, fix, chore, docs, style, refactor, perf, test, build, ci)
- Present tense, imperative mood: "add" not "added", "fix" not "fixes"
- NEVER commit secrets (.env, credentials.json, private keys)
- NEVER amend pushed commits or force push to main
- If commit fails due to hooks: fix and create NEW commit, never amend
- One logical change per commit; keep description <72 chars

### gh-cli
- `gh auth status` → check login; `gh issue create/list/view/close`; `gh pr create/list/merge`
- `gh label create/label/clone`; `gh repo create/view/edit`
- `gh run list/view/rerun` → check workflow runs; `gh secret set` → set GitHub Actions secrets
- `gh api repos/{owner}/{repo}/...` → direct API calls (omit leading slash in Windows)
- `gh repo edit --visibility public --accept-visibility-change-consequences` → make repo public
- GitHub Pages enable: `gh api repos/{owner}/{repo}/pages --method POST -F "build_type=workflow"`

### copywriting
- Active voice, second person: "Install the CLI" not "The CLI will be installed"
- Specific CTA labels: "Save API Key" not "Continue"
- Title Case for headings/buttons (Chicago style); numerals for counts: "8 deployments"
- Error messages include fix/next step, not just problem
- `&` over "and" where space-constrained

### supabase
- Use `@supabase/ssr` for Next.js/Astro/SvelteKit; server-side auth with cookies
- Row Level Security (RLS) mandatory on all tables with public access
- `supabase-js`: `supabase.from("table").select().eq()` — chainable query builder
- Edge Functions in `supabase/functions/`; deploy with `supabase functions deploy`
- Migrations: `supabase db diff` → `supabase db push`; never edit tables in dashboard for tracked schemas
- Realtime: `supabase.channel("name").on("...", callback).subscribe()`

### supabase-postgres-best-practices
- Always add `explain analyze` before deploying queries; check for sequential scans on large tables
- Index foreign keys; use partial indexes for filtered queries; consider BRIN for append-only tables
- `text` over `varchar(n)`; `timestamptz` over `timestamp`; `bigint`/`uuid` for primary keys
- Connection pooling: use Supavisor (PGbouncer) in production; set `pooler.max_client_conn = 100`
- Never use `select *` in production queries; never run unfiltered `update`/`delete`

### n8n-flow
- Workflows saved as JSON in `.n8n/` or exported from n8n UI
- Use environment variables for API keys: `$env.SUPABASE_URL` in node configs
- Error handling: add Error Trigger nodes after critical HTTP/webhook nodes
- DeepSeek integration via HTTP Request node to OpenRouter API

### citrino-data-cleaning
- Target table: `anuncios_v2` with `fecha_snapshot` partitioning
- Remove duplicates by `id_anuncio` keeping latest `fecha_snapshot`
- Null handling: fill `precio` with 0 where missing, drop rows with null `ubicacion`
- Validate `moneda` enum (USD, BOB, UFV); convert all to USD for analysis

### citrino-vps
- SSH: `ssh root@<hostinger-ip>`; Docker management via `docker compose`
- n8n at port 5678; restart: `docker compose restart n8n`
- Check logs: `docker compose logs -f n8n --tail 50`
- Backup: `docker compose exec postgres pg_dump` → Supabase

### presentation-skills
- Action titles: every slide title is a complete sentence stating the insight (not "Q4 Results" → "Revenue grew 23% driven by APAC expansion")
- MECE: mutually exclusive, collectively exhaustive — no overlap, no gaps between slides
- SCS framework: Situation → Complication → Solution → per slide vertical
- One idea per slide; 30pt+ font minimum; data labels on charts, not in footnotes

### plantuml-diagram
- Swimlanes: `|Swimlane1|\n|Swimlane2|` syntax; `:Step;` for activities
- Use `@startuml` / `@enduml`; `skinparam` for styling
- Generate PNG: `plantuml -tpng diagram.puml`

### er-diagram
- Mermaid syntax: `erDiagram` block; `ENTITY { type field PK/FK "description" }`
- Relationships: `||--o{` (one-to-many), `}|--||` (one-to-one)
- Generate via Supabase: `supabase db diff --linked --schema public`

### go-testing
- Use `testing.T` for unit tests; `testify/assert` for assertions
- Bubbletea TUI testing: `teatest.NewTeaModel(t, model)` for integration; `model.Update(msg)` for unit
- Table-driven tests: `tests := []struct{name, input, expected}` loop
- `go test -race -cover ./...` for race detection + coverage

### judgment-day
- Launch 2 blind judge sub-agents simultaneously via `delegate`
- Synthesize both findings; apply fixes; re-judge up to 2 iterations
- Escalate if both don't pass after 2 iterations

### skill-creator
- Skills are markdown files with YAML frontmatter (`name`, `description`)
- `description` field doubles as trigger — use "When user says X" patterns
- `SKILL.md` in a named directory under the skills folder
- Use `skill` tool to register; `skills-lock.json` tracks installed skills

### find-skills
- Query: `how do I do X` → search available skills by trigger keywords
- Check `skills-lock.json` for installed skills; `find-skills` for discovery

### doc-summarizer
- Resume documentos a una sección `## resumen de documentos` en la nota raíz
- Contextualizar al tema de la nota, no resumir genéricamente

### extract-design-system
- Extract colors, typography, spacing, border-radius, shadows from existing site
- Generate CSS custom properties or Tailwind @theme tokens
- Output: starter token files for the project

### publish-to-pages
- Handles PPTX, PDF, HTML → GitHub Pages URL
- Creates repo, converts files, enables Pages, returns live URL

### branch-pr / issue-creation
- Agent Teams Lite workflow: issue-first → branch → PR
- Issue templates: title + body with reproduction steps/scope
- PR links to issue with `Closes #N`

## Project Conventions

No project convention files found (AGENTS.md, CLAUDE.md, .cursorrules, GEMINI.md, copilot-instructions.md).

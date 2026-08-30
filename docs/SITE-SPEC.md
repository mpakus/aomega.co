# aomega.co portfolio specification

Status: current implementation contract
Last verified: 2026-08-30

## Purpose

aomega.co presents Renat Ibragimov as a senior software engineer and product builder with 15+ years of production experience. The site must show three things clearly:

1. Renat ships complete products, not isolated demos.
2. His experience spans mature Rails systems, Elixir/Phoenix products, desktop and mobile software, infrastructure, security, and data.
3. His AI work includes the surrounding product system: permissions, review, retries, evidence, observability, and deterministic boundaries.

The primary conversion is a relevant email conversation about senior full-stack, product engineering, modernization, or practical AI work. Résumé downloads, GitHub visits, and LinkedIn visits are supporting conversions.

## Audience and primary journeys

| Audience | What they need | Preferred journey |
| --- | --- | --- |
| Hiring manager | Positioning, scope, experience, availability | Home → Experience → Résumé or Contact |
| Technical or product leader | Ownership, judgment, implementation depth | Home → Work → Case study → Contact |
| Potential client | Relevant problems, proof, a direct next step | AI or Work → Contact |
| Developer or collaborator | Tools, architecture, writing, source code | Work or Writing → GitHub/project |

## Positioning and voice

- Primary title: **Senior software engineer**.
- Supporting position: product-minded full-stack engineer who can own architecture, UI, data, infrastructure, delivery, and maintenance.
- Location and work mode: Austin, Texas; open to remote work.
- Voice: first person, direct, technically credible, and specific.
- Prefer plain claims over slogans. Explain the problem, the product decision, and Renat's ownership.
- Do not describe planned work as shipped or imply automatic AI authority where the product only proposes drafts.
- Metrics such as `15+ years`, `Rails 4→8`, `10→90%` coverage, and `~50%` AWS cost reduction are professional claims. Do not change or extend them without verified evidence.

## Claim sources and boundaries

Use this precedence when copy conflicts:

1. A direct correction or requirement from Renat.
2. Current product behavior, repository source, release notes, and official product pages.
3. The current résumé and verified professional records.
4. Existing portfolio copy.

Ask before publishing a claim that cannot be verified from those sources.

Permanent content boundaries:

- **Scaled Factorial Product is an AI outsourcing company, not a math or education product.**
- SMS360, OnPloy, and Show-Score are product companies or direct professional roles.
- CAI, New Fortress Energy, Bridgestone, EcoSouth, and Euroports are customer environments supported through platform work; do not present them as direct employers unless Renat says otherwise.
- AI-generated fields, copy, decisions, reviews, or tasks are suggestions or drafts unless the underlying product explicitly performs the action.
- ResellerIO prepares marketplace assets and listing drafts; it does not imply automatic marketplace publishing or checkout.
- Product status, availability, integrations, release versions, and customer names can change and should be rechecked before edits.

## Information architecture

All public directory routes use a trailing slash and an `index.html` file.

| Route | Purpose | Required content |
| --- | --- | --- |
| `/` | Positioning and proof | Hero, availability, career proof, selected work, practical AI, experience preview, writing preview, contact CTA |
| `/work/` | Complete product portfolio | Featured case studies, desktop products, smaller tools, product-ownership CTA |
| `/work/<slug>/` | Product case study | Hero, facts, screenshot, problem, product, boundary or reliability discussion, ownership, proof summary, next project |
| `/ai/` | AI engineering approach | Principles, product examples, integration work, human-control boundaries, contact CTA |
| `/experience/` | Professional record | Roles, outcomes, companies versus customer environments, independent products, skills, education |
| `/writing/` | Published thinking | Descriptive article links grouped by topic and a conversation CTA |
| `/about/` | Personal engineering narrative | Career path, working principles, portrait, availability CTA |
| `/contact/` | Conversion page | Email, LinkedIn, GitHub, good-fit work, résumé CTA |
| `/404.html` | Recovery | Clear error, Home and Work links |
| `/download/Renat Ibragimov - Software Engineer.pdf` | Compact professional record | Experience, skills, and selected work consistent with the website |

The desktop and mobile primary navigation order is fixed: Work, AI, Experience, Writing, About, Contact, Résumé.

Every current public page uses the same three-line footer: `Renat Ibragimov`, `Senior software engineer · Made in Austin☆Texas`, and `© 2026`.

## Project inventory

### Portfolio case studies

| Product | Positioning | Current destination |
| --- | --- | --- |
| Papereg | AI document workflows and reviewable records | `/work/papereg/` |
| ResellerIO | AI-assisted commerce inventory and listing drafts | `/work/resellerio/` |
| Oceanowledge | Portable courses and books built from author-controlled source | `/work/oceanowledge/` |
| Eos Learning | Private, offline mobile English grammar course | `/work/eos-learning/` |
| Texas Heavy | Event discovery, ingestion reliability, and community data | `/work/texas-heavy/` |
| HermIIS | AI project intelligence connecting delivery context | `/work/hermiis/` |

### Desktop and developer products

| Product | Positioning | Current destination |
| --- | --- | --- |
| 1537paperstreet | Local-first Markdown workspace for macOS | GitHub repository |
| GitRonimo | Native Rust/GPUI Git client for macOS | GitHub repository |
| Elixir + Phoenix Codex Harness | Agent-assisted Elixir/Phoenix development guidance | GitHub repository |
| GitHub PR Review | Browser extension for developer review workflows | Chrome Web Store |

### Other products

| Product | Correct category |
| --- | --- |
| Scaled Factorial Product | AI outsourcing |
| Made by Human | AI provenance |

## Case-study content model

Every full case study should contain:

1. A category eyebrow, product name, one-sentence product definition, live-product link, and All Projects link.
2. Facts for Renat's role, the product focus, stack or product form, and current status.
3. One authentic product image with useful alt text and explicit width and height.
4. The problem in domain language.
5. The shipped product workflow and important capabilities.
6. An AI boundary, reliability problem, privacy boundary, or equivalent product constraint.
7. Renat's engineering ownership and the decisions that demonstrate it.
8. Compact lists for core capabilities and what the work demonstrates.
9. A next-project or portfolio CTA.

Do not turn a case study into a feature dump. Prefer decisions, constraints, and evidence. Add outcomes only when a result can be stated honestly and attributed safely.

## Visual system

The source of truth is `css/site.css`.

### Color tokens

| Token | Value | Use |
| --- | --- | --- |
| `--bg` | `#141318` | Main dark background |
| `--bg-deep` | `#0f0e13` | Footer and deeper surfaces |
| `--surface` | `#201f27` | Cards and panels |
| `--surface-raised` | `#292733` | Raised elements |
| `--surface-violet` | `#27294c` | Branded feature surfaces |
| `--text` | `#f7f4fb` | Primary text |
| `--text-soft` | `#d6d0dc` | Body copy |
| `--muted` | `#aaa3b4` | Supporting labels |
| `--accent` | `#ed6fbd` | Primary pink accent |
| `--accent-strong` | `#ff86cd` | Interactive and emphasized accent |
| `--violet` | `#a995ff` | Secondary accent |
| `--success` | `#78d7b1` | Availability and success state |

### Typography and spacing

- Typeface: Poppins 400, 500, 600, and 700 with system fallbacks.
- Maximum page shell: `1180px`.
- Maximum long-form measure: `68ch`.
- Headings use tight line height, slightly negative tracking, and balanced wrapping.
- Body copy uses a `1.6` line height and pretty wrapping.
- Use the existing responsive `clamp()` scales instead of page-specific fixed sizes.
- Preserve generous vertical spacing and clear content groups; do not fill empty space with decoration.

### Components

Reuse the existing header, mobile `<details>` navigation, hero, proof strip, project card, panel, tag list, split section, timeline, case-study layout, article list, quote, CTA, contact card, and footer styles. Add a component only when existing patterns cannot express the content clearly.

Project screenshots use a visible border, rounded frame, subtle inner outline, and top-centered crop. Decorative animation is intentionally restrained. Hover motion must not be required to understand or use the site.

### Responsive behavior

- At `64rem`, desktop navigation becomes the native `<details>` mobile menu; heroes and split layouts collapse to one column.
- At `48rem`, card grids become one column, the proof strip becomes two columns, article cards simplify, and CTA/footer layouts stack.
- At `25rem`, the proof strip becomes one column and buttons become full width.
- The site supports a minimum width of `320px` and must never produce horizontal page overflow.
- Reduced-motion and forced-colors preferences must remain supported.

## Accessibility contract

- Every page starts with a visible-on-focus Skip to content link targeting `main#main`.
- Use one descriptive `h1`; keep heading order meaningful.
- Mark the current desktop and mobile navigation item with `aria-current="page"`.
- Interactive controls and links must have visible keyboard focus.
- Maintain at least a 44px target height for navigation and key actions.
- Every meaningful image needs descriptive alt text and dimensions. Decorative images use empty alt text.
- External links opened in a new tab use `rel="noreferrer"`.
- Link text must name its destination or action; avoid generic Click here or Learn more.
- Content and interaction must remain usable with reduced motion, forced colors, keyboard navigation, and narrow screens.

## Technical and publishing contract

- Hosting: GitHub Pages from `github.com/mpakus/aomega.co`, custom domain `aomega.co` through `CNAME`.
- Delivery: static HTML and CSS. No build step, framework, client-side router, CMS, or JavaScript dependency is required for the redesigned pages.
- Shared styles live in `/css/site.css`; root-relative URLs keep nested pages consistent.
- Public pages include a title, description, canonical URL, theme color, Open Graph title/description/URL/image, favicon, font loading, and the shared stylesheet.
- The homepage carries Person JSON-LD. Add more structured data only when the visible content supports it.
- New public pages must be added to `sitemap.xml`. Site-wide identity changes must also be reviewed in `manifest.json`, `robots.txt`, `CNAME`, the résumé, navigation, and footer.
- Keep current pages independent of legacy files under `prev/`, older CSS/JS bundles, and archived assets.

## Image and preview rules

- Product assets belong in `img/projects/`; browser QA previews belong in `img/previews/`.
- Prefer real product UI over generated mockups. Use a landing-page capture only when an authenticated product screen is unavailable.
- Crop deliberately, remove private data, and keep text legible enough to communicate product shape.
- Preserve aspect ratio and record intrinsic dimensions in HTML.
- Optimize assets before publishing; avoid replacing a good screenshot merely to change its file format.
- Current key previews document the home page, mobile layout, project grid, Papereg, HermIIS, desktop products, and organization section.

## Verification checklist

Before calling a site change complete:

- Parse every public HTML page and confirm exactly one `h1` and no duplicate IDs.
- Confirm local links and image targets exist.
- Confirm each image has alt text and explicit dimensions.
- Confirm external `target="_blank"` links include `rel="noreferrer"`.
- Validate `manifest.json` and `sitemap.xml` syntax.
- Check affected pages at approximately `1440px` desktop and `390px` mobile widths.
- Check active navigation, expected copy, broken images, horizontal overflow, keyboard focus, and browser console errors.
- Run `rtk git diff --check`.
- Report structural checks and browser checks separately; do not call an unperformed deployment or live check complete.

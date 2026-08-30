# AGENTS.md

## Mission

Maintain aomega.co as an accurate, fast, accessible static portfolio for Renat Ibragimov. Read [docs/SITE-SPEC.md](docs/SITE-SPEC.md) before changing the site and use [docs/IMPROVEMENTS.md](docs/IMPROVEMENTS.md) for planned work.

## Repository shape

- `source/index.html.slim`: homepage source.
- `source/work/index.html.slim`: project index source.
- `source/work/*/index.html.slim`: full case-study sources.
- `source/ai/`, `source/experience/`, `source/writing/`, `source/about/`, `source/contact/`: primary page sources.
- `source/layouts/layout.slim`: common page shell.
- `source/partials/`: shared head, header, navigation, and footer.
- `source/css/site.css`: shared design system and responsive behavior.
- `source/js/aurora.js`: dependency-free controls for the shared CSS Aurora background.
- `source/img/projects/`: public product screenshots.
- `source/img/previews/`: browser-QA and design previews.
- `source/download/`: public résumé and downloads.
- `source/sitemap.xml`, `source/robots.txt`, `source/manifest.json`, `source/CNAME`, `source/404.html.slim`: GitHub Pages and discovery surfaces.
- `source/prev/`, older CSS/JS, and archived assets: legacy material; do not modify or delete without explicit scope.
- `build/`: generated output; never edit or commit it.

The site is authored with Middleman 4 and Slim, then generated as static HTML and CSS for GitHub Pages at `aomega.co`. Preserve that small build architecture unless the user explicitly requests a different publishing system.

## Required workflow

1. Inspect the branch and `rtk git status --short`; preserve unrelated and uncommitted work.
2. Prefix every shell command with `rtk`.
3. Read the complete affected Slim template, shared layout or partial, and nearby styles before editing.
4. Search all pages, metadata, the résumé, and docs for the vocabulary being changed.
5. Treat current implementation and verified product sources as authoritative; keep planned work in `docs/IMPROVEMENTS.md`.
6. Make the smallest coherent source change. Reuse the layout, partials, helpers, components, and CSS tokens before adding markup or styles.
7. Verify the affected routes at desktop and narrow-mobile widths when presentation changes.
8. Run `rtk bundle exec middleman build`, `rtk bundle exec ruby script/check_build.rb`, and `rtk git diff --check`; report exactly what was and was not verified.

Do not commit, push, deploy, publish, or remove legacy assets unless the user asks.

## Content invariants

- Position Renat as a senior software engineer and product-minded full-stack builder with 15+ years of production experience.
- Explain complete workflows, constraints, decisions, and ownership. Do not inflate a feature list into unsupported business impact.
- Keep employers and supported customer environments distinct.
- Scaled Factorial Product is **AI outsourcing**, never math or education.
- AI output is a draft or suggestion when people still review or authorize it.
- Do not imply ResellerIO provides automatic marketplace publishing or checkout.
- Do not publish private client information, internal data, testimonials, or metrics without confirmation.
- Recheck drift-prone facts such as product status, versions, availability, integrations, and external links.
- Keep Home, Experience, About, Contact, the résumé, and relevant case studies consistent when professional claims change.

## Page and component rules

- Edit `source/**/*.html.slim`, never generated `build/**/*.html`.
- Use YAML frontmatter for page-specific title, description, canonical, Open Graph, navigation, and schema settings.
- Use root-relative internal URLs and trailing-slash directory routes.
- Keep one descriptive `h1` per page and meaningful heading order.
- Include `main#main` and a Skip to content link.
- Keep desktop and mobile navigation synchronized and mark the current route with `aria-current="page"`.
- Reuse the header, hero, project cards, panels, split sections, case-study layout, article list, CTA, and footer patterns from `css/site.css`.
- Preserve the `1180px` shell, `68ch` reading measure, dark palette, Poppins typography, restrained motion, and existing breakpoints.
- Keep the Aurora decorative, continuously animated across the full viewport, pausable, behind content, and static whenever reduced motion is requested.
- Use descriptive destination text for links. External new-tab links require `rel="noreferrer"`.
- Images require useful alt text, intrinsic width and height, and an intentional crop. Prefer real product UI to generated mockups.
- Do not add another framework, dependency, JavaScript interaction, or new abstraction for content that existing Slim and CSS can express.

## Case-study rules

A full case study includes:

- Product category, name, concise definition, live/source link, role, focus, stack or form, and current status.
- Authentic product media.
- Problem, shipped workflow, important boundary or reliability concern, and engineering ownership.
- Core-capability and demonstrated-skill summaries.
- A next-project or portfolio CTA.

Trace technical claims to the current product, repository, or owner evidence. Never convert a planned integration or idea into present-tense capability.

## SEO and publishing rules

- Every public page needs a unique title, description, canonical URL, Open Graph title/description/URL/image, favicon, font declaration, and `/css/site.css`.
- Add or remove public routes in `source/sitemap.xml` at the same time as the page.
- Review `source/manifest.json`, `source/robots.txt`, `source/CNAME`, Person JSON-LD, navigation, footer, and résumé when site identity changes.
- Keep GitHub Pages path behavior in mind; verify nested routes and the custom 404 page from a local server before publishing.

## Verification

For content-only changes:

- Search for stale versions of the changed claim.
- Confirm affected links and local targets.
- Run `rtk bundle exec middleman build`, `rtk bundle exec ruby script/check_build.rb`, and `rtk git diff --check`.

For page, layout, or image changes, also:

1. Start the Middleman server with `rtk bundle exec middleman server`.
2. Check affected pages near `1440px` desktop and `390px` mobile widths.
3. Confirm expected content, active navigation, image loading, keyboard focus, no horizontal overflow, and no console errors.
4. Parse generated public HTML in `build/` and check one `h1`, unique IDs, local targets, image alt/dimensions, external-link rel attributes, valid manifest JSON, and valid sitemap XML.

Keep focused checks, whole-site structural checks, browser checks, and production/deployment evidence separate in the final report.

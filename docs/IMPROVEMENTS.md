# Portfolio improvement direction

Last reviewed: 2026-08-30
Companion contract: [SITE-SPEC.md](SITE-SPEC.md)

## Direction

The site should become stronger through better evidence, not more decoration. Each improvement should help a hiring manager, technical leader, potential client, or developer understand Renat's work and take the next step with less uncertainty.

Keep the generated site static and the Middleman/Slim toolchain minimal. Add machinery only when a demonstrated publishing need justifies it.

## Completed foundation

- [x] Replace the single legacy portfolio page with a consistent multi-page site.
- [x] Add Work, AI, Experience, Writing, About, Contact, and 404 pages.
- [x] Add full case studies for Papereg, ResellerIO, Oceanowledge, Eos Learning, Texas Heavy, and HermIIS.
- [x] Add 1537paperstreet, GitRonimo, the Elixir/Phoenix harness, and real project imagery.
- [x] Distinguish direct product companies from supported customer environments.
- [x] Position Scaled Factorial Product correctly as AI outsourcing.
- [x] Establish a shared dark visual system, responsive navigation, accessible focus states, reduced-motion handling, and reusable static components.
- [x] Add canonical metadata, Open Graph metadata, Person JSON-LD, a sitemap, robots rules, manifest, custom 404 page, and GitHub Pages domain configuration.
- [x] Complete structural HTML checks and desktop/mobile browser checks for the redesign.
- [x] Move page sources to Slim, extract shared layout/navigation/footer partials, and add a reproducible Middleman build.
- [x] Add a GitHub Actions workflow that publishes the generated `build/` artifact to GitHub Pages.

## P0 — accuracy and publishing confidence

### 1. Reconcile every professional claim

Review the website and résumé together for role dates, company names, customer relationships, metrics, product status, and technology claims.

Done when:

- Dates and descriptions agree across Home, Experience, About, and the résumé.
- `15+`, `4→8`, `10→90%`, and `~50%` have a retained source or explicit owner confirmation.
- Employers, clients, product companies, and customer environments remain visibly distinct.
- Product status and availability wording have been rechecked.

### 2. Validate the production build on GitHub Pages

The current redesign is local work until committed and published by an authorized user.

Done when:

- Every sitemap route returns the expected page on `https://aomega.co`.
- Nested routes load `/css/site.css`, fonts, icons, and project images correctly.
- The custom domain, HTTPS, canonical URLs, sitemap, robots file, manifest, and 404 behavior work in production.
- Desktop and mobile production checks show no overflow, broken media, or console errors.

### 3. Check all external destinations

Verify project sites, GitHub repositories, Chrome Web Store, LinkedIn articles, LinkedIn profile, email, and résumé links.

Done when:

- Each destination resolves without an unexpected redirect or access error.
- Removed or private products are labeled or removed rather than left broken.
- External product copy still matches the destination's current behavior.

## P1 — stronger proof of engineering work

### 1. Add outcomes to the best case studies

Prioritize Papereg, ResellerIO, HermIIS, and one mature professional project. Add evidence such as scale, time saved, adoption, reliability improvement, release cadence, or a clear before/after workflow only when it can be published safely.

Done when each expanded case study has:

- A concrete constraint or starting state.
- Two or three important engineering decisions.
- One verified outcome or an honest explanation that metrics are private.
- Renat's role, team context, and ownership boundary.

### 2. Replace marketing captures with product-state screenshots

HermIIS currently uses a public landing-page capture. Collect safe, representative in-product views for its planning graph, decisions, GitHub context, AI citations, and analytics. Audit the other products for the same opportunity.

Done when:

- Screenshots show the workflow described by the copy.
- Private customer or account data is absent.
- Captions explain why the screen matters instead of narrating obvious UI.
- Desktop and mobile crops remain legible.

### 3. Give desktop products full case studies

Create local pages for 1537paperstreet and GitRonimo after there is enough stable material to explain their problem, product decisions, local-first or Git safety boundary, and current release state. Keep GitHub as the primary source link.

Done when:

- Each product has current screenshots, role, stack, status, decisions, and limitations.
- Claims match the current README and release.
- The Work page links to the local case study, which links onward to GitHub.

### 4. Add architecture visuals only where they clarify ownership

Good candidates are Papereg document processing and review, HermIIS retrieval/context flow, and ResellerIO's photo-to-listing workflow. A diagram must explain a real boundary or sequence that prose cannot show as quickly.

Do not add decorative architecture diagrams or generic AI pipelines.

## P1 — clearer conversion

### 1. Make availability precise

Keep the existing availability signal current. If Renat is actively consulting, define the engagement types and preferred project scope on Contact. If he is seeking employment, name the role level and work arrangement without mixing both messages into every CTA.

### 2. Add third-party proof with permission

Use a small number of specific recommendations from colleagues, clients, or LinkedIn only after permission and attribution are confirmed.

Done when each quote names the relationship and supports an existing claim rather than adding generic praise.

### 3. Measure conversion only if it will change decisions

If analytics are added, prefer a privacy-respecting tool and track a minimal set of events: case-study visits, résumé downloads, email clicks, and external project visits. Document the privacy impact.

Do not add analytics merely to produce a dashboard.

## P2 — durable content and discoverability

### 1. Publish selected articles locally

Move the strongest LinkedIn writing into accessible local article pages when Renat wants an owned archive. Preserve or explicitly choose canonical URLs and link to the original publication.

Start with articles that reinforce practical AI, Rails/Elixir depth, modernization, permissions, or product delivery.

### 2. Add page-specific social images

Create consistent Open Graph images for Home, Work, AI, Experience, and major case studies. Each image should identify the page at social-feed size without depending on tiny product UI.

### 3. Expand structured data carefully

Consider `CreativeWork`, `SoftwareApplication`, or `Article` JSON-LD only for visible, accurate content. Validate it before publishing. Do not generate structured data for facts that the page itself does not show.

### 4. Improve asset performance

Measure first. Likely opportunities include responsive product images, modern formats, and self-hosting or reducing external font requests.

Done when changes reduce transferred bytes or render delay without softening screenshots or complicating the static site.

## P2 — maintenance

### 1. Automate the repeated structural check

If the portfolio keeps growing, add one small repository script or CI job that checks page parsing, one `h1`, duplicate IDs, local targets, image metadata, external-link rel attributes, manifest JSON, and sitemap XML.

Do this only when maintaining the current manual check becomes repetitive; avoid introducing a site framework for validation.

### 2. Audit legacy assets before removal

The repository still contains older pages, CSS, JavaScript, downloads, and `prev/` assets. Build a reference list first, then remove only files proven unused by the current site and historical requirements.

Never delete the legacy material as part of an unrelated content change.

### 3. Establish a screenshot refresh routine

Refresh a product image when the UI changes enough to make the current screenshot misleading, not on every release. Record the source URL or repository asset and capture date in a short commit note or pull-request description.

## Ideas intentionally deferred

These are not default improvements:

- Another site framework, a CMS, a client-side component system, or a client-side router.
- A theme switcher; the dark visual identity is deliberate.
- A contact-form backend; direct email is simpler and more reliable at current volume.
- A `/now/`, `/uses/`, services, newsletter, or changelog page without a real update cadence or audience need.
- Decorative animation, 3D effects, or AI-generated product mockups when authentic screenshots exist.
- Publishing private client details, internal architecture, or unverifiable impact metrics for stronger-looking copy.

Reconsider a deferred idea only when an observed maintenance or audience problem justifies it.

## Definition of done for roadmap work

An improvement is complete only when:

1. Its public claim is supported by product, repository, résumé, or owner evidence.
2. Every affected page and metadata surface is updated together.
3. Desktop and narrow-mobile behavior are checked when presentation changes.
4. Accessibility, local links, media, active navigation, overflow, and console output are checked.
5. Verification and remaining limitations are reported separately.

# Install the AXIOM theme — an implementation prompt for any coding model

## One-line request

Install the Openform "AXIOM" Edition 02 theme in this project. The complete downloaded kit is available locally. Read AI-PROMPT.md and theme.json, run install-theme.mjs against this project's root, then follow reference.html and components.html to apply the exact system across the site. Preserve the existing content, routes, data, and functionality.

## Your task

Apply this exact identity to the user's existing website. This kit contains executable theme CSS, local fonts, original SVG assets, working HTML references, reusable React components, and a machine-readable specification. Use those supplied files as the implementation. Do not recreate the look from a verbal adjective.

## 1. Locate the kit and the project

Find the folder containing this AI-PROMPT.md, theme.json, theme.css, reference.html, and install-theme.mjs. Find the existing project root and identify its framework from its files. Read theme.json, INSTALL.md, reference.html, and components.html. Keep the current framework and dependency setup.

Run from the kit folder:

```sh
node install-theme.mjs --target "/absolute/path/to/the/existing/project"
```

The installer places the complete theme at public/themes/axiom/ by default. For plain HTML with no public directory, use --public-dir . . For a custom static-assets folder, set --public-dir to that folder. It can attach the stylesheet and theme attribute to an existing HTML entry when --html is provided. Use --react to copy the supplied components into src/components/openform/axiom.tsx when that is useful.

## 2. Load the exact theme

```html
<link rel="stylesheet" href="/themes/axiom/theme.css">
<html lang="en" data-openform="axiom">
```

The data-openform attribute can instead be on one existing root wrapper if the theme should affect only that subtree. Load the stylesheet once, after broad reset or framework styles. Preserve the supplied fonts/ directory next to theme.css. The fonts are local; do not substitute a Google Fonts request.

- Vite / plain HTML: add the link and root attribute to the existing index.html; the installer can do this with --html index.html.
- Next.js App Router: add the attribute to the existing root html or body in app/layout.tsx, and add the stylesheet link in its head. Preserve existing providers, metadata, children, and layout logic.
- Next.js Pages Router: use the existing document/root layout for the stylesheet and attribute.
- Vue / Svelte / Astro: use the existing document or root layout for the link and root attribute; use the HTML component classes below.
- React: optionally copy components.tsx into your existing source tree. It only depends on React and passes through ordinary props and handlers.

## 3. Exact visual specification

- Direction: **Open intellectual structure**.
- Concept: Impossible triangular studies, glacial blueprint fields, precise research annotations, and wide-set modern type. Complexity is presented with a deeply legible visual order.
- Ink: **#253745**. Accent: **#A6D4E1**. Paper: **#EFF4F2**. Support: **#D3B986**.
- Display: **Space Grotesk**, weight **500**, letter spacing **0.07em**, line height **1.02**. The supplied CSS handles the responsive size.
- Body: **Archivo**, 16px, weight 400, line height 1.7; keep reading lines at 65 characters or less.
- Page maximum width: **1420px**. Gutters: **clamp(20px, 4vw, 64px)**. Section spacing: **clamp(64px, 9vw, 128px)**.
- Component corner radius: **2px**. Button shape: **square**. Borders: **1px**. Buttons: at least **48px** high. Inputs: **52px** high.
- Information cards use quiet top dividers and **0px** corners. Keep one focal illustration, a clear type hierarchy, and generous reading space. Do not add decorative layers or dense application collages.
- Layout: Clarity-white technical hero, a glacial triangular study, wide-set titles, and fine blueprint lines. Research details use a strict, readable module grid.
- Hero background: **#EFF4F2**. Hero foreground: **#253745**. Alignment: **left**.
- Desktop hero text / image proportion: **48 / 52**. At 960px the hero becomes one column. At 640px the card grid becomes one column and the mobile navigation takes over.

Identity-specific constraints:
1. The three sides of the triangle use matching thickness.
2. Blueprint lines should support structure, not compete with content.
3. Use glacier for diagram fields and deep logic for explanatory text.

## 4. Map existing components to the actual provided classes

Use the existing content and existing components. Add these classes or use the included component primitives:

| Existing element | Provided class |
| --- | --- |
| Root wrapper | of-theme, plus data-openform="axiom" |
| Page container | of-container |
| Header and navigation | of-header, of-nav, of-mobile-nav |
| Hero section / inner layout | of-hero / of-hero-inner |
| Hero copy / title / image | of-hero-copy / of-display / of-hero-media |
| Supporting large paragraph | of-lede |
| Section / heading row / heading | of-section / of-section-heading / of-heading |
| Reading text | of-body |
| Small uppercase label | of-eyebrow |
| Action group / primary button | of-actions / of-button |
| Secondary action | of-button of-button--ghost |
| Responsive card grid | of-grid |
| Card / image / body | of-card / of-card-image / of-card-body |
| Badge | of-badge |
| Form / labeled field | of-form / of-field |
| Input / select / textarea | of-input / of-select / of-textarea |
| Notice / table / accordion | of-notice / of-table / of-accordion |
| Footer | of-footer / of-footer-top / of-footer-bottom |

The working markup in reference.html and components.html is authoritative. Copy an appropriate structure, then replace only its demonstration copy with the real project copy. Preserve the real site's SEO metadata; the fictional reference pages' noindex metadata belongs only to the references. Do not replace a working form handler with the local demonstration form handler. Do not invent customer counts, endorsements, or statistics.

## 5. Exact asset paths after installation

```text
/themes/axiom/lockup.svg          Primary logo
/themes/axiom/mark.svg            Compact symbol
/themes/axiom/wordmark.svg        Wordmark
/themes/axiom/monochrome.svg      One-color logo
/themes/axiom/artwork.svg         Original hero artwork
/themes/axiom/pattern.svg         Supporting pattern
/themes/axiom/packaging.svg       Product / packaging study
/themes/axiom/stationery.svg      Stationery study
/themes/axiom/identity-board.svg  Complete visual reference
/themes/axiom/reference.html      Working website reference
/themes/axiom/components.html     Working component reference
```

Use real img elements with descriptive alt text for meaningful images. Decorative patterns may be CSS backgrounds. Keep logos' aspect ratio. Use the real files rather than emoji, stock icons, placeholder URLs, or textual approximations of the symbol.

## 6. Apply it everywhere the user requested

Apply the type hierarchy, colors, containers, controls, cards, forms, data views, and footer across the existing pages. Keep navigation, route boundaries, application state, API calls, product data, and existing functionality intact. If a current utility class overrides an intended theme property, remove or update that specific conflicting visual utility; do not remove unrelated layout or behavior.

## 7. Finish and verify

1. The exact stylesheet loads without a 404.
2. All local fonts load; there are no requests to remote font services.
3. The root or intended subtree carries the exact data-openform attribute.
4. The supplied display font, colors, radius, spacing, and layout family are used consistently.
5. At 360px, 768px, and 1440px there is no horizontal page overflow.
6. Navigation, forms, routes, and existing business behavior still work.
7. Controls are keyboard accessible with visible focus; reduced-motion preferences are respected.
8. The final interface follows reference.html and components.html rather than a guessed visual style.

Compare the completed pages to the working reference at desktop and mobile sizes. Report the files changed, the theme path, and the checks actually performed. Implement the result; do not stop at a plan.

## License

Original artwork and design information: CC0-1.0. Theme code and installer: MIT. Font files: original SIL OFL licenses included. Preserve code and font notices when redistributing those files.

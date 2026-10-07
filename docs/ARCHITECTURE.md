# Architecture

## Stack

- React 19, TypeScript, and Vite.
- Motion for short, reduced-motion-aware entrances and notifications.
- Lucide for website interface icons. Brand symbols are separately authored.
- Fontkit for real font shaping and conversion to vector paths.
- Fflate for complete, self-contained ZIP downloads.
- Playwright and axe-core for behavior and automated accessibility verification.

## Source of truth

```text
src/data/brands.json       Names, palettes, font IDs, symbols, and usage rules
src/data/systems.json      Individual art directions, artwork, layout, and content
src/data/assets.json       Shared primary asset definitions and counts
src/data/fonts.json        Original font IDs, families, files, and licenses
src/data/collections.json  Curated collection membership
src/types.ts              Website data contract
scripts/lib/design.mjs     Font shaping, outlined typography, SVG, and pattern helpers
scripts/lib/symbols.mjs    Individually authored master symbols
scripts/lib/artwork.mjs    Original signature illustrations
scripts/lib/identity.mjs   Presentation boards and application compositions
scripts/lib/theme.mjs      Scoped themes, specs, references, primitives, and prompts
scripts/theme-installer.mjs Portable installer distributed in each kit
```

## Generation pipeline

1. `npm run fonts` downloads missing original font files and original OFL notices from the Google Fonts source repository. The runtime site does not request remote fonts.
2. `npm run assets` merges the two brand data files, shapes local typography into portable SVGs, and generates the 30-file identity inventory. Each kit receives scoped CSS, a machine-readable specification, working HTML references, React primitives, a dependency-free installer, ordered instructions, heading/body/accent fonts, and original notices. It writes individual/full-library ZIPs and versioned `catalog.json`.
3. `npm run previews` browser-parses every SVG and renders the social PNG plus identity/application and desktop/mobile theme contact sheets. Inspect those outputs before release.
4. `npm run release` copies public documentation and builds the smaller source archive. An explicit allowlist excludes supplied research images, private environment files, dependencies, build output, and generated kit/download archives.
5. `npm run check` validates source/system consistency, distinct symbol/artwork geometry, approved palette pairs, SVG portability, theme specifications, archive parity, font notices and paths, local references, and prompts.
6. `npm test` exercises the showcase, installed themes, real reference components, responsive boundaries, and accessibility. Installer tests use temporary existing projects and verify backups, repeated installation, optional React output, and nested static documents.
7. `npm run build` type-checks, creates a client bundle, prerenders every crawlable page, writes robots/sitemap output, and validates unique SEO metadata, H1s, canonicals, JSON-LD, and social assets.

## Public output

```text
public/
  brands/<id>/             Primary assets, preview, manifest, fonts, and licenses
  downloads/<id>-brand-kit.zip
  downloads/openform-complete-library.zip
  downloads/openform-source.zip
  social/<id>.png           Identity-specific social previews
  fonts/                   Self-hosted website fonts and original notices
  docs/                    Public usage, contribution, and license documents
  catalog.json             Generated metadata and totals
```

Edition 02 has **48 × 30 = 1,440 primary files**, including 912 primary SVGs. With supplementary previews, Chromium parses 960 SVG documents. Each kit also has a manifest, readme, two licenses, and original local fonts/notices. These supplementary files and ZIP duplication are excluded from primary counts.

## The installed theme contract

- Exact CSS scope: `[data-openform="<id>"]`, applied to the existing document root or an intended wrapper.
- Default destination: `public/themes/<id>/`; public stylesheet: `/themes/<id>/theme.css`.
- `theme.json` defines exact colors, typography, proportions, responsive breakpoints, component classes, font files, installation paths, exports, and acceptance checks.
- `reference.html` and `components.html` execute the same stylesheet and assets; they are usable without the library website.
- `install-theme.mjs` uses only Node built-ins. It preflights source files before copying, optionally attaches the chosen existing HTML entry, and optionally copies `components.tsx` into the application source.
- `theme.js` enhances the reference menu and demo form only. Applications keep their real interaction handlers.
- `AI-PROMPT.md` maps existing framework roots/components to the supplied files and exact decisions. It instructs models to finish implementation and preserve actual content, routes, providers, state, and data.
- CSS/JS/TSX/installer code is MIT; original design information/artwork is CC0; fonts retain OFL notices.

## Navigation & state

- Section navigation uses native hash anchors.
- Brand detail links use `#brand/<id>`, allowing direct static-host deep links.
- Search and facets live in query parameters (`q`, `style`, `industry`, `collection`).
- Bookmarks live in `localStorage` and synchronize through the browser storage event.
- Native modal dialogs provide focus trapping and inert underlying content. The opener is restored when the dialog closes, including through browser history.
- Downloads are real static links, so they also work outside React.
- The homepage and every identity/style/collection/guide route are prerendered into directory `index.html` files. Query/search states remain client-side and are marked `noindex, follow`.
- `VITE_SITE_URL` is the only publishing-specific SEO input. It must be the real origin; when present it enables absolute canonical/social URLs and `sitemap.xml`.

## Adding new applications

Add a renderer, generate the new file, add it to the primary asset manifest if appropriate, expose it in the detail view, and validate the archive. Keep displayed counts derived from the actual asset list.

## Deployment

The output is serverless static content. The current runtime uses root-relative URLs and expects the domain root. Hash routing avoids rewrite requirements. Configure `VITE_REPO_URL` before building to connect community links to your own repository.

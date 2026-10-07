# goodkind / Edition 02

> A little good goes a long way.

## Generosity in print

Embracing shapes, riso-style overprinting, neighborhood notices, and welcoming rounded lettering. Warmth comes from the sense that many people belong here.

A generous identity for a neighborhood mutual-aid collective. A smiling loop, surprising tomato red, and friendly typography make participation feel easy.

## A complete, usable visual world

This identity includes an individually authored master symbol, real font files, original illustration, art-directed campaign, composed identity board, stationery, packaging, web direction, icon sheet, and a complete working theme. The illustrations and applications are original vector artwork, not photographs or official assets of an existing company.

Start by opening **reference.html** and **components.html**. They are working local pages, not screenshots. Open identity-board.svg for the full visual system. To apply the design to an existing project, read INSTALL.md or give a coding model AI-PROMPT.md.

## Personality

Inclusive, encouraging, and refreshingly human.

## The distinguishing decisions

1. The smile remains open at the top; do not turn it into a closed badge.
2. Write calls to action in everyday language and sentence case.
3. Use lavender and tomato in separate blocks, with plum linking the layout.

4. Lavender hero with embracing forms, plum headings, and tomato event panels below. Friendly pill controls; readable event information always stays on a calm surface.
5. Use the supplied collective-embrace artwork as the principal visual device. Do not substitute an unrelated stock image or a generic gradient.
6. Keep informational reading areas calm and aligned even where the campaign is expressive.

## Logo system

- lockup.svg: primary symbol-and-wordmark configuration.
- wordmark.svg: independent typographic wordmark.
- mark.svg: compact master symbol; useful for avatars, corners, and interface accents.
- monochrome.svg: genuine single-color version.
- favicon.svg and avatar.svg: ready-sized applications.

All artwork typography is outlined. The artwork renders correctly without installed fonts or internet access. Keep clear space of at least half a symbol height around independent lockups; minimum recommended symbol width is 24px and lockup width is 160px. Never stretch glyphs or separately distort part of a mark. Intentional large crops belong in campaigns, not the primary logo file.

## Color roles

| Role | Name | Value |
| --- | --- | --- |
| Ink | Plum | #452C59 |
| Accent | Lavender | #C9B6EA |
| Paper | Warm white | #FFF6DE |
| Support | Tomato | #F0775D |

### Approved normal-text combinations

- #452C59 on #C9B6EA: 6.47:1, meets WCAG AA for normal text.
- #452C59 on #FFF6DE: 11.09:1, meets WCAG AA for normal text.

Support color is an illustration / decorative surface until its intended text pairing is independently checked. The theme uses approved primary pairs and an explicitly derived secondary reading color.

## Typography

- Display: Rubik, weight 600, tracking -0.04em, leading 1.02.
- Reading: DM Sans, weight 400, 16px, 1.7 leading, up to 65 characters per line.
- Accent: Bricolage Grotesque, normal.
- Labels: 11px, 0.08em tracking, 1.5 leading.
- Maximum desktop display size: 96px. Use the provided CSS clamps on narrower screens.
- Keep the original, unmodified local font files and their original SIL OFL notices together.

## The layout grammar

Lavender hero with embracing forms, plum headings, and tomato event panels below. Friendly pill controls; readable event information always stays on a calm surface.

The page maximum width is 1280px. Gutters use clamp(20px, 4vw, 64px). Section spacing uses clamp(64px, 9vw, 128px). The base spacing unit is 4px. The desktop hero's text/image proportion is 51/49; centered compositions use a single wide column. At 960px the hero becomes one column. At 640px the card grid becomes one column and native mobile navigation becomes available.

## Components

The base radius is 40px; information cards use 0px corners and a quiet top divider. Borders are 1px; buttons follow the pill direction. Buttons are at least 48px high; inputs are 52px high. Controls keep a visible 3px focus outline with a 4px offset. Motion preferences are respected. Keep one clear focal idea per composition.

The class map and exact values live in theme.json. The live inventory in components.html includes real typography, controls, cards, badges, forms, tables, notices, and accordions. Optional components.tsx provides typed React primitives with no dependency beyond React.

## Applications and formats

- **Brand symbol** — mark.svg (Scalable SVG).
- **Primary logo** — lockup.svg (Outlined SVG).
- **Wordmark** — wordmark.svg (Outlined SVG).
- **Monochrome logo** — monochrome.svg (One-color SVG).
- **Signature pattern** — pattern.svg (960 × 720 SVG).
- **Display poster** — poster.svg (800 × 1066 SVG).
- **Social card** — social.svg (1200 × 630 SVG).
- **Profile avatar** — avatar.svg (512 × 512 SVG).
- **Favicon** — favicon.svg (64 × 64 SVG).
- **Signature artwork** — artwork.svg (900 × 900 original SVG).
- **Complete identity board** — identity-board.svg (1600 × 1200 SVG).
- **Stationery system** — stationery.svg (1200 × 900 SVG).
- **Packaging study** — packaging.svg (1200 × 900 SVG).
- **Website direction** — website.svg (1440 × 960 SVG).
- **Vertical campaign** — social-story.svg (1080 × 1920 SVG).
- **Interface icon system** — icon-set.svg (12 brand-styled SVG icons).
- **Palette specification** — palette.svg (Named color system SVG).
- **Typography specification** — typography.svg (Display & reading SVG).
- **Business card system** — business-card.svg (Front & back SVG).
- **Design tokens** — tokens.json (DTCG-style JSON).
- **Complete scoped theme** — theme.css (Responsive CSS component system).
- **Machine-readable theme** — theme.json (Exact implementation specification).
- **Reference interactions** — theme.js (Dependency-free JavaScript).
- **Working website** — reference.html (Local, fully styled HTML).
- **Component reference** — components.html (Working controls & layouts).
- **React components** — components.tsx (Typed, reusable primitives).
- **Portable theme installer** — install-theme.mjs (One command · No dependencies).
- **AI implementation prompt** — AI-PROMPT.md (Ordered small-model instructions).
- **Installation guide** — INSTALL.md (Plain HTML & framework workflows).
- **Complete brand guidelines** — guidelines.md (Art direction & identity rules).

The composed preview is supplementary to the 30 primary files; original font files and license notices are supplementary too. Counts do not include duplicate ZIP archives, repeated licenses, or per-font support files.

## Installing the theme

```sh
node install-theme.mjs --target "/path/to/your/project"
```

Load /themes/goodkind/theme.css and attach data-openform="goodkind" to the existing document root or desired subtree. Use the supplied of-* classes to apply the actual component system. Preserve your own content, routes, application state, and real form handlers.

### The instruction to give an AI coding assistant

Install the Openform "goodkind" Edition 02 theme in this project. The complete downloaded kit is available locally. Read AI-PROMPT.md and theme.json, run install-theme.mjs against this project's root, then follow reference.html and components.html to apply the exact system across the site. Preserve the existing content, routes, data, and functionality.

AI-PROMPT.md contains concrete ordered steps, framework mappings, exact asset paths, component names, numeric constraints, and acceptance checks. It is written so a coding model with access to the kit can implement the provided design instead of guessing it.

## Licenses

Original artwork, design information, and identity metadata: CC0-1.0. Theme code, installer, and component code: MIT. Font software retains its original SIL Open Font License. See LICENSE-CC0.txt, LICENSE-CODE.txt, and fonts/*-OFL.txt. These are fictional identity concepts; names are not trademark clearances.

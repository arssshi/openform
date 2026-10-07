# Design standards

## Different by design

A palette swap is not a new system. Each identity must articulate a different answer to:

- What does its symbol mean, and why is this silhouette appropriate?
- How does its composition organize attention?
- What does its typography sound like?
- How does its supporting pattern relate to its core idea?
- What makes its original illustration and physical/digital applications recognizably its own?
- How do the actual working website and component system express the same direction?
- What rules keep its applications recognizably consistent?

The release validator checks distinct symbol and artwork geometry, source directions, layout identifiers, and pattern identifiers. Human visual review remains essential; identifiers alone do not establish originality or quality.

## Typography

- Choose a heading and reading face intentionally.
- Define actual weight, tracking, line height, and useful responsive sizes.
- Preserve glyph proportions. Fit oversized words by scaling type uniformly.
- Use readable body text and a comfortable line length.
- Supply original font files and their licenses.
- Outline application typography so SVG images remain portable.

## Color

- Supply four named, purposeful colors: ink, accent, paper, and support.
- Primary ink on accent and paper must each reach 4.5:1 for normal text.
- Other combinations are not automatically approved as text pairings.
- Do not rely on color alone for controls, data, or status.

## Logo & geometry

- Author a distinct mark; do not substitute a recolored stock icon.
- Keep it understandable at compact avatar and favicon sizes.
- Preserve the relationship between symbol and wordmark.
- Provide a genuine monochrome variant.
- Define clear space and minimum-size guidance.

## Applications

Every Edition 02 kit includes all 30 primary files in `src/data/assets.json`: the complete logo set, supporting pattern, original illustration, identity board, stationery, packaging study, website direction, business cards, campaigns, icon/palette/type sheets, tokens, scoped CSS, specification, HTML references, optional React primitives, installer, prompts, and guidelines. Original fonts and notices are supplementary.

Applications should feel like the same identity while respecting the purpose of each format. Long copy should have its own hierarchy; display typography can be expressive without sacrificing informational clarity.

## A usable theme, not just a mood

- `theme.json`, `theme.css`, the live references, and `AI-PROMPT.md` must agree on the exact decisions.
- Supply real controls, forms, cards, tables, notices, and accordions with consistent state and focus styling.
- Verify fonts/images resolve locally and every supplied class does the documented job.
- Review short cards as well as image cards: large corner radii must not clip headings or reading text.
- Review the reference at phone, tablet, and desktop widths; intentional local table/menu scrolling must not become page overflow.
- Give models concrete file paths, class mappings, implementation order, framework roots, and acceptance checks.
- Keep the real application's content and business behavior intact when applying the design.

## Website

- Let the identities be the most colorful part of the experience.
- Give controls real labels, clear focus, and predictable keyboard behavior.
- Honor reduced motion and avoid continuous decorative motion.
- Use native links for downloads and native dialog semantics for overlays.
- Display actual counts and usable source files.
- Avoid dead-end controls, fake metrics, or fictional community claims.

## Provenance

- Original asset contributions use CC0 1.0.
- Font software retains its own original license and notices.
- Reference imagery is not reclassified as original output.
- Fictional names are concepts, not trademark clearances.

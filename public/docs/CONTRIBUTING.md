# Contributing to Openform

Openform grows through useful, complete, original design systems. Every contribution should give someone a genuinely different starting point.

## Add a new identity

1. Choose a distinct concept, audience, visual direction, and fictional name.
2. Add its definition to `src/data/brands.json`, following `src/types.ts` and an existing complete record.
3. Add a complete art direction under its ID in `src/data/systems.json`, following `IdentitySystem` in `src/types.ts`. Supply a specific concept, original artwork key, layout family, surfaces, alignment, proportions, exact sizes, control style, accent font, campaign/headline, navigation, products, and features.
4. Author its symbol in `drawSymbol()` in `scripts/lib/symbols.mjs` using the `0–100` coordinate space, its illustration in `artworkContent()` in `scripts/lib/artwork.mjs`, and its board composition in `identityPreview()` in `scripts/lib/identity.mjs`. Give it a unique `layout` identifier. A new color for an existing composition is not a new identity. Do not use copied marks or stock icons as original work.
5. Give it a unique `pattern` strategy and adapt `pattern()` where necessary.
6. Select heading, body, and accent fonts intentionally. Use included open fonts, or add an original font and its full license to `src/data/fonts.json` and the fetch workflow.
7. Name all four colors. Verify the ink on both accent and paper at **4.5:1 or better** for normal text.
8. Write a specific concept description, brand voice, and **three identity-specific usage rules**.
9. Add it to `src/data/collections.json`. The brand's `collection` field and collection membership must agree.
10. Regenerate and verify:

```sh
npm run fonts
npm run assets
npm run previews
npm run release
npm run check
npm test
npm run build
```

11. Visually inspect the board, every SVG application, the type playground, and the actual `reference.html` / `components.html` at desktop and mobile widths. Test the extracted kit's installer against a temporary existing project. Inspect the symbol at 24px and 512px.
12. Include a preview and a short explanation of what makes the system different in your pull request.

## Brand definition

Required fields:

```text
id, name, category, style, tagline, description,
colors[4], colorNames[4], heading, body, weight, tracking,
mark, layout, pattern, radius, voice, rules[3], collection, featured
```

- `id`: unique, lowercase, hyphen-separated slug.
- `style`: one of the eight approaches in `src/types.ts`.
- `heading` and `body`: font IDs from `src/data/fonts.json`.
- `tracking`: hundredths of an em. For example, `-3` becomes `-0.03em` in CSS.
- `mark`: the symbol key used by the SVG renderer.
- `layout`: a distinct authored preview composition.
- `pattern`: a distinct supporting motif identifier.
- `radius`: component corner radius in pixels.
- `featured`: whether it is part of the editorially featured group.

`number` and `assets` are generated. Do not add them to the source definitions.

`system` is merged from `systems.json`; do not duplicate it in `brands.json`. The `art` key and direction must be distinct. Features and navigation each contain three entries. A layout family shares reusable implementation primitives, not an interchangeable concept or illustration. Add any necessary family-specific behavior to `scripts/lib/theme.mjs`, keeping its generated specification, CSS, references, and prompts consistent.

## Complete theme handoff

- Generate every file in `src/data/assets.json`; displayed counts derive from that inventory.
- Keep working references self-contained, with local fonts and meaningful image alternatives.
- Preserve accessible palette pairings and keyboard-visible controls at 320px through desktop widths.
- Include exact machine-readable values and ordered implementation instructions suitable for a smaller coding model.
- Keep theme CSS scoped. Preserve users' existing framework, real content, routes, state, and handlers.
- Test HTML attachment twice, original backups, React primitives, custom static folders, and nested documents.

## Improve the website

- Use TypeScript, functional React components, and the existing CSS systems.
- Preserve keyboard accessibility, real link downloads, native dialog semantics, focus restoration, and reduced-motion behavior.
- Make claims and counts reflect the actual catalogue.
- Use local assets. Do not add remote image or font dependencies to the runtime.
- Add meaningful behavioral tests when introducing interactions.
- If changing generated artwork, regenerate the library and verify ZIP contents.

## Licensing a contribution

Submit only work you created or have the right to contribute. Original design assets and information are contributed under CC0 1.0. Website/theme/component/installer code and tooling are contributed under MIT. Third-party fonts retain their original license and copyright notices.

Reference images are research material, not a source of reusable logos. Do not copy a reference identity's name, logo, or artwork into the library.

## Review standard

We look for distinct visual logic, complete applications, useful documentation, small-size clarity, intentional typography, and verifiable provenance. See [the full design standards](docs/DESIGN-STANDARDS.md).

# Install nori / Openform Edition 02

## Let a coding model do it

Unzip the complete kit into a folder your coding assistant can read. Give it this instruction:

> Install the Openform "nori" Edition 02 theme in this project. The complete downloaded kit is available locally. Read AI-PROMPT.md and theme.json, run install-theme.mjs against this project's root, then follow reference.html and components.html to apply the exact system across the site. Preserve the existing content, routes, data, and functionality.

AI-PROMPT.md provides the full ordered implementation instructions. theme.json provides exact values. reference.html and components.html provide executable ground truth.

## One command to install the files

Requires Node.js 18 or newer. No npm dependencies.

```sh
node install-theme.mjs --target "/path/to/your/project"
```

This copies the supplied files to public/themes/nori/. It does not replace your application code.

### Also attach it to a Vite or plain HTML document

```sh
node install-theme.mjs --target "/path/to/your/project" --html index.html
```

The --html option inserts one stylesheet link and the exact data-openform root attribute into the chosen existing HTML file. It is idempotent. It saves the original entry once as index.html.openform-backup.

For a plain static site served directly from its root:

```sh
node install-theme.mjs --target "/path/to/site" --public-dir . --html index.html
```

### Optional React components

```sh
node install-theme.mjs --target "/path/to/project" --react
```

This additionally copies components.tsx to src/components/openform/nori.tsx. The file contains OpenformTheme, ThemeHero, ThemeButton, ThemeCard, ThemeHeading, ThemeInput, ThemeBadge, ThemeContainer, and ThemeIcon. No other libraries are needed.

## Manual installation

Copy the complete kit to your static assets folder, keep fonts/ beside theme.css, then:

```html
<html lang="en" data-openform="nori">
  <head><link rel="stylesheet" href="/themes/nori/theme.css"></head>
  <body class="brand-surface">
    <main class="of-container of-section">
      <img class="of-logo" src="/themes/nori/lockup.svg" alt="nori">
      <h1 class="of-display">Your real project headline.</h1>
      <p class="of-body">Your real project description.</p>
      <a class="of-button" href="/your-existing-route">Your real action</a>
    </main>
  </body>
</html>
```

For frameworks, add the link and attribute in the existing root/document layout. The theme is framework-independent CSS. Put the CSS after broad resets and map your existing components to the of-* classes. The installer report prints the exact public paths.

## Preview without a build

Open reference.html or components.html in your browser after unzipping the kit. Fonts, CSS, SVGs, and the small reference script are local. No service or account is required.

## What the theme does

It supplies the exact font pairings, scoped tokens, base typography, grid, hero, navigation, controls, cards, forms, tables, notices, accordions, and footer. A model or developer maps those ready-to-use components onto your existing application; the installer alone does not infer or restructure your business UI.

## Check the result

- Local font and image requests succeed.
- The right root carries data-openform="nori".
- Desktop and mobile match the included working references.
- Your actual routes, forms, data, and interaction handlers still work.
- Keyboard focus is visible and there is no horizontal page overflow.

Artwork: CC0. Code: MIT. Fonts: original SIL OFL notices included.

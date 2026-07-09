# ZIP First

A public project hub and reference implementation for ZIP/postal-code-first address UX.

The first artifact is a click-to-activate browser extension, but the project is meant to grow into examples, research, data-provider notes, test fixtures, a GitHub Pages site, and a small embeddable library for sites that want to do this natively.

## Thesis

Most US address forms ask for street, city, state, ZIP, then country. That ordering is backwards for many flows. A valid US ZIP Code usually gives useful defaults for city, state, and country.

> ZIP-first should be a reversible default, not a trap.

Fill the likely postal defaults. Keep every field editable. Never pretend that a five-digit ZIP is a complete address, a deliverability guarantee, or a legal jurisdiction.

## Repository map

- [`extensions/browser/`](extensions/browser/) — browser extension reference implementation.
- [`library/`](library/) — tiny embeddable JS helper for native site adoption.
- [`examples/`](examples/) — native ZIP-first form examples and annotated UX sketches.
- [`site/`](site/) — GitHub Pages source / public project site draft.
- [`docs/`](docs/) — research, implementation docs, and internationalization model.
- [`docs/inspiration/`](docs/inspiration/) — vision, comparables, alternatives, evaluation rubric, future directions, sister projects.
- [`AUTHORS.md`](AUTHORS.md) — authorship/provenance.

## Try the extension locally

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select the `extensions/browser/` directory.
5. Open [`examples/basic-zip-first.html`](examples/basic-zip-first.html) or any page with an address form.
6. Click the ZIP First extension button.

## Try the library locally

Open [`examples/library-demo.html`](examples/library-demo.html), or copy the pattern into a site:

```html
<script src="https://cdn.jsdelivr.net/gh/mcint/zipcodefirst-extension@main/library/zipfirst.js"></script>
<script>
  ZipFirst.enhance(document.querySelector("form"));
</script>
```

## Current status

Prototype, US-first, intentionally small.

- License: MIT.
- Browser extension: Chrome/Chromium MV3 now; Firefox/WebExtension compatibility is a design goal.
- Activation model: toolbar click only.
- Current lookup provider: Zippopotam.us.
- Cache: extension local storage, keyed by ZIP, with TTL.
- Current behavior: fill ZIP, city, state, country when fields can be detected.
- Non-goal for v0: full USPS address validation, CASS, ZIP+4 deliverability, tax/voting/legal jurisdiction.

## Public argument

The real win is not an extension. The extension is the wedge.

The project should normalize better address forms:

1. Ask country first when global scope matters.
2. Ask postal code early when the country profile says it helps.
3. Fill inferable locality/admin fields.
4. Keep inferred fields visible and editable.
5. Move the human to the street address quickly.
6. Use correct HTML `autocomplete` and `inputmode` attributes.

## Attribution

Initial scaffold and documentation were created by ChatGPT in collaboration with Loren McIntyre. See [`AUTHORS.md`](AUTHORS.md).

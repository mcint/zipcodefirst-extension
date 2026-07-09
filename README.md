# ZIP First Extension

Invoke ZIP-first help on any address form.

This extension is a tiny, click-to-activate browser helper for the idea behind [zipcodefirst.com](https://zipcodefirst.com/): ask for the ZIP/postal code early, use it to fill the boring fields, and leave the human to type only what the machine cannot safely know.

## Status

Prototype, US-first, intentionally small.

- Browser extension: Chrome/Chromium MV3
- Activation model: toolbar click only
- Current lookup provider: Zippopotam.us
- Current country profile: United States
- Current behavior: fill ZIP, city, state, country when fields can be detected
- Non-goal for v0: full USPS address validation or legal/jurisdiction geocoding

## Why

Most US address forms ask for street, city, state, ZIP, then country. That ordering is wasteful: a valid US ZIP Code usually gives the form enough information to default city, state, and country. It does **not** uniquely identify a deliverable address, and it does **not** define legal jurisdiction. The product stance here is simple:

> ZIP-first should be a reversible default, not a trap.

Fill the likely postal defaults. Keep every field editable. Never pretend that a five-digit ZIP is a complete address.

## Install locally

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select this repository folder.
5. Visit a page with an address form and click the ZIP First extension button.

Use `test-page.html` as a fast local smoke test.

## What it does

- Adds a small ZIP First overlay only after the extension button is clicked.
- Detects likely address forms using `autocomplete`, labels, names, IDs, placeholders, and nearby text.
- Accepts `94110` or `94110-1234`; v0 uses the leading five digits for lookup.
- Fills city, state, country, and ZIP if matching controls are found.
- Highlights detected fields so the user can inspect what happened.
- Leaves all fields editable.
- Focuses the street field after lookup when it can find one.

## What it does not do yet

- No official USPS City State Product ingestion.
- No CASS / ZIP+4 / delivery point validation.
- No carrier-specific validation for UPS/FedEx/DHL.
- No legal/tax/voting jurisdiction lookup.
- No street-address autocomplete scoped to ZIP.
- No site-specific adapters for heavily customized React/select widgets.
- No international country-profile execution yet.

## Documentation map

- [`docs/research/us-usps.md`](docs/research/us-usps.md) — US claims, USPS docs, edge cases.
- [`docs/research/web-platform.md`](docs/research/web-platform.md) — HTML autocomplete/inputmode and extension surface.
- [`docs/international/address-profile-schema.md`](docs/international/address-profile-schema.md) — how to generalize beyond the US.
- [`docs/inspiration/`](docs/inspiration/) — vision, comparables, alternatives, ranking criteria, sister projects.
- [`docs/implementation/architecture.md`](docs/implementation/architecture.md) — how the extension works.
- [`docs/implementation/test-plan.md`](docs/implementation/test-plan.md) — how to judge whether it works.

## First-roadmap sketch

1. Make v0 robust on ordinary ecommerce checkout pages.
2. Add screenshot/video demo for README and extension store listing.
3. Add a provider interface and cache freshness metadata.
4. Add official-ish US ZIP data ingestion path or pluggable commercial providers.
5. Add country profiles for Canada, UK, Germany, Japan, France, India, Australia.
6. Build a benchmark corpus of real-world forms and score implementations.
7. Create a bookmarklet/userscript variant for people who do not want an extension.
8. Publish a micro-library for sites that want to implement ZIP-first natively.

## Attribution

Initial scaffold and documentation were created by ChatGPT in collaboration with Loren McIntyre. See [`AUTHORS.md`](AUTHORS.md).

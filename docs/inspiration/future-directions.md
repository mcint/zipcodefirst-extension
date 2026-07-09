# Future directions

## Near-term

- Package extension for Chrome Web Store.
- Test Firefox/WebExtension compatibility.
- Add a 30-second demo GIF/video.
- Add browser-extension icons.
- Improve field detection against shadow DOM and common checkout frameworks.
- Add manual field mapping UI: “this is ZIP / this is city / this is state.”
- Add temporary per-site memory for field mappings.
- Add no-network/offline ZIP prefix demo dataset for common ZIPs.

## Data/provider layer

- Provider interface with `lookup(country, postalCode)`.
- Provider freshness metadata.
- Cache with TTL.
- Optional user-selectable provider.
- USPS AIS / CASS provider path.
- Commercial provider adapters: Smarty, Shippo, EasyPost, Loqate, Google Places, Mapbox.

## Product variants

- Browser extension.
- Bookmarklet.
- Userscript.
- Native JS library for websites.
- React/Vue/Svelte components.
- Browser devtools audit: “your address form is hostile.”
- Wall of shame / wall of fame submission flow.

## Internationalization

- Country profiles.
- Postal-code label localization.
- Country-specific validation patterns.
- Country-specific field order.
- Multiple scripts/languages.
- Countries without postal codes.
- Countries where postcode identifies a premise vs area vs route.

## Bigger vision

- Address form linting as a public good.
- A benchmark corpus for address UX.
- A tiny badge/spec: “ZIP-first compatible,” “autofill-compatible,” “country-profiled address form.”
- Shared fixtures for browser vendors and checkout libraries.
- Push fixes upstream into payment/address form components.

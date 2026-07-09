# Architecture

## Repository structure

```text
README.md                       # project hub
extensions/browser/             # browser extension reference implementation
  manifest.json
  src/background.js             # toolbar click, script injection, ZIP lookup cache
  src/content.js                # overlay UI, form detection, fill logic
  src/content.css               # overlay and field highlight styles
library/                        # tiny embeddable JS helper
examples/                       # native ZIP-first interface examples
site/                           # GitHub Pages / public project site draft
docs/                           # research and implementation notes
```

## Extension activation

The extension does nothing until the user clicks the toolbar button.

On click:

1. Background checks that the current tab is `http` or `https`.
2. CSS is inserted.
3. Content JS is inserted.
4. Content JS shows the overlay and detects address forms.

## Lookup

Content script sends `{ type: "zipfirst:lookupZip", zip }` to the background worker.

Background worker:

1. extracts the leading five-digit ZIP;
2. checks in-memory cache;
3. checks extension `storage.local` cache;
4. fetches `https://api.zippopotam.us/us/{zip}` on miss;
5. normalizes places to `{ city, state, stateCode, country, countryCode }`;
6. caches and returns the lookup result.

## Field detection

Detection weights:

- fields inside the extension overlay are ignored;
- `autocomplete` tokens first;
- then `name`, `id`, `placeholder`, `aria-label`, `data-testid`, `data-field`, `data-name`, class names;
- then explicit `<label for>` and enclosing `<label>` text;
- camelCase field names are normalized.

The extension scores candidate roots and prefers roots with a ZIP field plus other address fields. If no strong form root exists, it still tries a loose page-wide field match.

## Fill behavior

The content script sets field values using the native input value setter where possible, then dispatches bubbling `input` and `change` events. This is more compatible with controlled UI frameworks.

All fields stay editable.

## Library behavior

The library exposes `ZipFirst.enhance(formOrSelector, options)`. It detects address fields within a native form, listens to the postal-code field, performs lookup, fills defaults, and focuses the street-address field.

## Privacy posture

V0 sends only the ZIP/postal code to the lookup provider. It does not send the street address, user name, email, phone, cart, or page contents.

## Known brittle areas

- Shadow DOM.
- Cross-origin iframes.
- React custom dropdowns.
- Sites that intentionally block automation.
- Pages with multiple shipping/billing forms.
- Sites where state/country values are internal IDs rather than abbreviations or names.

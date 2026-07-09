# Architecture

## V0 structure

```text
manifest.json
src/background.js      # toolbar click, script injection, ZIP lookup cache
src/content.js         # overlay UI, form detection, fill logic
src/content.css        # overlay and field highlight styles
test-page.html         # smoke-test form
```

## Activation

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
2. checks an in-memory cache;
3. fetches `https://api.zippopotam.us/us/{zip}`;
4. normalizes places to `{ city, state, stateCode, country, countryCode }`;
5. returns the lookup result.

## Field detection

Detection weights:

- `autocomplete` tokens first;
- then `name`, `id`, `placeholder`, `aria-label`, `data-testid`, class names;
- then explicit `<label for>` and enclosing `<label>` text.

The extension scores candidate roots and prefers roots with a ZIP field plus other address fields.

## Fill behavior

The content script sets field values and dispatches bubbling `input` and `change` events. That makes basic controlled UI frameworks less sad.

All fields stay editable.

## Privacy posture

V0 sends only the ZIP/postal code to the lookup provider. It does not send the street address, user name, email, phone, cart, or page contents.

## Known brittle areas

- Shadow DOM.
- Cross-origin iframes.
- React custom dropdowns.
- Sites that intentionally block automation.
- Pages with multiple shipping/billing forms.
- Sites where state/country values are internal IDs rather than abbreviations or names.

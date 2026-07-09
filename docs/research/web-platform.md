# Web platform research

## HTML autocomplete tokens

The extension should cooperate with browser autofill rather than fight it.

Relevant autocomplete detail tokens:

- `postal-code` — ZIP/postal code
- `address-line1`, `address-line2`, `address-line3` — street lines
- `street-address` — multiline street address
- `address-level1` — first administrative level; US state
- `address-level2` — second administrative level; usually city/locality
- `country` — country/territory code
- `country-name` — country/territory name
- Optional grouping: `shipping postal-code`, `billing postal-code`
- Optional sectioning: `section-checkout shipping postal-code`

MDN reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/autocomplete
WHATWG reference: https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill

## Keyboard hints

For US ZIP fields, use `inputmode="numeric"` so mobile browsers can show a numeric keyboard without changing the semantic type to `number`.

MDN reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/inputmode

## Extension activation model

V0 uses Chrome Manifest V3:

- `action` toolbar click for explicit activation.
- `activeTab` so the extension can run on the clicked tab without broad host access.
- `scripting` to inject content JS/CSS when activated.
- Background service worker for lookup fetches, keeping page CSP/CORS weirdness away from the content script.

Chrome docs:

- Action API: https://developer.chrome.com/docs/extensions/reference/api/action
- Scripting API: https://developer.chrome.com/docs/extensions/reference/api/scripting
- activeTab permission: https://developer.chrome.com/docs/extensions/develop/concepts/activeTab

## Form-hostility notes

Modern checkout forms are often hostile to naive DOM writes:

- controlled React inputs require `input` and `change` events;
- custom selects may not be native `<select>` elements;
- iframes may contain the real payment/address form;
- shadow DOM can hide fields;
- hosted payment pages may block extension injection;
- country/state dropdowns may have values, names, abbreviations, or internal IDs.

V0 fires bubbling `input` and `change` events after setting values. V1 should add adapters and a test corpus.

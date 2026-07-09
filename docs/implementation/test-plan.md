# Test plan

## Local smoke test

1. Load the extension unpacked from `extensions/browser/`.
2. Open `examples/basic-zip-first.html` in Chrome.
3. Click the ZIP First extension button.
4. Enter `94110` in the extension overlay.
5. Confirm:
   - ZIP is filled into the page postal-code field;
   - city is filled;
   - state is filled;
   - country is filled;
   - street address field remains editable;
   - detected fields are highlighted;
   - no field is locked.

## Library smoke test

1. Open `examples/library-demo.html`.
2. Enter `94110` into the postal-code field.
3. Confirm city/state/country fill and street address receives focus.

## Edge ZIPs to test

- `94110` — ordinary city/state fill.
- `10001` — dense urban ZIP.
- `00501` — leading zero ZIP.
- `20500` — special/federal-ish ZIP.
- unknown five-digit ZIP — graceful error.
- `94110-1234` — ZIP+4 accepted but v0 uses leading five.

## Form fixtures to add

- Semantic HTML with correct autocomplete tokens.
- Weakly labeled legacy form.
- Native select dropdowns for state and country.
- React controlled inputs.
- Custom combobox/select widgets.
- Shadow DOM.
- Shipping plus billing forms.
- Iframe checkout.
- International country-first form.

## Success metrics

- Keystrokes saved.
- Time to valid street-address focus.
- Correct field detection rate.
- Wrong-field overwrite rate.
- Percentage of fills requiring user correction.
- Failure clarity.
- Accessibility regressions.

## Non-regression rule

A failed lookup must leave the page as usable as before. No traps. No locked fields. No page-wide mutation beyond the overlay and optional highlights.

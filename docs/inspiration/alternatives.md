# Alternatives

## 1. Do nothing; trust browser autofill

Strong baseline. Browser autofill can be better than ZIP-first because it may fill the whole address.

Why ZIP First still exists:

- many sites break autofill;
- many users do not have the relevant address saved;
- one-off shipping addresses exist;
- forms still need better native ordering and tokens.

## 2. Native website library

Best long-term path.

A tiny JS package could expose:

```js
zipFirst.enhance(form, {
  country: "US",
  provider: zipFirst.providers.zippopotamus()
})
```

The extension is a wedge/demo. The site library is the actual win.

## 3. Bookmarklet / userscript

Lower friction for hackers, worse for ordinary users.

Useful as:

- demo artifact;
- QA tool;
- no-store distribution escape hatch;
- Greasemonkey/Tampermonkey variant.

## 4. Commercial validation provider

Best for businesses that need deliverability guarantees, CASS, fraud reduction, taxation, or carrier-grade validation.

Downside: heavy, paid, and often overkill for the tiny UX improvement.

## 5. Full address autocomplete

Google Places, Mapbox, Smarty, Loqate, Shippo, EasyPost, etc.

Great when the user is entering a real deliverable destination and the site can accept provider cost/privacy tradeoffs. Not great as the only answer to “why is ZIP still last?”

## 6. AI address parser

Useful for pasted/freeform addresses. Wrong primitive for ordinary structured forms where the browser already knows each field.

# ZIP First library

Tiny embeddable JS helper for sites that want ZIP-first address behavior natively.

## CDN use

```html
<script src="https://cdn.jsdelivr.net/gh/mcint/zipcodefirst-extension@main/library/zipfirst.js"></script>
<script>
  ZipFirst.enhance(document.querySelector("form"));
</script>
```

## API sketch

```js
const controller = ZipFirst.enhance(form, {
  country: "US",
  lookup: ZipFirst.lookupZippopotamus,
  onFill({ fields, result, place }) {},
  onError(error) {}
});
```

The default provider currently supports US ZIP lookup through Zippopotam.us. Production sites should choose their own provider and data policy.

## HTML expectations

Use browser-native address tokens:

```html
<input autocomplete="postal-code" inputmode="numeric">
<input autocomplete="address-level2">
<select autocomplete="address-level1"></select>
<select autocomplete="country"></select>
<input autocomplete="address-line1">
```

The library is MIT licensed so people can copy it, vendor it, or just steal the interaction pattern. That is the point.

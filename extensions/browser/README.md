# ZIP First browser extension

Reference browser-extension implementation for ZIP-first address form assistance.

## Install locally

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select this `extensions/browser/` directory.
5. Click the ZIP First toolbar button on a page with an address form.

## Design goals

- Runs only after explicit toolbar activation.
- Uses least-privilege permissions.
- Sends only the ZIP/postal code to the lookup provider.
- Fills postal defaults; does not lock fields.
- Shares the WebExtension-ish core shape so Firefox support stays plausible.

## Current provider

`https://api.zippopotam.us/us/{zip}`

This is good enough for a prototype. It is not official USPS data.

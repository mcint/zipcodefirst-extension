# Sister project inspirations

## Address UX linter

A CLI/browser audit that checks a page for:

- postal code buried after city/state;
- missing `autocomplete` tokens;
- wrong keyboard hints;
- hostile country dropdowns;
- non-editable inferred fields;
- form reset on back navigation.

## Wall of shame / wall of fame

A public gallery of address forms:

- screenshots;
- measured keystrokes;
- mobile keyboard behavior;
- autofill compatibility;
- ZIP-first compatibility;
- remediation suggestions.

## Native form library

A tiny package for site owners:

- plain JS enhancer;
- React/Vue/Svelte wrappers;
- provider adapters;
- country profiles;
- browser-autofill-first defaults.

## Address benchmark corpus

Fixture set for testing address-form automation:

- static HTML;
- React controlled forms;
- custom selects;
- shadow DOM;
- international forms;
- multiple shipping/billing addresses;
- edge ZIPs.

## Postal-code knowledge base

Machine-readable notes about postal-code semantics by country:

- pattern;
- requiredness;
- what postal code can infer;
- whether postal code is written before/after locality;
- official data source;
- caveats;
- examples.

## “Paste address” companion

A sibling feature for the opposite flow: user pastes a freeform address, extension parses and fills fields. Could use libpostal or provider APIs. ZIP-first then becomes an ambiguity resolver.

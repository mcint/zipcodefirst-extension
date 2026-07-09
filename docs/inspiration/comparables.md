# Comparables

## Browser autofill

Baseline competitor. Often better than any extension when it works. ZIP First should cooperate with browser autofill, not fight it.

## Existing address extensions

Comparable categories:

- form fillers;
- checkout helpers;
- password-manager identity/profile autofill;
- coupon/commerce extensions that already inject checkout UI;
- accessibility helpers that annotate forms.

The difference: ZIP First is not trying to own the whole profile. It is a tiny reversible postal-default layer.

## Address APIs and services

### Zippopotam.us

Free postal-code lookup API. Good for prototypes. Not official USPS truth.

### USPS ZIP Lookup and AIS products

Official USPS lookup UI and data products. Useful for authoritative direction; not all data is free/open/easy.

### Smarty

Commercial address autocomplete/validation APIs. Useful as a production-grade alternative and benchmark.

### Google Places Autocomplete

Powerful autocomplete product, but heavy and not aligned with “tiny local reversible default” as a default dependency.

## Open-source geography/address infrastructure

### libpostal

C library for parsing and normalizing street addresses worldwide using statistical NLP and open geo data.

### OpenCage address-formatting

Country-specific templates for formatting geographic addresses.

### OpenAddresses

Open address data aggregator. Useful for research and maybe future test fixtures.

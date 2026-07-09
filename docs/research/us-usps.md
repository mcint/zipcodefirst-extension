# US research: ZIP-first, USPS, and the useful lie

## Core claim

The motivating claim from `zipcodefirst.com` is that a five-digit US ZIP Code can often determine city, state, and country, letting a form fill three fields from one short numeric input.

That is directionally right for form UX and dangerously wrong if oversold.

Correct formulation:

> A US ZIP Code is a high-value postal default for city/state/country. It is not a complete address, not a legal jurisdiction, and not always a unique city name.

## USPS-related sources to track

- ZIP Code First essay: https://zipcodefirst.com/
- Hacker News discussion: https://news.ycombinator.com/item?id=47292485
- USPS Publication 28, Postal Addressing Standards: https://pe.usps.com/text/pub28/welcome.htm
- USPS Publication 28, standardization / ZIP+4 and City State files: https://pe.usps.com/text/pub28/28c2_001.htm
- USPS City State Product: https://postalpro.usps.com/address-quality/city-state-product
- USPS ZIP lookup: https://tools.usps.com/zip-code-lookup.htm
- USPS ZIP Locale Detail Product, mentioned in HN thread: https://postalpro.usps.com/ZIP_Locale_Detail
- USPS Area District 5-Digit ZIP Product, mentioned in HN thread: https://postalpro.usps.com/areadist_ZIP5

## What USPS appears to optimize for

USPS delivery addresses are postal routing artifacts first, civic geography second. The `city state ZIP` last line is about mail routing and address validation, not necessarily about municipal incorporation, tax district, school district, voting district, or legal residence.

USPS Publication 28 says address output should be standardized and that the Delivery Address Line and Last Line should be validated with ZIP+4 and City State files. The City State Product is an AIS product for city/state/5-digit ZIP validation and includes city, county, and Post Office names associated with ZIP Codes.

## Edge cases

- A ZIP can have one preferred city and multiple acceptable city names.
- A postal city can differ from the municipality a person thinks they live in.
- Some ZIPs cover unincorporated areas.
- Rare ZIPs have state-boundary oddities.
- Military, diplomatic, PO Box, unique/special-use, and non-geographic ZIPs need care.
- ZIP+4 narrows further, but ordinary people often do not know their ZIP+4.

## UX rule

Fill defaults. Show confidence. Leave edits cheap.

Bad behavior:

- Locking city/state after ZIP entry.
- Treating ZIP as legal jurisdiction.
- Replacing browser autofill instead of cooperating with it.
- Hiding country in global forms before knowing the country.

Good behavior:

- Put country first or infer it when global scope matters.
- Ask postal code early where a country profile says that helps.
- Use `autocomplete="postal-code"`, `address-level1`, `address-level2`, `country`, and `address-line1`.
- Use `inputmode="numeric"` for US ZIP fields.
- If multiple cities are returned, render a dropdown but preserve free edit.

## Production data path

V0 can use Zippopotam.us to prove UX.

Production-grade US paths probably need one of:

1. Licensed USPS AIS data, especially City State Product and ZIP+4-related files.
2. A CASS-certified commercial provider.
3. A cached open data approximation plus explicit disclaimers.
4. Hybrid: fast ZIP default from open data, then optional address validation provider after street entry.

## Claim ladder for README / docs

Safe:

- “ZIP-first reduces typing in many US forms.”
- “A US ZIP can provide useful city/state/country defaults.”
- “Fields remain editable because edge cases exist.”

Risky:

- “A ZIP determines your city/state.”
- “A ZIP determines legal jurisdiction.”
- “A ZIP-first form validates an address.”

False / no:

- “A five-digit ZIP uniquely identifies a deliverable address.”

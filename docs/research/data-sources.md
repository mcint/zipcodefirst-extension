# ZIP/postal-code data sources

## Current prototype

Zippopotam.us is used for v0 because it is simple JSON and good enough for a UX prototype.

## Production-grade US possibilities

- USPS City State Product / AIS data.
- CASS-certified commercial providers.
- Commercial address APIs such as Smarty, Loqate, Shippo, EasyPost, Google Places, or Mapbox.
- Open-data approximation with explicit caveats.

## Local/offline cache

The extension now caches looked-up ZIP results in extension local storage with a TTL. This is reasonable because:

- lookup happens only after invocation or ZIP entry;
- the key is only a ZIP, not a full address;
- repeated entry gets faster and more private after first lookup.

## Datasette / SQLite path

A small ZIP lookup table is a great fit for SQLite + Datasette or a static JSON/CSV artifact.

Possible path:

1. Acquire a ZIP-to-place dataset with license compatible with the repo/distribution goals.
2. Normalize to `country_code, postal_code, place_name, admin1_name, admin1_code, source, updated_at`.
3. Build a tiny SQLite database.
4. Export JSON for extension bundling or serve via Datasette for demos.
5. Keep source/freshness metadata visible.

I searched for a specific Simon Willison ZIP dataset reference and did not find a canonical current link. Still worth asking/searching later; the Datasette-shaped implementation is exactly right even if the data source comes from elsewhere.

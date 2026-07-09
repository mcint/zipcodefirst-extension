# International address profile schema

Global postal-code-first cannot be one rule. It must be a country-profile system.

UPU S42 / ISO 19160-style thinking is the right long-term frame: generic address components, rendered and validated through country-specific templates and rules.

UPU Addressing Solutions: https://www.upu.int/en/Postal-Solutions/Programmes-Services/Addressing-Solutions

## Type sketch

```ts
type CountryAddressProfile = {
  countryCode: string;              // ISO 3166-1 alpha-2
  countryName: string;
  postalCodeName: string;           // ZIP, postcode, PIN, postal code, etc.
  postalCodeRequired: boolean;
  postalCodePosition: "first" | "before-locality" | "after-locality" | "none" | "varies";
  postalCodePattern?: string;
  postalCodeExamples: string[];
  canInfer: {
    country: "always" | "usually" | "sometimes" | "never";
    adminArea: "always" | "usually" | "sometimes" | "never";
    locality: "always" | "usually" | "sometimes" | "never";
    streetScope: "always" | "usually" | "sometimes" | "never";
  };
  fields: AddressField[];
  renderTemplate: string[];         // mailing-label line order
  dataProviders: PostalLookupProviderSpec[];
  caveats: string[];
};

type AddressField = {
  key:
    | "recipient"
    | "organization"
    | "country"
    | "postalCode"
    | "adminArea"
    | "locality"
    | "dependentLocality"
    | "street1"
    | "street2";
  required: boolean;
  autocomplete?: string;
  labels: string[];
};

type PostalLookupProviderSpec = {
  name: string;
  sourceUrl: string;
  license?: string;
  freshness?: string;
  offlineCapable: boolean;
};
```

## Country-first vs postal-code-first

Universal global flow should usually be:

1. Country, often inferred or defaulted but editable.
2. Postal code early if the country profile says it helps.
3. Locality/admin defaults from postal lookup where supported.
4. Street address last, with autocomplete scoped by country/postal locality where possible.

The US-optimized flow can be ZIP-first because the extension knows it is using a US profile. A global website should either ask country first or make country inference explicit.

## Initial country candidates

- US: ZIP strongly defaults city/state/country; edge cases exist.
- CA: postal code prefix can strongly narrow geography; full postal code is alphanumeric and space-sensitive.
- UK: postcode can be very precise; address selection is often postcode-first.
- IE: Eircode can identify individual premises; very different semantics.
- JP: postal code commonly fills prefecture/city/locality.
- DE/FR: postal code strongly helps but may map multiple localities.
- IN: PIN code gives useful area/post-office defaults, not full address.
- AU: postcode plus state/locality helps but is not unique.

## Rule of thumb

The project is not “force ZIP-first everywhere.”

It is “make address forms respect the most informative low-friction field available in each country.”

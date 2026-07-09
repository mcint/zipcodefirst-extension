/*!
 * ZIP First
 * MIT License
 *
 * Tiny postal-code-first address form helper.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.ZipFirst = factory();
})(typeof globalThis !== "undefined" ? globalThis : window, function () {
  const DEFAULT_COUNTRY = "US";
  const FIELD_SELECTOR = "input,select,textarea";

  const TOKENS = {
    postalCode: ["postal-code", "postalcode", "postal", "postcode", "post-code", "zip", "zipcode", "zip-code", "postal_code", "zip_code"],
    locality: ["address-level2", "addresslevel2", "city", "locality", "town"],
    adminArea: ["address-level1", "addresslevel1", "state", "province", "region"],
    country: ["country", "country-name", "countryname"],
    street1: ["address-line1", "addressline1", "address1", "addr1", "street", "street-address", "line1"]
  };

  function enhance(target, options = {}) {
    const root = typeof target === "string" ? document.querySelector(target) : target;
    if (!root) throw new Error("ZipFirst.enhance target not found");

    const config = {
      country: DEFAULT_COUNTRY,
      lookup: lookupZippopotamus,
      onFill: null,
      onError: null,
      ...options
    };

    const fields = detectFields(root);
    if (!fields.postalCode) throw new Error("ZipFirst could not find a postal-code field");

    fields.postalCode.setAttribute("inputmode", fields.postalCode.getAttribute("inputmode") || "numeric");
    fields.postalCode.addEventListener("input", debounce(async () => {
      const postalCode = extractUSZip(fields.postalCode.value);
      if (!postalCode) return;

      try {
        const result = await config.lookup({ country: config.country, postalCode });
        const place = result.places?.[0];
        if (!place) return;
        fill(fields, result.postalCode || postalCode, place);
        config.onFill?.({ fields, result, place });
      } catch (error) {
        config.onError?.(error);
      }
    }, 250));

    return { root, fields, refresh: () => Object.assign(fields, detectFields(root)) };
  }

  function detectFields(root) {
    return Object.fromEntries(Object.keys(TOKENS).map((key) => [key, field(root, key)]));
  }

  function field(root, kind) {
    let best = null, bestScore = 0;
    for (const el of [...root.querySelectorAll?.(FIELD_SELECTOR) || []]) {
      if (el.disabled || el.readOnly || el.type === "hidden" || hidden(el)) continue;
      const hay = fieldText(el);
      const autocomplete = tokens(el.getAttribute("autocomplete"));
      let score = TOKENS[kind].reduce((s, token) => s + (hay.includes(token) ? 2 : 0), 0);

      if (kind === "postalCode" && autocomplete.includes("postal-code")) score += 16;
      if (kind === "locality" && autocomplete.includes("address-level2")) score += 12;
      if (kind === "adminArea" && autocomplete.includes("address-level1")) score += 12;
      if (kind === "country" && (autocomplete.includes("country") || autocomplete.includes("country-name"))) score += 12;
      if (kind === "street1" && autocomplete.includes("address-line1")) score += 12;

      if (score > bestScore) [best, bestScore] = [el, score];
    }
    return best;
  }

  async function lookupZippopotamus({ country = DEFAULT_COUNTRY, postalCode }) {
    if (country !== "US") throw new Error("Default provider currently supports US only");
    const zip = extractUSZip(postalCode);
    const response = await fetch(`https://api.zippopotam.us/us/${zip}`, {
      headers: { accept: "application/json" }
    });
    if (!response.ok) throw new Error(`Postal lookup failed: HTTP ${response.status}`);

    const data = await response.json();
    return {
      country: "United States",
      countryCode: "US",
      postalCode: zip,
      provider: "zippopotam.us",
      places: (data.places || []).map((place) => ({
        locality: place["place name"],
        adminArea: place.state,
        adminAreaCode: place["state abbreviation"],
        country: data.country || "United States",
        countryCode: data["country abbreviation"] || "US"
      }))
    };
  }

  function fill(fields, postalCode, place) {
    set(fields.postalCode, postalCode);
    set(fields.locality, place.locality);
    if (!set(fields.adminArea, place.adminAreaCode)) set(fields.adminArea, place.adminArea);
    if (!set(fields.country, place.countryCode || "US")) set(fields.country, place.country || "United States");
    fields.street1?.focus();
  }

  function set(el, value) {
    if (!el || value == null) return false;
    if (el.tagName === "SELECT") return setSelect(el, value);
    const old = el.value;
    setInputValue(el, value);
    if (old !== el.value) fire(el);
    return true;
  }

  function setInputValue(el, value) {
    const proto = el.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(proto, "value")?.set;
    if (setter) setter.call(el, String(value));
    else el.value = String(value);
  }

  function setSelect(sel, value) {
    const n = norm(value);
    const aliases = new Set(["us", "usa", "unitedstates", "unitedstatesofamerica"]);
    const hit = [...sel.options].find((o) => norm(o.value) === n || norm(o.text) === n)
      || (aliases.has(n) && [...sel.options].find((o) => aliases.has(norm(o.value)) || aliases.has(norm(o.text))))
      || [...sel.options].find((o) => norm(o.text).includes(n));
    if (!hit) return false;
    const old = sel.value;
    sel.value = hit.value;
    if (old !== sel.value) fire(sel);
    return true;
  }

  function fieldText(el) {
    const label = el.id ? document.querySelector(`label[for="${CSS.escape(el.id)}"]`)?.innerText : "";
    return String([
      el.name,
      el.id,
      el.autocomplete,
      el.placeholder,
      el.getAttribute("aria-label"),
      el.getAttribute("data-testid"),
      el.getAttribute("data-field"),
      el.className,
      label,
      el.closest("label")?.innerText
    ].filter(Boolean).join(" "))
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      .toLowerCase()
      .replace(/[_\s]+/g, "-");
  }

  function hidden(el) {
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    return (rect.width === 0 && rect.height === 0) || style.visibility === "hidden" || style.display === "none";
  }

  function tokens(value) {
    return String(value || "").toLowerCase().split(/\s+/).filter(Boolean);
  }

  function extractUSZip(value) {
    return String(value || "").match(/\b(\d{5})(?:-?\d{4})?\b/)?.[1] || "";
  }

  function fire(el) {
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function norm(value) {
    return String(value || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  }

  function debounce(fn, ms) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
  }

  return { enhance, detectFields, lookupZippopotamus };
});

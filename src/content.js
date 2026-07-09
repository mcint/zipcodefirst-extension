(() => {
  if (window.__zipFirst?.activate) return window.__zipFirst.activate();

  const TOKENS = {
    zip: ["postal-code", "postcode", "postal", "zip", "zipcode", "zip-code"],
    city: ["address-level2", "city", "locality", "town"],
    state: ["address-level1", "state", "province", "region"],
    country: ["country", "country-name"],
    street1: ["address-line1", "address1", "addr1", "street", "line1"]
  };
  let activeForm = null;
  let lastLookup = null;

  window.__zipFirst = { activate };
  chrome.runtime.onMessage.addListener((m) => { if (m?.type === "zipfirst:activate") activate(); });
  activate();

  function activate() {
    const p = ensurePanel();
    p.hidden = false;
    const fs = detectForms();
    activeForm = fs[0] || { root: document, fields: {} };
    wireZipFields(fs);
    highlight(activeForm.fields);
    setStatus(fs.length ? `Found ${fs.length} likely address form${fs.length === 1 ? "" : "s"}.` : "No obvious address form found; I’ll still try matching fields.");
  }

  function ensurePanel() {
    let p = document.getElementById("zipfirst-panel");
    if (p) return p;
    p = document.createElement("section");
    p.id = "zipfirst-panel";
    p.setAttribute("role", "dialog");
    p.setAttribute("aria-label", "ZIP First");
    p.innerHTML = `
      <button class="zipfirst-close" aria-label="Close">×</button>
      <strong>ZIP First</strong>
      <div class="zipfirst-row"><div>
        <label for="zipfirst-zip">ZIP / ZIP+4</label>
        <input id="zipfirst-zip" inputmode="numeric" autocomplete="postal-code" placeholder="94110 or 94110-1234" maxlength="10" />
      </div><button id="zipfirst-apply">Fill</button></div>
      <label for="zipfirst-place" id="zipfirst-place-label" hidden>City</label>
      <select id="zipfirst-place" hidden></select>
      <button id="zipfirst-focus-street" hidden>Focus street address</button>
      <div class="zipfirst-status" aria-live="polite"></div>
      <div class="zipfirst-muted">Fields stay editable. Runs only after clicking the extension.</div>`;
    document.documentElement.appendChild(p);

    const zip = p.querySelector("#zipfirst-zip");
    p.querySelector(".zipfirst-close").onclick = () => { p.hidden = true; clearHighlights(); };
    p.querySelector("#zipfirst-apply").onclick = () => lookupAndFill(zip.value);
    zip.addEventListener("input", debounce(() => extractZip(zip.value) && lookupAndFill(zip.value), 250));
    p.querySelector("#zipfirst-place").onchange = (e) => {
      if (lastLookup) fill(activeForm, lastLookup.places[Number(e.target.value) || 0], lastLookup.zip);
    };
    p.querySelector("#zipfirst-focus-street").onclick = () => field(activeForm?.root || document, "street1")?.focus();
    return p;
  }

  function detectForms() {
    const roots = [document, ...document.querySelectorAll("form, [data-testid], [class], [id]")]
      .filter((r) => r.querySelector?.("input,select,textarea"));
    const found = roots.map((root) => {
      const fields = Object.fromEntries(Object.keys(TOKENS).map((k) => [k, field(root, k)]));
      const score = Object.entries(fields).reduce((s, [k, el]) => s + (el ? (k === "zip" ? 4 : 2) : 0), 0);
      return { root, fields, score };
    }).filter((f) => f.fields.zip && f.score >= 6).sort((a, b) => b.score - a.score);
    return found.filter((f, i) => !found.slice(0, i).some((g) => g.root.contains(f.root))).slice(0, 8);
  }

  function field(root, kind) {
    let best = null, bestScore = 0;
    for (const el of [...root.querySelectorAll?.("input,select,textarea") || []]) {
      if (el.disabled || el.readOnly || el.type === "hidden" || !el.offsetParent) continue;
      const hay = fieldText(el);
      let score = TOKENS[kind].reduce((s, t) => s + (hay.includes(t) ? 2 : 0), 0);
      if (kind === "zip" && el.autocomplete === "postal-code") score += 8;
      if (kind === "city" && el.autocomplete === "address-level2") score += 8;
      if (kind === "state" && el.autocomplete === "address-level1") score += 8;
      if (kind === "country" && ["country", "country-name"].includes(el.autocomplete)) score += 8;
      if (score > bestScore) [best, bestScore] = [el, score];
    }
    return best;
  }

  function fieldText(el) {
    const label = el.id ? document.querySelector(`label[for="${CSS.escape(el.id)}"]`)?.innerText : "";
    return [el.name, el.id, el.autocomplete, el.placeholder, el.getAttribute("aria-label"), el.getAttribute("data-testid"), el.className, label, el.closest("label")?.innerText]
      .filter(Boolean).join(" ").toLowerCase().replace(/[_\s]+/g, "-");
  }

  function wireZipFields(forms) {
    for (const f of forms) {
      const z = f.fields.zip;
      if (!z || z.dataset.zipfirstWired) continue;
      z.dataset.zipfirstWired = "1";
      z.setAttribute("inputmode", "numeric");
      z.addEventListener("input", debounce(() => {
        if (!extractZip(z.value)) return;
        activeForm = f;
        document.getElementById("zipfirst-zip").value = z.value;
        lookupAndFill(z.value, f);
      }, 250));
    }
  }

  async function lookupAndFill(raw, preferred = activeForm) {
    const zip = extractZip(raw);
    if (!zip) return setStatus("Enter a 5-digit ZIP or ZIP+4.");
    setStatus(`Looking up ${zip}…`);
    let r;
    try { r = await chrome.runtime.sendMessage({ type: "zipfirst:lookupZip", zip }); }
    catch (e) { return setStatus(e?.message || "ZIP lookup failed."); }
    if (!r?.ok) return setStatus(r?.error || "ZIP lookup failed.");
    lastLookup = r.result;
    activeForm = preferred || detectForms()[0] || { root: document, fields: {} };
    renderPlaces(r.result);
    fill(activeForm, r.result.places[0], r.result.zip);
  }

  function renderPlaces(result) {
    const s = document.getElementById("zipfirst-place");
    s.innerHTML = result.places.map((p, i) => `<option value="${i}">${p.city}, ${p.stateCode}</option>`).join("");
    s.hidden = document.getElementById("zipfirst-place-label").hidden = result.places.length < 2;
  }

  function fill(form, place, zip) {
    const root = form?.root || document;
    const fields = Object.fromEntries(Object.keys(TOKENS).map((k) => [k, form?.fields?.[k] || field(root, k)]));
    set(fields.zip, zip);
    set(fields.city, place.city);
    if (!set(fields.state, place.stateCode)) set(fields.state, place.state);
    if (!set(fields.country, place.countryCode || "US")) set(fields.country, "United States");
    highlight(fields);
    document.getElementById("zipfirst-focus-street").hidden = !fields.street1;
    setStatus(`Filled ${place.city}, ${place.stateCode}, United States. Check it; edge cases exist.`);
  }

  function set(el, value) {
    if (!el || value == null) return false;
    if (el.tagName === "SELECT") return setSelect(el, value);
    const old = el.value;
    el.value = value;
    if (old !== el.value) fire(el);
    return true;
  }

  function setSelect(sel, value) {
    const n = norm(value), aliases = new Set(["us", "usa", "unitedstates", "unitedstatesofamerica", "america"]);
    const opts = [...sel.options];
    const hit = opts.find((o) => norm(o.value) === n || norm(o.text) === n)
      || (aliases.has(n) && opts.find((o) => aliases.has(norm(o.value)) || aliases.has(norm(o.text))))
      || opts.find((o) => norm(o.text).includes(n));
    if (!hit) return false;
    const old = sel.value;
    sel.value = hit.value;
    if (old !== sel.value) fire(sel);
    return true;
  }

  function fire(el) { el.dispatchEvent(new Event("input", { bubbles: true })); el.dispatchEvent(new Event("change", { bubbles: true })); }
  function highlight(fields) { clearHighlights(); Object.values(fields || {}).filter(Boolean).forEach((el) => el.classList.add("zipfirst-highlight")); }
  function clearHighlights() { document.querySelectorAll(".zipfirst-highlight").forEach((el) => el.classList.remove("zipfirst-highlight")); }
  function setStatus(t) { const el = document.querySelector("#zipfirst-panel .zipfirst-status"); if (el) el.textContent = t; }
  function extractZip(v) { return String(v || "").match(/\b(\d{5})(?:-?\d{4})?\b/)?.[1] || ""; }
  function norm(v) { return String(v || "").toLowerCase().replace(/[^a-z0-9]/g, ""); }
  function debounce(fn, ms) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; }
})();

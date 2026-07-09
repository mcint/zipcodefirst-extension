const api = globalThis.browser || chrome;
const memoryCache = new Map();
const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000;

api.action.onClicked.addListener(async (tab) => {
  if (!tab?.id || !/^https?:\/\//.test(tab.url || "")) return;

  try {
    await api.scripting.insertCSS({
      target: { tabId: tab.id },
      files: ["src/content.css"]
    });
  } catch (_) {
    // CSS may already be inserted. Fine.
  }

  await api.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["src/content.js"]
  });

  try {
    await api.tabs.sendMessage(tab.id, { type: "zipfirst:activate" });
  } catch (_) {
    // Some pages reject messaging after injection; executeScript still ran.
  }
});

api.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== "zipfirst:lookupZip") return false;

  lookupUSZip(message.zip)
    .then((result) => sendResponse({ ok: true, result }))
    .catch((error) => sendResponse({ ok: false, error: error.message || String(error) }));

  return true;
});

async function lookupUSZip(rawZip) {
  const zip = String(rawZip || "").match(/\d{5}/)?.[0];
  if (!zip) throw new Error("Enter a 5-digit ZIP or ZIP+4.");

  const cached = await getCachedZip(zip);
  if (cached) return cached;

  const res = await fetch(`https://api.zippopotam.us/us/${zip}`, {
    headers: { "accept": "application/json" }
  });

  if (res.status === 404) throw new Error(`ZIP not found: ${zip}`);
  if (!res.ok) throw new Error(`Lookup failed: HTTP ${res.status}`);

  const data = await res.json();
  const places = Array.from(new Map((data.places || []).map((place) => {
    const normalized = {
      city: place["place name"],
      state: place.state,
      stateCode: place["state abbreviation"],
      country: data.country || "United States",
      countryCode: data["country abbreviation"] || "US",
      latitude: place.latitude,
      longitude: place.longitude,
      provider: "zippopotam.us"
    };
    return [`${normalized.city}|${normalized.stateCode}`, normalized];
  })).values());

  if (!places.length) throw new Error(`No places returned for ZIP: ${zip}`);

  const result = {
    zip,
    country: "United States",
    countryCode: "US",
    provider: "zippopotam.us",
    cachedAt: new Date().toISOString(),
    ttlDays: Math.round(CACHE_TTL_MS / (24 * 60 * 60 * 1000)),
    places
  };

  await setCachedZip(zip, result);
  return result;
}

async function getCachedZip(zip) {
  const fromMemory = memoryCache.get(zip);
  if (fromMemory && !isExpired(fromMemory.cachedAt)) return fromMemory;

  try {
    const key = cacheKey(zip);
    const stored = await api.storage.local.get(key);
    const value = stored?.[key];
    if (value && !isExpired(value.cachedAt)) {
      memoryCache.set(zip, value);
      return value;
    }
  } catch (_) {
    // Storage is an optimization, not a dependency.
  }

  return null;
}

async function setCachedZip(zip, result) {
  memoryCache.set(zip, result);
  try {
    await api.storage.local.set({ [cacheKey(zip)]: result });
  } catch (_) {
    // Fine; in-memory cache still works for this service-worker lifetime.
  }
}

function cacheKey(zip) {
  return `zipfirst:us:${zip}`;
}

function isExpired(cachedAt) {
  const t = Date.parse(cachedAt || "");
  return !t || Date.now() - t > CACHE_TTL_MS;
}

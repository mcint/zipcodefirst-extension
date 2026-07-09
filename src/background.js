const cache = new Map();

chrome.action.onClicked.addListener(async (tab) => {
  if (!tab?.id || !/^https?:\/\//.test(tab.url || "")) return;

  try {
    await chrome.scripting.insertCSS({
      target: { tabId: tab.id },
      files: ["src/content.css"]
    });
  } catch (_) {
    // CSS may already be inserted. Fine.
  }

  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["src/content.js"]
  });

  try {
    await chrome.tabs.sendMessage(tab.id, { type: "zipfirst:activate" });
  } catch (_) {
    // Some pages reject messaging after injection; executeScript still ran.
  }
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== "zipfirst:lookupZip") return false;

  lookupUSZip(message.zip)
    .then((result) => sendResponse({ ok: true, result }))
    .catch((error) => sendResponse({ ok: false, error: error.message || String(error) }));

  return true;
});

async function lookupUSZip(rawZip) {
  const zip = String(rawZip || "").match(/\d{5}/)?.[0];
  if (!zip) throw new Error("Enter a 5-digit ZIP or ZIP+4.");

  if (cache.has(zip)) return cache.get(zip);

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
    places
  };
  cache.set(zip, result);
  return result;
}

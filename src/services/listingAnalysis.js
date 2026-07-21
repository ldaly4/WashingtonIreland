export const LISTING_ANALYSIS_API_URL =
  globalThis.HOMEPATH_CONFIG?.LISTING_ANALYSIS_API_URL || "";

export async function analyseListingWithAdapter(data, fallback) {
  if (data.mode === "url") {
    return {
      source: "fallback",
      error: "A browser-only GitHub Pages site may not be able to read external listing pages because of CORS, anti-scraping protections or dynamic page content. Paste the listing text or enter the details manually.",
      result: fallback(data),
    };
  }
  if (!LISTING_ANALYSIS_API_URL) {
    return {
      source: "fallback",
      error: "AI listing analysis is not connected yet. The secure server-side endpoint is unavailable, so HomePath used the rules-based checker.",
      result: fallback(data),
    };
  }
  try {
    const response = await fetch(LISTING_ANALYSIS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jurisdiction: data.location?.toLowerCase().match(/belfast|derry|newry|lisburn|antrim|down|armagh|tyrone|fermanagh/) ? "NI" : "ROI",
        listingUrl: data.mode === "url" ? data.url : "",
        listingText: data.description || "",
        manualDetails: {
          askingPrice: Number(data.price) || null,
          location: data.location,
          bedrooms: Number(data.bedrooms) || null,
          propertyType: data.type,
          energyRating: data.energy,
        },
      }),
    });
    if (!response.ok) throw new Error("Listing analysis endpoint unavailable");
    const ai = await response.json();
    return { source: "ai", result: { ...fallback(data), ai } };
  } catch (error) {
    return { source: "fallback", error: error.message, result: fallback(data) };
  }
}

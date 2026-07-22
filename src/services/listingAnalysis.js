export const LISTING_ANALYSIS_API_URL =
  globalThis.HOMEPATH_CONFIG?.LISTING_ANALYSIS_API_URL || "";

export async function analyseListingWithAdapter(data, fallback) {
  if (!LISTING_ANALYSIS_API_URL) {
    return {
      source: "fallback",
      error: data.mode === "url" || data.mode === "address"
        ? "The secure listing service is temporarily unavailable, so HomePath used a basic checklist without reading the page."
        : "AI listing analysis is not connected yet. The secure server-side endpoint is unavailable, so HomePath used the rules-based checker.",
      result: fallback(data),
    };
  }
  try {
    const placeText = data.address || data.location || "";
    const response = await fetch(LISTING_ANALYSIS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jurisdiction: placeText.toLowerCase().match(/belfast|derry|londonderry|newry|lisburn|antrim|down|armagh|tyrone|fermanagh|bt[0-9]/) ? "NI" : "ROI",
        listingUrl: data.mode === "url" ? data.url : "",
        listingText: data.mode === "address" ? data.address : data.description || "",
        manualDetails: {
          askingPrice: Number(data.price) || null,
          location: data.location || data.address || "",
          bedrooms: Number(data.bedrooms) || null,
          propertyType: data.type,
          energyRating: data.energy,
          sourceMode: data.mode,
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

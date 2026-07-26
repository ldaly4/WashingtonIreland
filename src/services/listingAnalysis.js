export const LISTING_ANALYSIS_API_URL =
  globalThis.HOMEPATH_CONFIG?.LISTING_ANALYSIS_API_URL || "";

export async function analyseListingWithAdapter(data, fallback) {
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
        jurisdiction: data.jurisdiction === "ni" ? "NI" : "ROI",
        listingText: data.description || "",
        manualDetails: {
          askingPrice: Number(data.price) || null,
          location: data.location || "",
          bedrooms: Number(data.bedrooms) || null,
          propertyType: data.type,
          floorArea: data.floorArea,
          energyRating: data.energy,
          age: data.age,
          occupied: data.occupied,
          condition: data.condition,
          renovationGoal: data.work,
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

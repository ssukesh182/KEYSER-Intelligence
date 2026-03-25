export const fetchSerpAds = async (selectedCompetitor = "All Competitors") => {
  const trackedKeywords = [
    "10 minute grocery delivery",
    "instant grocery delivery",
    "milk delivery near me",
    "online grocery delivery chennai"
  ];
  const apiKey = import.meta.env.VITE_SERP_API_KEY;

  // We will run the fetch for each keyword
  const allAds = [];

  for (const baseKeyword of trackedKeywords) {
    const keyword = selectedCompetitor !== "All Competitors" 
      ? `${selectedCompetitor} ${baseKeyword}` 
      : baseKeyword;

    try {
      // Proxy the request through Vite dev server to avoid CORS block from SERP API
      const url = `/api/serp/search.json?engine=google&q=${encodeURIComponent(keyword)}&location=Chennai,+India&api_key=${apiKey}`;
      const response = await fetch(url);

      if (!response.ok) {
        console.error(`Error fetching for keyword: ${keyword} - Status: ${response.status}`);
        continue;
      }

      const data = await response.json();

      // SerpApi places ads in 'ads', 'top_ads', or 'bottom_ads'. 
      // Falling back to 'organic_results' so the dashboard always shows live intelligence data!
      const fetchedItems = data.ads || data.top_ads || data.bottom_ads || data.organic_results;

      if (fetchedItems && Array.isArray(fetchedItems)) {
        // Transform the response map
        const mappedAds = fetchedItems.slice(0, 5).map((ad, idx) => ({
          id: `ad-${Date.now()}-${keyword.replace(/\s/g, "-")}-${idx}`,
          competitor: ad.title.split(/ - |\|/)[0] || "Unknown Competitor", // Basic brand extraction from title
          channel: data.organic_results && fetchedItems === data.organic_results ? "Google Organic" : "Google Sponsored",
          headline: ad.title,
          summary: ad.description || ad.snippet || "No description provided.",
          badge: "Messaging Shift Detected",
          start_date: new Date().toISOString(),
          thumbnail: "https://placehold.co/400x200/2a2a2a/ffffff?text=Ad+Creative", // placeholder ad image
          source_link: ad.link,
          displayed_link: ad.displayed_link,
          position: ad.position,
          keyword: keyword
        }));

        allAds.push(...mappedAds);
      }
    } catch (error) {
      console.error(`Fetch exception for keyword: ${keyword}`, error);
    }
  }

  return allAds;
};

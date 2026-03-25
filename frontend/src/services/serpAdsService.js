export const fetchSerpAds = async (token) => {
  try {
    const response = await fetch('http://localhost:5001/api/ads', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("Failed to fetch ads");
    return await response.json();
  } catch (error) {
    console.error("Ads fetch error", error);
    return [];
  }
};

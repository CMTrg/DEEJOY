import axios from "axios";

let lastRequestTime = 0;

export const geocodeLocation = async (locationQuery) => {
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  const waitTime = Math.max(0, 1000 - elapsed); // 1 request per second

  if (waitTime > 0) {
    await new Promise((res) => setTimeout(res, waitTime));
  }

  try {
    const response = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        q: locationQuery,
        format: "json",
        limit: 1,
      },
      headers: {
        "User-Agent": `Deejoy/1.0 (${process.env.EMAIL_USER})`,
      },
    });

    lastRequestTime = Date.now();

    if (response.data.length > 0) {
      const { lat, lon } = response.data[0];
      return { lat: parseFloat(lat), lng: parseFloat(lon) };
    } else {
      return null;
    }
  } catch (err) {
    console.error("Nominatim error:", err);
    return null;
  }
};

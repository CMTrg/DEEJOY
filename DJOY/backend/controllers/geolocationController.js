import Geolocation from "../models/geolocationModel.js";
import { geocodeLocation } from "../utils/geocodeLocation.js";

export const getGeolocation = async (req, res) => {
  const location = req.query.q;

  if (!location || location.trim().length < 2) {
    return res.status(400).json({ error: "Invalid location input" });
  }

  const cleaned = location.trim().toLowerCase();

  try {
    const cached = await Geolocation.findOne({ input: cleaned });
    if (cached) {
      return res.json({ lat: cached.lat, lng: cached.lng, source: "cache" });
    }

    const result = await geocodeLocation(location);
    if (!result) {
      return res.status(404).json({ error: "Location not found" });
    }

    await Geolocation.create({
      input: cleaned,
      lat: result.lat,
      lng: result.lng,
    });

    res.json({ lat: result.lat, lng: result.lng, source: "nominatim" });
  } catch (err) {
    console.error("Geolocation error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

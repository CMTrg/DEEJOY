import Destination from "../models/destinationModel.js";
import axios from "axios"
import dotenv from "dotenv";
import { cloudinary } from "../config/cloudinary.js";
dotenv.config();

const FOURSQUARE_API_KEY = process.env.FOURSQUARE_API_KEY;

export const getDestinations = async (req, res) => {
  try {
    const destinations = await Destination.find();
    res.status(200).json(destinations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDestinationById = async (req, res) => {
  try {
    const { destinationId } = req.params;

    const response = await axios.get(`https://api.foursquare.com/v3/places/${destinationId}`, {
      headers: { Authorization: FOURSQUARE_API_KEY }
    });

    const place = response.data;

    const destination = {
      foursquareId: place.fsq_id,
      name: place.name,
      location: place.geocodes.main, 
      category: place.categories[0]?.name || "Unknown",
      images: place.photos || [],
      rating: place.rating || 0
    };

    res.status(200).json(destination);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addDestination = async (req, res) => {
  const { name, foursquareId, location, category } = req.body;
  let images = [];

  try {
    const existingDestination = await Destination.findOne({ foursquareId });
    if (existingDestination) {
      return res.status(400).json({ message: "Destination already exists" });
    }

    let rating = 0;

    if (foursquareId) {
      try {
        const [detailsRes, photoRes] = await Promise.all([
          axios.get(`https://api.foursquare.com/v3/places/${foursquareId}`, {
            headers: { Authorization: FOURSQUARE_API_KEY }
          }),
          axios.get(`https://api.foursquare.com/v3/places/${foursquareId}/photos`, {
            headers: { Authorization: FOURSQUARE_API_KEY },
            params: { limit: 1 }
          })
        ]);

        rating = detailsRes.data?.rating || 0;
        images = photoRes.data.map(photo => `${photo.prefix}original${photo.suffix}`);
      } catch (error) {
        return res.status(400).json({ message: "Invalid Foursquare ID or API request failed" });
      }
    }

    const newDestination = new Destination({
      name, foursquareId, location, category, images, rating,
      searchCount: 0, reviewCount: 0, favoritesCount: 0, trendingScore: 0, sharedCount: 0, isFeatured: false
    });

    await newDestination.save();
    res.status(201).json(newDestination);
  } catch (error) {
    res.status(500).json({ message: "Failed to add destination", error: error.message });
  }
};

export const updateDestination = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const destination = await Destination.findById(id);
    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }

    const role = req.userRole || req.user?.role || "user"; 
    const isAdmin = role === "admin";

    const allowedForCollaborators = [
      "name",
      "location",
      "images",
      "category"
    ];

    for (const key in updates) {
      if (isAdmin || allowedForCollaborators.includes(key)) {
        destination[key] = updates[key];
      }
    }

    const updatedDestination = await destination.save();
    res.status(200).json(updatedDestination);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDestination = async (req, res) => {
  try {
    await Destination.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Destination deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchDestinations = async (req, res) => {
  try {
    const { query, lat, lng } = req.query;
    if (!query || !lat || !lng) {
      return res.status(400).json({ message: "Query, latitude, and longitude are required" });
    }

    const response = await axios.get("https://api.foursquare.com/v3/places/search", {
      headers: { Authorization: FOURSQUARE_API_KEY },
      params: { query, ll: `${lat},${lng}`, limit: 10 }
    });

    const places = await Promise.all(response.data.results.map(async (place) => {
      let images = [];

      try {
        const photoRes = await axios.get(`https://api.foursquare.com/v3/places/${place.fsq_id}/photos`, {
          headers: { Authorization: FOURSQUARE_API_KEY },
          params: { limit: 1 }
        });
        images = photoRes.data.map(photo => `${photo.prefix}original${photo.suffix}`);
      } catch {
        images = []; 
      }

      return {
        foursquareId: place.fsq_id,
        name: place.name,
        location: place.geocodes?.main || { lat: 0, lng: 0 },
        category: place.categories?.[0]?.name || "Unknown",
        images
      };
    }));

    if (!places.length) {
      return res.status(404).json({ message: "No destinations found" });
    }

    res.status(200).json(places);
  } catch (error) {
    res.status(500).json({ message: "Failed to search destinations", error: error.message });
  }
};

export const exploreRandomDestinations = async (req, res) => {
  const { lat, lng } = req.query;

  console.log("Received request with lat:", lat, "lng:", lng);

  if (!lat || !lng) {
    console.warn("Missing latitude or longitude");
    return res.status(400).json({ message: "Latitude and longitude are required" });
  }

  const categories = [
    "Coffee & Drink",
    "Food & Restaurant",
    "Hotel",
    "Sport",
    "Entertainment",
    "Public"
  ];

  try {
    const allResults = [];

    await Promise.all(categories.map(async (category) => {
      console.log(`Fetching places for category: ${category}`);

      const options = {
        method: 'GET',
        url: 'https://api.foursquare.com/v3/places/search',
        headers: {
          Authorization: FOURSQUARE_API_KEY
        },
        params: {
          query: category,
          ll: `${lat},${lng}`,
          limit: 5
        }
      };

      try {
        const response = await axios.request(options);
        console.log(`Found ${response.data.results.length} places for category "${category}"`);
        allResults.push(...response.data.results);
        console.log("Sample raw place object:");
        console.dir(allResults[0], { depth: null });
      } catch (err) {
        console.error(`Failed to fetch places for category "${category}"`, err.message);
      }
    }));

    console.log(`Total fetched places from all categories: ${allResults.length}`);

    const places = await Promise.all(allResults.map(async (place) => {
      const foursquareId = place.fsq_id;
      const geo = place.geocodes?.main;
      const address = place.location?.formatted_address || place.location?.address || "Address unavailable";

      if (!geo || typeof geo.latitude !== "number" || typeof geo.longitude !== "number") {
        console.warn(`Skipping place due to missing geocodes: ${place.name}`);
        return {
          name: place.name,
          foursquareId,
          category: place.categories?.[0]?.name || "Unknown",
          location: null,
          address,
          images: [],
          rating: 0,
          isStored: false
        };
      }

      console.log(`Processing place: ${place.name} (${foursquareId})`);

      const existing = await Destination.findOne({ foursquareId });
      if (existing) {
        console.log(`Already exists in DB: ${existing.name}`);
        return {
          ...existing.toObject(),
          isStored: true,
          address
        };
      }

      let images = [];
      try {
        const photoOptions = {
          method: 'GET',
          url: `https://api.foursquare.com/v3/places/${foursquareId}/photos`,
          headers: {
            accept: 'application/json',
            Authorization: FOURSQUARE_API_KEY
          },
          params: {
            limit: 5
          }
        };

        const photoRes = await axios.request(photoOptions);
        console.log(`Fetched ${photoRes.data.length} photos for: ${place.name}`);

        images = photoRes.data.map(p => `${p.prefix}original${p.suffix}`);
      } catch (err) {
        console.warn(`Failed to fetch photos for ${place.name}`, err.message);
      }

      const newDestination = new Destination({
        name: place.name,
        foursquareId,
        location: {
          lat: geo.latitude,
          lng: geo.longitude
        },
        address,
        category: place.categories?.[0]?.name || "Unknown",
        images,
        rating: 0,
        searchCount: 0,
        reviewCount: 0,
        sharedCount: 0,
        favoritesCount: 0,
        trendingScore: 0,
        isFeatured: false
      });

      try {
        await newDestination.save();
        console.log(`Saved new destination: ${place.name}`);
      } catch (saveErr) {
        console.error(`Error saving destination ${place.name}:`, saveErr.message);
      }

      return {
        ...newDestination.toObject(),
        isStored: true,
        address
      };
    }));

    console.log("Returning places to frontend:", places.length);
    res.status(200).json({ places: places.filter(Boolean) });

  } catch (error) {
    console.error("Top-level error in exploreRandomDestinations:", error.message);
    res.status(500).json({
      message: "Failed to explore destinations",
      error: error.message
    });
  }
};


export const getDestinationsByCategoryAndLocation = async (req, res) => {
  const { category, lat, lng } = req.query;

  if (!category || !lat || !lng) {
    return res.status(400).json({ message: "Category, latitude, and longitude are required" });
  }

  try {
    const response = await axios.get("https://api.foursquare.com/v3/places/search", {
      headers: { Authorization: FOURSQUARE_API_KEY },
      params: {
        query: category,
        ll: `${lat},${lng}`,
        limit: 10,
      },
    });

    const places = await Promise.all(
      response.data.results.map(async (place) => {
        const foursquareId = place.fsq_id;

        const existing = await Destination.findOne({ foursquareId });
        if (existing) return existing;

        let images = [];

        try {
          const photoRes = await axios.get(`https://api.foursquare.com/v3/places/${foursquareId}/photos`, {
            headers: { Authorization: FOURSQUARE_API_KEY },
            params: { limit: 5 },
          });

          const photoUrls = photoRes.data.map((p) => `${p.prefix}original${p.suffix}`);

          const uploadedUrls = await Promise.all(
            photoUrls.map(async (url) => {
              const uploaded = await cloudinary.uploader.upload(url, {
                folder: "foursquare_places",
              });
              return uploaded.secure_url;
            })
          );

          images = uploadedUrls;
        } catch {
          images = [];
        }

        const newDestination = new Destination({
          name: place.name,
          foursquareId,
          location: place.geocodes?.main || { lat: 0, lng: 0 },
          category: place.categories?.[0]?.name || category,
          images,
          rating: 0,
          searchCount: 0,
          reviewCount: 0,
          sharedCount: 0,
          favoritesCount: 0,
          trendingScore: 0,
          isFeatured: false,
        });

        await newDestination.save();
        return newDestination;
      })
    );

    res.status(200).json({ category, places });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch category destinations", error: error.message });
  }
};

export const updateTrendingDestinations = async () => {
  try {
    const destinations = await Destination.find();

    for (const dest of destinations) {
      dest.trendingScore = (searchCount * 0.35) + (reviewCount * 0.25) +
                     (favoritesCount * 0.2) + (sharedCount * 0.1) +
                     (rating * 10 * 0.1);

      dest.isFeatured = dest.trendingScore > 50; 
      
      await dest.save();
    }
    console.log("Trending destinations updated!");
  } catch (error) {
    console.error("Error updating trending destinations:", error);
  }
};

export const incrementSharedCount = async (req, res) => {
  try {
    const { id } = req.params;
    const destination = await Destination.findById(id);
    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }
    destination.sharedCount += 1;
    await destination.save();
    res.status(200).json({ message: "Shared count updated", sharedCount: destination.sharedCount });
  } catch (error) {
    res.status(500).json({ message: "Failed to increment shared count", error: error.message });
  }
};


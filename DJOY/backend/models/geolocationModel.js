import mongoose from "mongoose";

const geolocationSchema = new mongoose.Schema({
  input: { type: String, required: true, unique: true }, 
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 30 },
});

const Geolocation = mongoose.model("Geolocation", geolocationSchema);

export default Geolocation;

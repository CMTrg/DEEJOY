import { createContext, useState, useEffect, useContext } from "react";

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [manualLocation, setManualLocation] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLng(position.coords.longitude);
      },
      () => {
        console.warn("Geolocation failed or denied. Falling back to manual input.");
      }
    );
  }, []);

  const updateManualLocation = (location) => {
    setManualLocation(location);
    setLat(location.lat);
    setLng(location.lng);
  };

  return (
    <LocationContext.Provider value={{ lat, lng, updateManualLocation, manualLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);

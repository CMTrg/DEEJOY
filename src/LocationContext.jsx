import { createContext, useState, useEffect, useContext } from "react";

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLng(position.coords.longitude);
      },
      (err) => {
        console.error("Geolocation error", err);
      }
    );
  }, []);

  return (
    <LocationContext.Provider value={{ lat, lng }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);

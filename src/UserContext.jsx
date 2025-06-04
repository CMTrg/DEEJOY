import React, { createContext, useContext, useState, useEffect } from "react";
import api from "./api/api";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";


const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [likedState, setLikedState] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          handleLogout();
        }
      } catch (err) {
        console.error("Invalid token", err);
        handleLogout();
      }
    }
  }, [token]);

  const fetchUser = async () => {
    if (!token) return;
    try {
      const res = await api.get("/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error("Fetch user failed", err);
      if ([401, 403, 404].includes(err.response?.status)) {
        handleLogout();
      }
    }
  };

  useEffect(() => {
    fetchUser();
  }, [token]);

  const handleLogin = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem("token", jwtToken);
    fetchUser();
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    navigate("/auth");
  };

  return (
    <UserContext.Provider value={{ user, setUser, token, setToken, fetchUser, handleLogin, handleLogout,
      likedState, setLikedState
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

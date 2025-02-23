import { createContext, useContext, useEffect, useState } from "react";
import { Loader } from "lucide-react";

import axiosInstance from "../axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axiosInstance.get("/auth");
        setIsAuthenticated(response.data.authenticated);
        setUser(response.data.user);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const response = await axiosInstance.get("/auth");
      setIsAuthenticated(response.data.authenticated);
      setUser(response.data.user);
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      await fetchUserDetails();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const register = async (email, password) => {
    try {
      const response = await axiosInstance.post("/auth/register", {
        email,
        password,
      });
      await fetchUserDetails();
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, logout, login, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

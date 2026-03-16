import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { apiFetch } from "../api";
import { toast } from "react-toastify";

const apiUrl = import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await apiFetch(`${apiUrl}/api/me`, {
        credentials: "include"
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      setUser(data.user);

    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = async () => {
    try {
      const res = await apiFetch(`${apiUrl}/api/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        let message = "Logout failed";

        try {
          const data = await res.json();
          message = data?.message || message;
        } catch {
          message = "Logout failed";
        }

        throw new Error(message);
      }
      
      setUser(null);
      toast.success("Successfully logged out!");
      return true;

    } catch (err) {
      toast.error(err?.message || "Logout failed");
      return false;
    }
  };


  
  return (
    
    <AuthContext.Provider value={{ user, fetchUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
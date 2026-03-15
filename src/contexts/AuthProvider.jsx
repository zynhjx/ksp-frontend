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
      const res = await fetch(`${apiUrl}/api/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Logout failed");
      }
      
      setUser(null)
      toast.success("Successfully logged out!");

    } catch (err) {
      toast.error(err.error)      
    }
  };


  
  return (
    
    <AuthContext.Provider value={{ user, fetchUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
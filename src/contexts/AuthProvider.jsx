import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { apiFetch } from "../api";
import { toast } from "react-toastify";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const res = await apiFetch("http://localhost:5000/api/me", {
          credentials: "include"
        });

        if (!res.ok) throw new Error();

        const data = await res.json();
        login(data.user)
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/logout", {
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
    
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
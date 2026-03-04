import { useState, useEffect } from "react";
import { SidebarContext } from "./SidebarContext";

export function SidebarProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem("sidebarOpen");
    return saved === "true"; // convert string to boolean
  });

  const toggleSidebar = () => {
    setSidebarOpen((open) => !open);
  } 

  useEffect(() => {
    localStorage.setItem("sidebarOpen", sidebarOpen);
  }, [sidebarOpen]);

  return (
    <SidebarContext.Provider value={{ sidebarOpen, setSidebarOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}

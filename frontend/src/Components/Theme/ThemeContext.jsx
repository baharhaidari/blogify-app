import React, { createContext, useContext, useState, useEffect } from "react";
import "./ThemeColors.css";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  // Retrieve the theme preference from local storage, default to "light" if not found
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  const toggleTheme = () => {
    // Toggle theme between "light" and "dark"
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // Update local storage when theme changes
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={theme === "dark" ? "dark-theme" : "light-theme"}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

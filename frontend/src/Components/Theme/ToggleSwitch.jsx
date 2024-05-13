import React from "react";
import { useTheme } from "./ThemeContext";
import "./ToggleSwitch.css";

const ThemeSwitch = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <label className="switch">
      <input
        type="checkbox"
        checked={theme === "dark"}
        onChange={toggleTheme}
      />

      <span className="slider round">
        <i class="fa-solid fa-sun"></i>
        <i class="fa-solid fa-moon"></i>
      </span>
    </label>
  );
};

export default ThemeSwitch;

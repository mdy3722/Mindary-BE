import React, { createContext, useState, useContext, useEffect } from "react";

const ThemeContext = createContext();

const themes = {
  black: {
    header: "#000000",
    background: "#e6eefa",
    modeIcon: "⚫",
  },
  green: {
    header: "#227447",
    background: "#e6faec",
    modeIcon: "🟢",
  },
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("black");

  const toggleTheme = () => {
    const newTheme = theme === "black" ? "green" : "black";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: themes[theme], toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

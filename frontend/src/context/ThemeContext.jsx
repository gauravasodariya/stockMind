import React, {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";

const ThemeContext = createContext();

const applyTheme = (mode) => {
  const root = document.documentElement;
  const nextIsDark = mode === "dark";
  root.classList.remove("dark");
  if (nextIsDark) {
    root.classList.add("dark");
  }
  root.setAttribute("data-theme", mode);
  const scheme = nextIsDark ? "dark" : "light";
  root.style.colorScheme = scheme;
  localStorage.setItem("theme", mode);
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark" ? "dark" : "light";
  });

  useLayoutEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    const handleStorage = (e) => {
      if (
        e.key === "theme" &&
        (e.newValue === "light" || e.newValue === "dark")
      ) {
        setTheme(e.newValue);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      applyTheme(next);
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

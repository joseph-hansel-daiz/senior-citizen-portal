"use client";

import { ThemeEnum } from "@/lib/enums";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

type Theme = { theme: ThemeEnum };

type ThemeContextType = {
  theme: Theme | null;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    setTheme(stored ? JSON.parse(stored) : { theme: ThemeEnum.Light });
  }, []);

  useEffect(() => {
    if (theme) {
      localStorage.setItem("theme", JSON.stringify(theme));
      document.documentElement.setAttribute("data-bs-theme", theme.theme);
    }
  }, [theme]);

  const toggle = () => {
    if (theme?.theme === ThemeEnum.Light) {
      setTheme({ theme: ThemeEnum.Dark });
    } else {
      setTheme({ theme: ThemeEnum.Light });
    }
  };

  const value = {
    theme,
    toggle,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within an ThemeProvider");
  }
  return context;
};

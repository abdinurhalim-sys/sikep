// src/context/ThemeContext.js
import React, { createContext, useState, useEffect, useContext } from "react";

// Definisi tema warna
const colorThemes = {
  // Tema 1: Soft Pastel
  soft: {
    name: "Soft Pastel",
    background: "from-purple-50 via-green-50 to-orange-50",
    shapes: [
      { color: "bg-purple-200/20", blur: "blur-3xl" },
      { color: "bg-green-200/20", blur: "blur-3xl" },
      { color: "bg-orange-200/15", blur: "blur-3xl" },
    ],
    formGradient: "from-purple-300/5 to-green-300/5",
    logoGradient: "from-purple-300 to-green-400",
    buttonGradient: "from-purple-400 to-green-500",
    cardGradient: "from-purple-300 to-green-400",
    focusRing: "purple-300",
    textColor: "purple-800",
    iconColor: "purple-100",
    floatingColors: [
      "rgba(233, 213, 255, 0.3)",
      "rgba(167, 243, 208, 0.3)",
      "rgba(255, 237, 213, 0.3)",
    ],
    textClass: "text-gray-800",
    textLightClass: "text-gray-600",
    isDark: false,
  },

  // Tema 2: Ocean Blue
  ocean: {
    name: "Ocean Blue",
    background: "from-blue-50 via-cyan-50 to-teal-50",
    shapes: [
      { color: "bg-blue-300/25", blur: "blur-3xl" },
      { color: "bg-cyan-300/25", blur: "blur-3xl" },
      { color: "bg-teal-200/20", blur: "blur-3xl" },
    ],
    formGradient: "from-blue-400/8 to-cyan-400/8",
    logoGradient: "from-blue-400 to-cyan-500",
    buttonGradient: "from-blue-500 to-cyan-600",
    cardGradient: "from-blue-400 to-cyan-500",
    focusRing: "blue-400",
    textColor: "blue-900",
    iconColor: "blue-100",
    floatingColors: [
      "rgba(147, 197, 253, 0.4)",
      "rgba(103, 232, 249, 0.4)",
      "rgba(94, 234, 212, 0.4)",
    ],
    textClass: "text-gray-800",
    textLightClass: "text-gray-600",
    isDark: false,
  },

  // Tema 3: Sunset
  sunset: {
    name: "Sunset",
    background: "from-orange-50 via-rose-50 to-pink-50",
    shapes: [
      { color: "bg-orange-300/30", blur: "blur-3xl" },
      { color: "bg-rose-300/30", blur: "blur-3xl" },
      { color: "bg-pink-200/25", blur: "blur-3xl" },
    ],
    formGradient: "from-orange-400/10 to-rose-400/10",
    logoGradient: "from-orange-400 to-rose-500",
    buttonGradient: "from-orange-500 to-rose-600",
    cardGradient: "from-orange-400 to-rose-500",
    focusRing: "orange-400",
    textColor: "orange-900",
    iconColor: "orange-100",
    floatingColors: [
      "rgba(254, 215, 170, 0.5)",
      "rgba(251, 207, 232, 0.5)",
      "rgba(249, 168, 212, 0.5)",
    ],
    textClass: "text-gray-800",
    textLightClass: "text-gray-600",
    isDark: false,
  },

  // Tema 4: Forest Green
  forest: {
    name: "Forest Green",
    background: "from-emerald-50 via-lime-50 to-amber-50",
    shapes: [
      { color: "bg-emerald-300/25", blur: "blur-3xl" },
      { color: "bg-lime-300/25", blur: "blur-3xl" },
      { color: "bg-amber-200/20", blur: "blur-3xl" },
    ],
    formGradient: "from-emerald-400/8 to-lime-400/8",
    logoGradient: "from-emerald-400 to-lime-500",
    buttonGradient: "from-emerald-500 to-lime-600",
    cardGradient: "from-emerald-400 to-lime-500",
    focusRing: "emerald-400",
    textColor: "emerald-900",
    iconColor: "emerald-100",
    floatingColors: [
      "rgba(167, 243, 208, 0.4)",
      "rgba(190, 242, 100, 0.4)",
      "rgba(252, 211, 77, 0.4)",
    ],
    textClass: "text-gray-800",
    textLightClass: "text-gray-600",
    isDark: false,
  },

  // Tema 5: Deep Space Blue dengan Magenta Neon dan Cyan Electric (Cyberpunk) - PERBAIKAN TOTAL
  cyberpunk: {
    name: "Cyberpunk",
    background: "from-gray-900 via-blue-900 to-purple-900",
    shapes: [
      { color: "bg-purple-500/30", blur: "blur-3xl" },
      { color: "bg-cyan-400/30", blur: "blur-3xl" },
      { color: "bg-blue-600/20", blur: "blur-3xl" },
    ],
    formGradient: "from-purple-900/30 to-blue-900/30",
    logoGradient: "from-cyan-400 to-purple-500",
    buttonGradient: "from-cyan-500 to-purple-600",
    cardGradient: "from-blue-900/40 to-purple-900/40",
    focusRing: "cyan-400",
    textColor: "white", // Putih murni untuk kontras maksimal
    iconColor: "cyan-300",
    textSikep: "text-white",
    floatingColors: [
      "rgba(139, 92, 246, 0.5)", // Magenta
      "rgba(6, 182, 212, 0.5)", // Cyan
      "rgba(59, 130, 246, 0.5)", // Blue
    ],
    textClass: "text-gray-900", // Putih untuk semua teks utama
    textLightClass: "text-cyan-700", // Cyan terang untuk teks sekunder
    inputTextClass: "text-gray-900", // Hitam untuk input form
    isDark: true,
  },

  // Tema 6: Dusty Rose dengan Sage Green dan Soft Blue (Spring)
  spring: {
    name: "Spring",
    background: "from-rose-50 via-green-50 to-blue-50",
    shapes: [
      { color: "bg-rose-200/20", blur: "blur-3xl" },
      { color: "bg-green-200/20", blur: "blur-3xl" },
      { color: "bg-blue-200/15", blur: "blur-3xl" },
    ],
    formGradient: "from-rose-300/5 to-green-300/5",
    logoGradient: "from-rose-500 to-green-600",
    buttonGradient: "from-rose-600 to-green-700",
    cardGradient: "from-rose-500/50 to-green-600/50",
    focusRing: "rose-500",
    textColor: "gray-900",
    iconColor: "rose-500",
    floatingColors: [
      "rgba(251, 207, 232, 0.4)", // Dusty Rose
      "rgba(167, 243, 208, 0.4)", // Sage Green
      "rgba(191, 219, 254, 0.4)", // Soft Blue
    ],
    textClass: "text-gray-900",
    textLightClass: "text-gray-700",
    inputTextClass: "text-gray-900",
    isDark: false,
  },

  // Tema 7: Default Blue - PERBAIKAN TOTAL
  default: {
    name: "Default Blue",
    background: "from-blue-900 via-indigo-900 to-purple-900",
    shapes: [
      { color: "bg-purple-700/20", blur: "blur-3xl" },
      { color: "bg-blue-600/20", blur: "blur-3xl" },
      { color: "bg-indigo-700/10", blur: "blur-3xl" },
    ],
    formGradient: "from-blue-800/50 to-indigo-800/50",
    logoGradient: "from-blue-300 to-cyan-200",
    buttonGradient: "from-cyan-600 to-blue-600",
    cardGradient: "from-blue-800/50 to-indigo-800/50",
    focusRing: "cyan-400",
    textColor: "white", // Putih murni untuk kontras maksimal
    iconColor: "cyan-300",
    textSikep: "text-white",
    floatingColors: [
      "rgba(139, 92, 246, 0.3)",
      "rgba(59, 130, 246, 0.3)",
      "rgba(99, 102, 241, 0.3)",
    ],
    textClass: "text-gray-100", // Putih untuk semua teks utama
    textLightClass: "text-gray-700", // Cyan terang untuk teks sekunder
    inputTextClass: "text-gray-900", // Hitam untuk input form
    hoverColor: "hover:bg-purple-500",
    isDark: true,
  },

  // Tema 8: Light Gray - tema baru dengan dominasi warna gray muda dan putih
  lightGray: {
    name: "Light Gray",
    background: "from-gray-50 via-white to-blue-50",
    shapes: [
      { color: "bg-gray-200/20", blur: "blur-3xl" },
      { color: "bg-blue-100/20", blur: "blur-3xl" },
      { color: "bg-green-100/15", blur: "blur-3xl" },
    ],
    formGradient: "from-gray-100/10 to-blue-100/10",
    logoGradient: "from-orange-100 via-rose-100 to-pink-100",
    buttonGradient: "from-gray-500 to-blue-500",
    cardGradient: "from-gray-200/50 to-blue-200/50",
    focusRing: "gray-400",
    textColor: "gray-800",
    iconColor: "text-gray-500",
    floatingColors: [
      "rgba(229, 231, 235, 0.5)", // gray-200
      "rgba(219, 234, 254, 0.5)", // blue-100
      "rgba(220, 252, 231, 0.5)", // green-100
    ],
    textClass: "text-gray-800",
    textLightClass: "text-gray-600",
    inputTextClass: "text-gray-800",
    isDark: false,
  },
};

// Membuat Context
const ThemeContext = createContext();

// Provider komponen
export const ThemeProvider = ({ children }) => {
  const [colorTheme, setColorTheme] = useState(() => {
    // Mendapatkan tema dari localStorage atau menggunakan tema default
    const savedTheme = localStorage.getItem("colorTheme");
    return savedTheme || "default";
  });

  // Efek untuk menyimpan tema ke localStorage saat berubah
  useEffect(() => {
    localStorage.setItem("colorTheme", colorTheme);
  }, [colorTheme]);

  // Fungsi untuk mengubah tema
  const changeColorTheme = (themeKey) => {
    setColorTheme(themeKey);
  };

  // Mendapatkan tema aktif
  const currentTheme = colorThemes[colorTheme] || colorThemes.default;

  return (
    <ThemeContext.Provider
      value={{ colorTheme, changeColorTheme, currentTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Hook untuk menggunakan tema
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// src/components/ColorThemeSelector.js
import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

const ColorThemeSelector = () => {
  const { colorTheme, changeColorTheme, currentTheme } = useTheme();

  // Tentukan font berdasarkan tema
  const fontClass = currentTheme.isDark ? "font-mono" : "font-sans";

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${fontClass}`}>
      <motion.div
        className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-3 border border-white/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="flex items-center space-x-2">
          <span
            className={`text-xs font-medium whitespace-nowrap ${fontClass} ${currentTheme.textClass}`}
          >
            Tema Warna:
          </span>
          <div className="flex space-x-1">
            {Object.entries({
              soft: { name: "Soft", colors: ["#e9d5ff", "#a7f3d0", "#ffedd5"] },
              ocean: {
                name: "Ocean",
                colors: ["#93c5fd", "#67e8f9", "#5eead4"],
              },
              sunset: {
                name: "Sunset",
                colors: ["#fdba74", "#fbcfe8", "#f9a8d4"],
              },
              forest: {
                name: "Forest",
                colors: ["#a7f3d0", "#bef264", "#fcd34d"],
              },
              cyberpunk: {
                name: "Cyberpunk",
                colors: ["#8b5cf6", "#06b6d4", "#3b82f6"],
              },
              spring: {
                name: "Spring",
                colors: ["#fbcfe8", "#a7f3d0", "#bfdbfe"],
              },
              default: {
                name: "Default",
                colors: ["#6366f1", "#3b82f6", "#6366f1"],
              },
              lightGray: {
                // Tambahkan tema baru ini
                name: "Light Gray",
                colors: ["#f3f4f6", "#dbeafe", "#dcfce7"],
              },
            }).map(([key, theme]) => (
              <motion.button
                key={key}
                onClick={() => changeColorTheme(key)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  colorTheme === key
                    ? "border-slate-800 scale-110"
                    : "border-white/50 hover:scale-105"
                }`}
                style={{
                  background: `linear-gradient(135deg, ${theme.colors.join(
                    ", "
                  )})`,
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                title={theme.name}
              >
                <span className="sr-only">{theme.name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ColorThemeSelector;

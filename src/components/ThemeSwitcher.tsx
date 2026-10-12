import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Check } from 'lucide-react';
import { config, ThemePreset } from '../config';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const ThemeSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedThemeId, setSelectedThemeId] = useLocalStorage<string>(
    'birthday-surprise-theme',
    config.themes[0].id
  );

  // Apply CSS variables whenever selectedThemeId changes
  useEffect(() => {
    const activeTheme: ThemePreset =
      config.themes.find((t) => t.id === selectedThemeId) || config.themes[0];

    const root = document.documentElement;
    Object.entries(activeTheme.variables).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, [selectedThemeId]);

  return (
    <div className="fixed bottom-4 right-4 z-50 select-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.92 }}
            transition={{ duration: 0.2 }}
            className="mb-3 bg-stone-900/90 backdrop-blur-xl border border-white/20 rounded-2xl p-2.5 shadow-2xl w-48"
            role="menu"
            aria-label="Color theme presets"
          >
            <p className="text-[11px] font-medium text-white/60 px-2 py-1 uppercase tracking-wider">
              Theme Mood
            </p>
            <div className="flex flex-col gap-1 mt-1">
              {config.themes.map((theme) => {
                const isSelected = theme.id === selectedThemeId;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setSelectedThemeId(theme.id);
                      setIsOpen(false);
                    }}
                    className={`w-full px-2.5 py-2 rounded-xl text-left text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span
                        className="w-4 h-4 rounded-full border border-white/40 shadow-xs shrink-0"
                        style={{ backgroundColor: theme.swatch }}
                      />
                      <span className="truncate">{theme.name}</span>
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-300 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Change color theme"
        aria-expanded={isOpen}
        className="w-12 h-12 rounded-full shadow-xl border-2 border-white/40 flex items-center justify-center text-white cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ml-auto"
        style={{
          background:
            'conic-gradient(from 0deg, #E11D48, #F59E0B, #10B981, #8B5CF6, #EC4899, #E11D48)',
        }}
      >
        <span className="w-9 h-9 rounded-full bg-black/45 backdrop-blur-xs flex items-center justify-center">
          <Palette className="w-4 h-4 text-white" />
        </span>
      </motion.button>
    </div>
  );
};

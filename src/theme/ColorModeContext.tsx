'use client';

import React, { createContext, useContext, useState, useMemo } from 'react';

type ColorMode = 'dark' | 'light';

interface ColorModeContextType {
  mode: ColorMode;
  toggleMode: () => void;
}

export const ColorModeContext = createContext<ColorModeContextType>({
  mode: 'dark',
  toggleMode: () => {},
});

export function useColorMode() {
  return useContext(ColorModeContext);
}

export function ColorModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ColorMode>('dark');
  const value = useMemo(
    () => ({
      mode,
      toggleMode: () => setMode((m) => (m === 'dark' ? 'light' : 'dark')),
    }),
    [mode]
  );
  return <ColorModeContext.Provider value={value}>{children}</ColorModeContext.Provider>;
}

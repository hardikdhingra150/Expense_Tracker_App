import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const CURRENCIES = [
  { label: 'Indian Rupee',  symbol: '₹', code: 'INR', locale: 'en-IN' },
  { label: 'US Dollar',     symbol: '$', code: 'USD', locale: 'en-US' },
  { label: 'Euro',          symbol: '€', code: 'EUR', locale: 'de-DE' },
  { label: 'British Pound', symbol: '£', code: 'GBP', locale: 'en-GB' },
];

export function getTheme(isDark) {
  return {
    bg:      isDark ? '#0f0f13' : '#f0f0f5',
    surface: isDark ? '#1a1a24' : '#ffffff',
    surface2:isDark ? '#22222e' : '#f8f8ff',
    border:  isDark ? '#2a2a3a' : '#e0e0e0',
    text:    isDark ? '#ffffff' : '#1a1a24',
    muted:   isDark ? '#8b8b9e' : '#6b6b7e',
    accent:  '#6c63ff',
    success: '#00d4aa',
    danger:  '#ff6584',
    isDark,
  };
}

export function AppProvider({ children }) {
  const [isDark, setIsDark]       = useState(true);
  const [currency, setCurrency]   = useState(CURRENCIES[0]);
  const [gcalToken, setGcalToken] = useState(null);

  const theme = getTheme(isDark);

  return (
    <AppContext.Provider value={{ isDark, setIsDark, currency, setCurrency, gcalToken, setGcalToken, theme }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
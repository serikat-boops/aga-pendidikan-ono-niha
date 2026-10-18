import React, { createContext, useContext, useEffect, useState } from 'react';
import { DEFAULT_SETTINGS, fetchSiteSettings } from '../lib/supabase';

const SettingsContext = createContext({
  settings: DEFAULT_SETTINGS,
  loading: false,
  refreshSettings: async () => {},
});

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const cached = localStorage.getItem('hpon_site_settings');
      if (cached) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(cached) };
      }
    } catch {
      // ignore storage errors
    }
    return DEFAULT_SETTINGS;
  });
  const [loading, setLoading] = useState(true);

  const refreshSettings = async () => {
    try {
      const fresh = await fetchSiteSettings();
      setSettings(fresh);
      try {
        localStorage.setItem('hpon_site_settings', JSON.stringify(fresh));
      } catch {
        // ignore storage errors
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}

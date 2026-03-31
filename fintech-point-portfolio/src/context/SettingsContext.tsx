import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '../Service/api';

interface SiteSettings {
  siteName: string;
  logoDisplay: 'text' | 'image';
  logoImageUrl: string;
  heroTitle: string;
  heroSubtitle: string;
  heroPrimaryBtnLabel: string;
  heroSecondaryBtnLabel: string;
  aboutDescription: string;
  contactAddress: string;
  contactEmail: string;
  contactPhone: string;
  socialLinkedin: string;
  socialGithub: string;
  socialX: string;
  copyrightText: string;
  maintenanceMode: string;
  [key: string]: string;
}

const defaultSettings: SiteSettings = {
  siteName: 'Fintech Point',
  logoDisplay: 'text',
  logoImageUrl: '',
  heroTitle: 'Building the Future of Digital Finance',
  heroSubtitle: 'We specialize in creating robust, scalable, and innovative web applications for businesses aiming to thrive in the modern digital ecosystem.',
  heroPrimaryBtnLabel: 'Our Work',
  heroSecondaryBtnLabel: 'Contact Us',
  aboutDescription: 'Fintech Point is an innovative software studio based in Bangladesh heavily focused on delivering cutting-edge SaaS platforms, Point of Sale systems, and robust web applications for global and localized markets.',
  contactAddress: 'Fintech Point, Mymensingh, Bangladesh',
  contactEmail: 'admin@fintechpoint.com',
  contactPhone: '+880 1234 567890',
  socialLinkedin: 'https://linkedin.com/company/fintechpoint',
  socialGithub: 'https://github.com/fintechpoint',
  socialX: 'https://x.com/fintechpoint',
  copyrightText: 'Fintech Point. All rights reserved.',
  maintenanceMode: 'false'
};

interface SettingsContextType {
  settings: SiteSettings;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  loading: true,
  refreshSettings: async () => {}
});

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const data = await apiService.get<Record<string, string>>('/api/settings');
      if (data && Object.keys(data).length > 0) {
        setSettings(prev => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.warn('Failed to load global CMS settings. Falling back to defaults.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

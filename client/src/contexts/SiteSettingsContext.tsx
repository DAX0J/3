import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { readData, writeData, watchData } from '../lib/firebase';

interface CountdownSettings {
  enabled: boolean;
  targetDate: string;
  title: string;
}

interface PasswordProtection {
  enabled: boolean;
  password: string;
}

import { ShippingProvince, shippingProvinces } from '../data/shippingProvinces';

interface ShippingSettings {
  provinces: ShippingProvince[];
  freeShippingThreshold: number;
  minPrice: number;
  maxPrice: number;
}

interface SocialMediaSettings {
  instagram: string;
  twitter: string;
  facebook: string;
  youtube: string;
  tiktok: string;
  enabled: boolean;
}

interface SiteSettings {
  countdownSettings: CountdownSettings;
  passwordProtection: PasswordProtection;
  shippingSettings: ShippingSettings;
  socialMedia: SocialMediaSettings;
  isUnlocked: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  currency: string;
}

interface SiteSettingsContextType extends SiteSettings {
  unlockSite: (password: string) => Promise<boolean>;
  togglePasswordProtection: (enabled: boolean) => Promise<void>;
  changePassword: (newPassword: string) => Promise<void>;
  updateCountdownSettings: (settings: Partial<CountdownSettings>) => Promise<void>;
  updateShippingSettings: (settings: Partial<ShippingSettings>) => Promise<void>;
  updateSocialMediaSettings: (settings: Partial<SocialMediaSettings>) => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  adminLogout: () => void;
}

const defaultSettings: SiteSettings = {
  countdownSettings: {
    enabled: true,
    targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    title: 'Next Drop Coming Soon',
  },
  passwordProtection: {
    enabled: true,
    password: 'password123',
  },
  shippingSettings: {
    provinces: shippingProvinces,
    freeShippingThreshold: 5000,
    minPrice: 300,
    maxPrice: 800
  },
  socialMedia: {
    instagram: 'https://instagram.com/drp',
    twitter: 'https://twitter.com/drp',
    facebook: 'https://facebook.com/drp',
    youtube: 'https://youtube.com/drp',
    tiktok: 'https://tiktok.com/@drp',
    enabled: true
  },
  isUnlocked: false,
  isAdmin: false,
  isLoading: true,
  currency: 'DZD',
};

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export const SiteSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);

  // Load settings from Firebase on mount
  useEffect(() => {
    // Initialize settings in Firebase right away
    const initializeSettings = async () => {
      const snapshot = await readData('siteSettings');
      if (!snapshot.exists()) {
        // Create initial settings
        await writeData('siteSettings', {
          countdownSettings: defaultSettings.countdownSettings,
          passwordProtection: defaultSettings.passwordProtection,
          shippingSettings: defaultSettings.shippingSettings,
          socialMedia: defaultSettings.socialMedia,
        });
        console.log('Initialized default settings in Firebase');
      }
    };
    
    initializeSettings().catch(error => {
      console.error('Error initializing settings:', error);
    });
    
    const unsubscribe = watchData('siteSettings', (data) => {
      if (data) {
        setSettings(prev => ({
          ...prev,
          countdownSettings: data.countdownSettings || defaultSettings.countdownSettings,
          passwordProtection: data.passwordProtection || defaultSettings.passwordProtection,
          shippingSettings: data.shippingSettings || defaultSettings.shippingSettings,
          socialMedia: data.socialMedia || defaultSettings.socialMedia,
          isLoading: false,
        }));
      } else {
        setSettings(prev => ({ ...prev, isLoading: false }));
      }
    });

    // Check for stored unlock status in session storage
    const storedUnlockStatus = sessionStorage.getItem('siteUnlocked');
    if (storedUnlockStatus === 'true') {
      setSettings(prev => ({ ...prev, isUnlocked: true }));
    }

    // Check for admin login status
    const adminStatus = localStorage.getItem('adminLoggedIn');
    if (adminStatus === 'true') {
      setSettings(prev => ({ ...prev, isAdmin: true }));
    }

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const unlockSite = async (password: string): Promise<boolean> => {
    try {
      // Validate password directly from Firebase
      const snapshot = await readData('siteSettings/passwordProtection/password');
      const correctPassword = snapshot.val();
      
      if (password === correctPassword) {
        // Store unlocked state and generate a simple token
        const simpleToken = btoa(`${new Date().getTime()}_${Math.random().toString(36).substr(2, 9)}`);
        sessionStorage.setItem('siteUnlocked', 'true');
        sessionStorage.setItem('authToken', simpleToken);
        setSettings(prev => ({ ...prev, isUnlocked: true }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error unlocking site with Firebase:', error);
      return false;
    }
  };

  const togglePasswordProtection = async (enabled: boolean): Promise<void> => {
    try {
      // Update Firebase only
      await writeData('siteSettings/passwordProtection/enabled', enabled);
      console.log(`Password protection ${enabled ? 'enabled' : 'disabled'} in Firebase`);
      
      // Update local state
      setSettings(prev => ({
        ...prev,
        passwordProtection: {
          ...prev.passwordProtection,
          enabled,
        },
      }));
    } catch (error) {
      console.error('Error toggling password protection:', error);
      alert('Error updating password protection setting. Please try again.');
    }
  };

  const changePassword = async (newPassword: string): Promise<void> => {
    try {
      // Update only in Firebase
      console.log('Updating password in Firebase to:', newPassword);
      await writeData('siteSettings/passwordProtection/password', newPassword);
      console.log('Password updated in Firebase');
      
      // Update local state
      setSettings(prev => ({
        ...prev,
        passwordProtection: {
          ...prev.passwordProtection,
          password: newPassword,
        },
      }));
      
      // Provide visual feedback
      alert('Password updated successfully!');
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Error changing password. Please try again.');
    }
  };

  const updateCountdownSettings = async (newSettings: Partial<CountdownSettings>): Promise<void> => {
    const updatedSettings = {
      ...settings.countdownSettings,
      ...newSettings,
    };
    
    await writeData('siteSettings/countdownSettings', updatedSettings);
    setSettings(prev => ({
      ...prev,
      countdownSettings: updatedSettings,
    }));
  };
  
  const updateShippingSettings = async (newSettings: Partial<ShippingSettings>): Promise<void> => {
    const updatedSettings = {
      ...settings.shippingSettings,
      ...newSettings,
    };
    
    await writeData('siteSettings/shippingSettings', updatedSettings);
    setSettings(prev => ({
      ...prev,
      shippingSettings: updatedSettings,
    }));
  };
  
  const updateSocialMediaSettings = async (newSettings: Partial<SocialMediaSettings>): Promise<void> => {
    const updatedSettings = {
      ...settings.socialMedia,
      ...newSettings,
    };
    
    await writeData('siteSettings/socialMedia', updatedSettings);
    setSettings(prev => ({
      ...prev,
      socialMedia: updatedSettings,
    }));
  };

  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      // For simplicity, using a hardcoded admin check
      // In a real app, you'd use Firebase Auth here
      if (email === 'admin@example.com' && password === 'admin123') {
        localStorage.setItem('adminLoggedIn', 'true');
        setSettings(prev => ({ ...prev, isAdmin: true }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Admin login error:', error);
      return false;
    }
  };

  const adminLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    setSettings(prev => ({ ...prev, isAdmin: false }));
  };

  return (
    <SiteSettingsContext.Provider
      value={{
        ...settings,
        unlockSite,
        togglePasswordProtection,
        changePassword,
        updateCountdownSettings,
        updateShippingSettings,
        updateSocialMediaSettings,
        adminLogin,
        adminLogout,
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = (): SiteSettingsContextType => {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
};
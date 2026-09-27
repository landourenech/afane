import type { LucideIcon } from 'lucide-react';

export interface SettingsItemConfig {
  icon: LucideIcon;
  label: string;
  description?: string;
  href?: string;
  onClick?: () => void;
  badge?: string | number;
  variant?: 'default' | 'danger';
  iconBg?: string;
}

export interface SettingsSectionConfig {
  title?: string;
  items: SettingsItemConfig[];
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  region: string;
  notifications: {
    email: boolean;
    push: boolean;
    sounds: boolean;
    messages: boolean;
    orders: boolean;
    marketing: boolean;
  };
  privacy: {
    showEmail: boolean;
    showPhone: boolean;
    showLocation: boolean;
    allowMessages: 'everyone' | 'contacts' | 'nobody';
  };
  chats: {
    wallpaper: string;
    fontSize: 'small' | 'medium' | 'large';
  };
}

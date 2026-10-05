import { NotificationSettings } from '../types';

const STORAGE_KEY = 'currentcast_notification_settings_v1';

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  gridRestoration: true,
  outageAlerts: true,
};

export const loadNotificationSettings = (): NotificationSettings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_NOTIFICATION_SETTINGS, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.warn('Failed to load notification settings', e);
  }
  return DEFAULT_NOTIFICATION_SETTINGS;
};

export const saveNotificationSettings = (settings: NotificationSettings) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save notification settings', e);
  }
};

export const isNotificationSupported = (): boolean => {
  return typeof window !== 'undefined' && 'Notification' in window;
};

export const getNotificationPermission = (): NotificationPermission | 'unsupported' => {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission;
};

export const requestNotificationPermission = async (): Promise<NotificationPermission | 'unsupported'> => {
  if (!isNotificationSupported()) return 'unsupported';
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (err) {
    console.warn('Error requesting notification permission:', err);
    return Notification.permission;
  }
};

export const sendBrowserNotification = (
  title: string,
  options?: NotificationOptions
): boolean => {
  if (!isNotificationSupported()) return false;
  
  if (Notification.permission === 'granted') {
    try {
      new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options,
      });
      return true;
    } catch (e) {
      console.warn('Failed to dispatch native browser notification', e);
      return false;
    }
  }
  return false;
};

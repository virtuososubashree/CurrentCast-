import { Region, ChecklistItem, CrowdReport, UtilityAlert, InverterDevice } from '../types';
import {
  INITIAL_REGIONS,
  INITIAL_CHECKLIST,
  INITIAL_CROWD_REPORTS,
  INITIAL_ALERTS,
  INITIAL_INVERTER_DEVICES,
} from '../data/regionsData';
import { syncRegionsWithActivePhoneDate } from './dateUtils';

const STORAGE_KEYS = {
  REGIONS: 'currentcast_regions_v1',
  SELECTED_REGION: 'currentcast_selected_region_id_v1',
  CHECKLIST: 'currentcast_checklist_v1',
  CROWD_REPORTS: 'currentcast_crowd_reports_v1',
  ALERTS: 'currentcast_alerts_v1',
  INVERTER_DEVICES: 'currentcast_inverter_devices_v1',
  INVERTER_AH: 'currentcast_inverter_ah_v1',
  CONNECTIVITY_MODE: 'currentcast_conn_mode_v1',
  LAST_SYNC: 'currentcast_last_sync_timestamp_v1',
  THEME_MODE: 'currentcast_theme_mode_v1',
};

export const loadStoredRegions = (): Region[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REGIONS);
    if (raw) {
      const parsed: Region[] = JSON.parse(raw);
      return syncRegionsWithActivePhoneDate(parsed, new Date());
    }
  } catch (e) {
    console.warn('Failed to load regions from localStorage', e);
  }
  return syncRegionsWithActivePhoneDate(INITIAL_REGIONS, new Date());
};

export const saveStoredRegions = (regions: Region[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.REGIONS, JSON.stringify(regions));
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
  } catch (e) {
    console.error('Failed to save regions to localStorage', e);
  }
};

export const loadSelectedRegionId = (): string => {
  try {
    return localStorage.getItem(STORAGE_KEYS.SELECTED_REGION) || 'kurinjipadi-cuddalore';
  } catch {
    return 'kurinjipadi-cuddalore';
  }
};

export const saveSelectedRegionId = (id: string) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SELECTED_REGION, id);
  } catch (e) {
    console.error('Failed to save selected region', e);
  }
};

export const loadChecklist = (): ChecklistItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CHECKLIST);
    if (raw) return JSON.parse(raw);
  } catch {}
  return INITIAL_CHECKLIST;
};

export const saveChecklist = (items: ChecklistItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CHECKLIST, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save checklist', e);
  }
};

export const loadCrowdReports = (): CrowdReport[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CROWD_REPORTS);
    if (raw) return JSON.parse(raw);
  } catch {}
  return INITIAL_CROWD_REPORTS;
};

export const saveCrowdReports = (reports: CrowdReport[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CROWD_REPORTS, JSON.stringify(reports));
  } catch (e) {
    console.error('Failed to save crowd reports', e);
  }
};

export const loadAlerts = (): UtilityAlert[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ALERTS);
    if (raw) return JSON.parse(raw);
  } catch {}
  return INITIAL_ALERTS;
};

export const saveAlerts = (alerts: UtilityAlert[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
  } catch (e) {
    console.error('Failed to save alerts', e);
  }
};

export const loadInverterDevices = (): InverterDevice[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INVERTER_DEVICES);
    if (raw) return JSON.parse(raw);
  } catch {}
  return INITIAL_INVERTER_DEVICES;
};

export const saveInverterDevices = (devices: InverterDevice[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.INVERTER_DEVICES, JSON.stringify(devices));
  } catch (e) {
    console.error('Failed to save inverter devices', e);
  }
};

export const getLastSyncTime = (): string => {
  try {
    const time = localStorage.getItem(STORAGE_KEYS.LAST_SYNC);
    if (time) {
      const date = new Date(time);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  } catch {}
  return 'Just now';
};

export const loadThemeMode = (): import('../types').ThemeMode => {
  try {
    const mode = localStorage.getItem(STORAGE_KEYS.THEME_MODE);
    if (mode === 'light' || mode === 'dark' || mode === 'amoled' || mode === 'auto') {
      return mode;
    }
  } catch {}
  return 'dark';
};

export const saveThemeMode = (mode: import('../types').ThemeMode) => {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME_MODE, mode);
  } catch (e) {
    console.error('Failed to save theme mode', e);
  }
};


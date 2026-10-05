/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Region, 
  ConnectivityMode, 
  ChecklistItem, 
  CrowdReport, 
  UtilityAlert, 
  InverterDevice,
  NotificationSettings,
  ThemeMode
} from './types';
import {
  loadStoredRegions,
  saveStoredRegions,
  loadSelectedRegionId,
  saveSelectedRegionId,
  loadChecklist,
  saveChecklist,
  loadCrowdReports,
  saveCrowdReports,
  loadAlerts,
  saveAlerts,
  loadInverterDevices,
  saveInverterDevices,
  getLastSyncTime,
  loadThemeMode,
  saveThemeMode,
} from './utils/storage';
import {
  loadNotificationSettings,
  saveNotificationSettings,
  sendBrowserNotification,
} from './utils/notifications';
import { useBatteryStatus } from './utils/battery';
import { syncRegionsWithActivePhoneDate } from './utils/dateUtils';
import { 
  INITIAL_REGIONS, 
  INITIAL_POWER_HUBS, 
  INITIAL_OFFLINE_ACTIVITIES 
} from './data/regionsData';
import { Header } from './components/Header';
import { RegionSelector } from './components/RegionSelector';
import { ForecastHero } from './components/ForecastHero';
import { ForecastTimeline } from './components/ForecastTimeline';
import { PreOutageChecklist } from './components/PreOutageChecklist';
import { DeadZoneWarning } from './components/DeadZoneWarning';
import { HistoricalPatternCard } from './components/HistoricalPatternCard';
import { WattNextGuide } from './components/WattNextGuide';
import { CrowdReporting } from './components/CrowdReporting';
import { AdminSimulationModal } from './components/AdminSimulationModal';
import { EmergencyOfflineModal } from './components/EmergencyOfflineModal';
import { SettingsModal } from './components/SettingsModal';
import { AppIntroOutroAnimation } from './components/AppIntroOutroAnimation';
import { ShieldCheck, WifiOff, Zap, BatteryWarning } from 'lucide-react';

export default function App() {
  const [isLaunching, setIsLaunching] = useState<boolean>(true);

  const [regions, setRegions] = useState<Region[]>(() => loadStoredRegions());
  const [selectedRegionId, setSelectedRegionId] = useState<string>(() => loadSelectedRegionId());
  const [connectivityMode, setConnectivityMode] = useState<ConnectivityMode>('online');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [checklist, setChecklist] = useState<ChecklistItem[]>(() => loadChecklist());
  const [crowdReports, setCrowdReports] = useState<CrowdReport[]>(() => loadCrowdReports());
  const [alerts, setAlerts] = useState<UtilityAlert[]>(() => loadAlerts());
  const [inverterDevices, setInverterDevices] = useState<InverterDevice[]>(() => loadInverterDevices());
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(() => loadNotificationSettings());
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => loadThemeMode());
  
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>(() => getLastSyncTime());

  // Battery Status Sensor Hook
  const { batteryState, simulateBattery, clearSimulatedBattery } = useBatteryStatus();

  // Determine Effective Theme based on User Setting + Battery Saver Sensor
  const isAutoBatteryTriggered = 
    (themeMode === 'auto' || (notificationSettings.autoBatterySaver ?? true)) &&
    (batteryState.isBatterySaver || (!batteryState.charging && batteryState.percentage <= 20));

  const effectiveTheme: 'light' | 'dark' | 'amoled' = 
    themeMode === 'light' && !isAutoBatteryTriggered
      ? 'light'
      : themeMode === 'amoled' || isAutoBatteryTriggered
      ? 'amoled'
      : 'dark';

  // Apply Theme CSS Class to document
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    
    root.classList.remove('theme-light', 'theme-amoled');
    body.classList.remove('theme-light', 'theme-amoled');

    if (effectiveTheme === 'light') {
      root.classList.add('theme-light');
      body.classList.add('theme-light');
    } else if (effectiveTheme === 'amoled') {
      root.classList.add('theme-amoled');
      body.classList.add('theme-amoled');
    }
  }, [effectiveTheme]);

  // Persist Theme Selection
  useEffect(() => {
    saveThemeMode(themeMode);
  }, [themeMode]);

  // Find active selected region
  const selectedRegion = regions.find((r) => r.id === selectedRegionId) || regions[0] || INITIAL_REGIONS[0];
  const currentForecast = selectedRegion.forecasts[selectedDayIndex] || selectedRegion.forecasts[0];

  // Save changes to localStorage
  useEffect(() => {
    saveStoredRegions(regions);
  }, [regions]);

  useEffect(() => {
    saveSelectedRegionId(selectedRegionId);
  }, [selectedRegionId]);

  useEffect(() => {
    saveChecklist(checklist);
  }, [checklist]);

  useEffect(() => {
    saveCrowdReports(crowdReports);
  }, [crowdReports]);

  useEffect(() => {
    saveAlerts(alerts);
  }, [alerts]);

  useEffect(() => {
    saveInverterDevices(inverterDevices);
  }, [inverterDevices]);

  useEffect(() => {
    saveNotificationSettings(notificationSettings);
  }, [notificationSettings]);

  // Handle Refresh Grid Data Simulation
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      // Re-sync region forecasts with active phone date/time
      setRegions((prev) => syncRegionsWithActivePhoneDate(prev));
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastSyncedTime(now);
    }, 600);
  };

  // Re-sync date when tab/app gains visibility (e.g. waking phone up or returning to app)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setRegions((prev) => syncRegionsWithActivePhoneDate(prev));
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Region selection
  const handleSelectRegion = (region: Region) => {
    setSelectedRegionId(region.id);
    setSelectedDayIndex(0); // Reset to today
  };

  // Checklist handlers
  const handleToggleChecklist = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const handleAddChecklist = (item: ChecklistItem) => {
    setChecklist((prev) => [item, ...prev]);
  };

  const handleResetChecklist = () => {
    setChecklist((prev) => prev.map((item) => ({ ...item, completed: false })));
  };

  // Inverter device updates
  const handleUpdateInverterDevice = (id: string, count: number) => {
    setInverterDevices((prev) =>
      prev.map((dev) => (dev.id === id ? { ...dev, count } : dev))
    );
  };

  // Crowd reporting handlers
  const handleAddCrowdReport = (report: CrowdReport) => {
    setCrowdReports((prev) => [report, ...prev]);
    if (notificationSettings.outageAlerts) {
      sendBrowserNotification(`🚨 New Outage Report: ${report.streetName}`, {
        body: `${report.outageType} reported in ${selectedRegion.name}.`,
      });
    }
  };

  const handleVerifyCrowdReport = (id: string) => {
    setCrowdReports((prev) =>
      prev.map((rep) =>
        rep.id === id
          ? {
              ...rep,
              verifiedCount: rep.userVerified ? rep.verifiedCount - 1 : rep.verifiedCount + 1,
              userVerified: !rep.userVerified,
            }
          : rep
      )
    );
  };

  // Admin Outage Simulator Actions
  const handleSimulateOutage = (type: 'blowout' | 'tree-trim' | 'storm' | 'restore') => {
    if (type === 'restore' && notificationSettings.gridRestoration) {
      sendBrowserNotification('⚡ CurrentCast: Power Grid Restored (230V)', {
        body: `Power Grid in ${selectedRegion.name} restored to 100% normalcy. All feeders re-energized.`,
      });
    } else if (type === 'blowout' && notificationSettings.outageAlerts) {
      sendBrowserNotification('🚨 CurrentCast: Emergency Transformer Blowout', {
        body: `Emergency blackout in ${selectedRegion.name} on ${selectedRegion.feederCode}. Linemen dispatched.`,
      });
    } else if (type === 'tree-trim' && notificationSettings.outageAlerts) {
      sendBrowserNotification('⚠️ CurrentCast: Maintenance Cut Scheduled', {
        body: `Scheduled feeder line tree trimming cut for ${selectedRegion.name} from 09:00 AM to 02:00 PM.`,
      });
    } else if (type === 'storm' && notificationSettings.outageAlerts) {
      sendBrowserNotification('⛈️ CurrentCast: Monsoon Storm Squall Warning', {
        body: `High probability of substation tripping in ${selectedRegion.name} between 4:00 PM and 8:00 PM.`,
      });
    }

    setRegions((prevRegions) => {
      return prevRegions.map((reg) => {
        if (reg.id !== selectedRegion.id) return reg;

        const updatedForecasts = [...reg.forecasts];
        const todayForecast = { ...updatedForecasts[0] };

        if (type === 'blowout') {
          todayForecast.status = 'OUTAGE_FAULT';
          todayForecast.outageRiskScore = 99;
          todayForecast.summary = 'EMERGENCY: 250kVA Transformer Blowout in Sector 3. Immediate blackout across 11kV Feeder.';
          todayForecast.scheduledCut = {
            from: 'NOW',
            to: '22:00 (10:00 PM)',
            substation: reg.substation,
            purpose: 'Emergency transformer replacement & oil cleanup',
            officialNoticeNo: `TNEB/SOS/${Date.now().toString().slice(-4)}`,
          };
          todayForecast.blocks = [
            {
              id: `sim-${Date.now()}`,
              startTime: '10:00 AM',
              endTime: '10:00 PM',
              status: 'OUTAGE_FAULT',
              label: 'TRANSFORMER BLOWOUT OUTAGE',
              subtext: 'Linemen en route with replacement 250kVA transformer unit',
              probability: 100,
              feederLine: reg.feederCode,
              affectedTransformers: 24,
              expectedRestoration: '10:00 PM',
              iconType: 'outage',
            },
          ];
        } else if (type === 'tree-trim') {
          todayForecast.status = 'MAINTENANCE';
          todayForecast.outageRiskScore = 85;
          todayForecast.summary = 'Scheduled Feeder Line Tree Trimming and Insulator Overhaul from 09:00 AM to 02:00 PM.';
          todayForecast.scheduledCut = {
            from: '09:00 AM',
            to: '02:00 PM',
            substation: reg.substation,
            purpose: 'Vegetation clearance under 11kV transmission conductors',
            officialNoticeNo: `TNEB/MAINT/${Date.now().toString().slice(-4)}`,
          };
        } else if (type === 'storm') {
          todayForecast.status = 'STORM_RISK';
          todayForecast.outageRiskScore = 90;
          todayForecast.summary = 'Monsoon Thunderstorm Squall Warning: High probability of substation line tripping between 4:00 PM and 8:00 PM.';
        } else if (type === 'restore') {
          todayForecast.status = 'NORMAL';
          todayForecast.outageRiskScore = 8;
          todayForecast.summary = 'Power Grid Restored to 100% Normalcy (230V Stable). All feeders re-energized.';
          todayForecast.scheduledCut = undefined;
          todayForecast.blocks = [
            {
              id: `sim-restore-${Date.now()}`,
              startTime: '12:00 AM',
              endTime: '11:59 PM',
              status: 'NORMAL',
              label: 'NORMAL POWER RESUMED',
              subtext: 'All residential and commercial feeders energized safely',
              probability: 5,
              iconType: 'sun',
            },
          ];
        }

        updatedForecasts[0] = todayForecast;
        return { ...reg, forecasts: updatedForecasts };
      });
    });
  };

  const handlePostCustomAlert = (newAlert: UtilityAlert) => {
    setAlerts((prev) => [newAlert, ...prev]);
    if (notificationSettings.outageAlerts) {
      sendBrowserNotification(`📢 Grid Advisory: ${newAlert.title}`, {
        body: newAlert.message,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#121820] text-slate-100 flex flex-col font-sans selection:bg-[#4285F4] selection:text-white transition-colors duration-300">
      {/* Splash Intro Animation */}
      <AppIntroOutroAnimation
        isLaunching={isLaunching}
        onLaunchComplete={() => setIsLaunching(false)}
      />

      {/* Top Header with Theme Switcher and Live Battery Status */}
      <Header
        connectivityMode={connectivityMode}
        onToggleConnectivity={setConnectivityMode}
        lastSyncedTime={lastSyncedTime}
        alerts={alerts}
        onOpenAdmin={() => setAdminModalOpen(true)}
        onOpenEmergency={() => setEmergencyModalOpen(true)}
        onOpenSettings={() => setSettingsModalOpen(true)}
        onRefreshData={handleRefresh}
        isRefreshing={isRefreshing}
        themeMode={themeMode}
        onToggleTheme={setThemeMode}
        batteryState={batteryState}
      />

      {/* Auto Battery Saver Trigger Notification Pill */}
      {isAutoBatteryTriggered && (
        <div className="bg-black/90 border-b border-[#FBBC05]/40 text-[#FBBC05] px-4 py-1.5 text-xs font-bold flex items-center justify-between gap-2 shadow-md">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#FBBC05] animate-pulse" />
              <span>
                <strong>AMOLED Battery Saver Active:</strong> Low battery detected ({batteryState.percentage}% • {batteryState.charging ? 'Charging' : 'Discharging'}). Pure black 0W display enabled.
              </span>
            </div>
            <button
              onClick={() => setThemeMode('light')}
              className="underline text-[11px] hover:text-white text-slate-400 shrink-0 font-medium"
            >
              Switch to Light
            </button>
          </div>
        </div>
      )}

      {/* Offline Alert Banner if in Offline Mode */}
      {connectivityMode === 'offline' && (
        <div className="bg-[#1A222D] text-[#FBBC05] px-4 py-2 text-xs font-bold text-center flex items-center justify-center gap-2 border-b border-[#2E3A4B]">
          <WifiOff className="w-3.5 h-3.5" />
          <span>
            Offline Mode Active: Operating purely on cached historical pattern intelligence & IndexedDB storage.
          </span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-5 sm:space-y-6">
        {/* 1. Location / Substation Selector */}
        <RegionSelector
          regions={regions}
          selectedRegion={selectedRegion}
          onSelectRegion={handleSelectRegion}
        />

        {/* 2. Weather-Style Status Hero Banner with Google Weather Mascot Dynamic Landscape */}
        <ForecastHero
          region={selectedRegion}
          forecast={currentForecast}
          onOpenReport={() => {
            const crowdSection = document.getElementById('crowd-section');
            if (crowdSection) crowdSection.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 3. Double-Vulnerability Dead-Zone Alert */}
        <DeadZoneWarning
          region={selectedRegion}
          onOpenEmergency={() => setEmergencyModalOpen(true)}
        />

        {/* 4. 24-Hour Electricity & Risk Timeline (Google Weather Horizontal Scroll + Vertical Rail) */}
        <ForecastTimeline
          forecasts={selectedRegion.forecasts}
          selectedDayIndex={selectedDayIndex}
          onSelectDayIndex={setSelectedDayIndex}
        />

        {/* 5. Pre-Outage Action Checklist Carousel */}
        <PreOutageChecklist
          items={checklist}
          onToggleItem={handleToggleChecklist}
          onAddItem={handleAddChecklist}
          onResetItems={handleResetChecklist}
          onNavigateToHubs={() => {
            const hubSection = document.getElementById('watt-next-guide');
            if (hubSection) hubSection.scrollIntoView({ behavior: 'smooth' });
          }}
          timeWindow={
            currentForecast.scheduledCut
              ? `${currentForecast.scheduledCut.from} - ${currentForecast.scheduledCut.to}`
              : '4:00 PM - 8:00 PM'
          }
        />

        {/* 6. Historical Pattern Analyzer (Offline Cached Intelligence) */}
        <HistoricalPatternCard region={selectedRegion} />

        {/* 7. "WattNext" Outage Lifestyle, Power Nearby & Inverter Guide */}
        <WattNextGuide
          powerHubs={INITIAL_POWER_HUBS}
          activities={INITIAL_OFFLINE_ACTIVITIES}
          inverterDevices={inverterDevices}
          onUpdateInverterDevice={handleUpdateInverterDevice}
        />

        {/* 8. Crowd-Verified Blackout Reports */}
        <div id="crowd-section">
          <CrowdReporting
            region={selectedRegion}
            reports={crowdReports}
            onAddReport={handleAddCrowdReport}
            onVerifyReport={handleVerifyCrowdReport}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-8 bg-[#1A222D] border-t border-[#2E3A4B] py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white">CurrentCast</span>
            <span>• Weather Report For Blackouts & Grid Intelligence</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => setSettingsModalOpen(true)}
              className="text-slate-300 hover:text-white font-bold transition-colors"
            >
              Theme & Battery Settings
            </button>
            <span className="flex items-center gap-1 text-[#34A853] font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Offline-First PWA Cache Ready</span>
            </span>
            <button
              onClick={() => setAdminModalOpen(true)}
              className="text-[#4285F4] hover:underline font-bold"
            >
              TNEB Simulator Panel
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        settings={notificationSettings}
        onUpdateSettings={setNotificationSettings}
        themeMode={themeMode}
        onUpdateTheme={setThemeMode}
        batteryState={batteryState}
        onSimulateBattery={simulateBattery}
        onClearSimulatedBattery={clearSimulatedBattery}
      />

      <AdminSimulationModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        region={selectedRegion}
        onSimulateOutage={handleSimulateOutage}
        onPostCustomAlert={handlePostCustomAlert}
      />

      <EmergencyOfflineModal
        isOpen={emergencyModalOpen}
        onClose={() => setEmergencyModalOpen(false)}
        region={selectedRegion}
      />
    </div>
  );
}

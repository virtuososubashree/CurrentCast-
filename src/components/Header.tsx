import React from 'react';
import { Logo } from './Logo';
import { ConnectivityMode, UtilityAlert, ThemeMode, BatteryState } from '../types';
import { useLivePhoneTime } from '../utils/dateUtils';
import { 
  Wifi, 
  WifiOff, 
  SignalLow, 
  Bell, 
  ShieldAlert, 
  SlidersHorizontal,
  RefreshCw,
  Share2, 
  Check, 
  Settings,
  Calendar,
  Sun,
  Moon,
  BatteryCharging,
  BatteryMedium,
  BatteryWarning,
  Zap,
  Clock
} from 'lucide-react';

interface HeaderProps {
  connectivityMode: ConnectivityMode;
  onToggleConnectivity: (mode: ConnectivityMode) => void;
  lastSyncedTime: string;
  alerts: UtilityAlert[];
  onOpenAdmin: () => void;
  onOpenEmergency: () => void;
  onOpenSettings?: () => void;
  onOpenCalendarSync?: () => void;
  onRefreshData: () => void;
  isRefreshing: boolean;
  themeMode: ThemeMode;
  onToggleTheme: (mode: ThemeMode) => void;
  batteryState: BatteryState;
}

export const Header: React.FC<HeaderProps> = ({
  connectivityMode,
  onToggleConnectivity,
  lastSyncedTime,
  alerts,
  onOpenAdmin,
  onOpenEmergency,
  onOpenSettings,
  onOpenCalendarSync,
  onRefreshData,
  isRefreshing,
  themeMode,
  onToggleTheme,
  batteryState,
}) => {
  const [copied, setCopied] = React.useState(false);
  const [showAlertDropdown, setShowAlertDropdown] = React.useState(false);
  const [showThemeMenu, setShowThemeMenu] = React.useState(false);
  
  // Real-time phone clock
  const { shortTime, formattedDate } = useLivePhoneTime();

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'CurrentCast: Weather Report for Blackouts',
        text: 'Live power outage forecast & substation grid telemetry for Kurinjipadi and Tamil Nadu electrical circles.',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const cycleTheme = () => {
    if (themeMode === 'dark') onToggleTheme('light');
    else if (themeMode === 'light') onToggleTheme('amoled');
    else if (themeMode === 'amoled') onToggleTheme('auto');
    else onToggleTheme('dark');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#121820]/90 backdrop-blur-xl border-b border-[#2E3A4B]/60 shadow-lg transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <Logo size="md" />

        {/* Right Action Center */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Live Device Clock & Calendar Badge */}
          <div 
            id="device-live-clock-badge"
            title={`Active Device Date & Time: ${formattedDate}, ${shortTime} • Real-time grid sync`}
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1 rounded-2xl text-xs font-extrabold bg-[#1A222D] border border-[#2E3A4B] text-slate-200 select-none shadow-xs"
          >
            <span className="w-2 h-2 rounded-full bg-[#34A853] animate-pulse" />
            <Clock className="w-3.5 h-3.5 text-[#4285F4]" />
            <span>{shortTime}</span>
            <span className="text-slate-500 font-normal">•</span>
            <span className="text-slate-300 font-medium">{formattedDate}</span>
          </div>

          {/* Live Device Battery Saver Status Badge */}
          <div 
            id="battery-saver-indicator"
            onClick={onOpenSettings}
            title={
              batteryState.isBatterySaver
                ? `Battery Saver Active (${batteryState.percentage}% - Discharging). Click to adjust power settings.`
                : `Device Battery: ${batteryState.percentage}% (${batteryState.charging ? 'Charging' : 'Discharging'}). Click to adjust power settings.`
            }
            className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-2xl text-xs font-bold border cursor-pointer transition-all ${
              batteryState.isBatterySaver
                ? 'bg-[#EA4335]/20 border-[#EA4335]/50 text-[#EA4335] animate-pulse shadow-xs'
                : batteryState.percentage <= 20
                ? 'bg-[#FBBC05]/20 border-[#FBBC05]/50 text-[#FBBC05]'
                : 'bg-[#1A222D] border-[#2E3A4B] text-slate-300 hover:text-white'
            }`}
          >
            {batteryState.charging ? (
              <BatteryCharging className="w-3.5 h-3.5 text-[#34A853]" />
            ) : batteryState.isBatterySaver ? (
              <BatteryWarning className="w-3.5 h-3.5 text-[#EA4335]" />
            ) : (
              <BatteryMedium className="w-3.5 h-3.5 text-[#FBBC05]" />
            )}
            <span>{batteryState.percentage}%</span>
            {batteryState.isBatterySaver && (
              <span className="text-[10px] uppercase tracking-wider bg-[#EA4335] text-white px-1.5 py-0.2 rounded-md font-black">
                Saver On
              </span>
            )}
          </div>

          {/* Light / Dark / Battery Saver AMOLED Theme Switcher */}
          <div className="relative">
            <button
              id="theme-toggle-btn"
              onClick={cycleTheme}
              onContextMenu={(e) => {
                e.preventDefault();
                setShowThemeMenu(!showThemeMenu);
              }}
              title={`Current Theme: ${
                themeMode === 'light'
                  ? 'Light Mode (Daylight)'
                  : themeMode === 'amoled'
                  ? 'AMOLED Battery Saver (Pure Black)'
                  : themeMode === 'auto'
                  ? 'Auto (Battery Saver Smart Mode)'
                  : 'Dark Mode (Default Slate)'
              }. Click to toggle or right-click.`}
              className={`p-2 rounded-2xl border transition-all flex items-center gap-1 text-xs font-bold ${
                themeMode === 'light'
                  ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                  : themeMode === 'amoled'
                  ? 'bg-black text-[#FBBC05] border-[#FBBC05]/50 hover:border-[#FBBC05]'
                  : themeMode === 'auto'
                  ? 'bg-[#4285F4]/20 text-[#4285F4] border-[#4285F4]/40 hover:bg-[#4285F4]/30'
                  : 'bg-[#1A222D] text-slate-300 hover:text-white hover:bg-[#222C3A] border-[#2E3A4B]'
              }`}
            >
              {themeMode === 'light' ? (
                <Sun className="w-4 h-4 text-amber-600" />
              ) : themeMode === 'amoled' ? (
                <Zap className="w-4 h-4 text-[#FBBC05]" />
              ) : themeMode === 'auto' ? (
                <div className="flex items-center gap-0.5">
                  <Moon className="w-3.5 h-3.5 text-[#4285F4]" />
                  <span className="text-[10px] font-extrabold uppercase">Auto</span>
                </div>
              ) : (
                <Moon className="w-4 h-4 text-slate-300" />
              )}
            </button>

            {showThemeMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-[#1A222D] rounded-2xl shadow-2xl border border-[#2E3A4B] p-2 z-50 animate-in fade-in space-y-1">
                <div className="px-2 py-1 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  Select Display Theme
                </div>
                <button
                  onClick={() => { onToggleTheme('light'); setShowThemeMenu(false); }}
                  className={`w-full px-2.5 py-1.5 rounded-xl text-left text-xs font-bold flex items-center gap-2 transition-colors ${
                    themeMode === 'light' ? 'bg-amber-100 text-amber-950' : 'text-slate-200 hover:bg-[#222C3A]'
                  }`}
                >
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>Light (Daylight High-Contrast)</span>
                </button>
                <button
                  onClick={() => { onToggleTheme('dark'); setShowThemeMenu(false); }}
                  className={`w-full px-2.5 py-1.5 rounded-xl text-left text-xs font-bold flex items-center gap-2 transition-colors ${
                    themeMode === 'dark' ? 'bg-[#4285F4]/20 text-[#4285F4]' : 'text-slate-200 hover:bg-[#222C3A]'
                  }`}
                >
                  <Moon className="w-4 h-4 text-slate-300" />
                  <span>Dark (Slate Navy Default)</span>
                </button>
                <button
                  onClick={() => { onToggleTheme('amoled'); setShowThemeMenu(false); }}
                  className={`w-full px-2.5 py-1.5 rounded-xl text-left text-xs font-bold flex items-center gap-2 transition-colors ${
                    themeMode === 'amoled' ? 'bg-black text-[#FBBC05] border border-[#FBBC05]/40' : 'text-slate-200 hover:bg-[#222C3A]'
                  }`}
                >
                  <Zap className="w-4 h-4 text-[#FBBC05]" />
                  <span>AMOLED Saver (0W Pure Black)</span>
                </button>
                <button
                  onClick={() => { onToggleTheme('auto'); setShowThemeMenu(false); }}
                  className={`w-full px-2.5 py-1.5 rounded-xl text-left text-xs font-bold flex items-center gap-2 transition-colors ${
                    themeMode === 'auto' ? 'bg-[#34A853]/20 text-[#34A853]' : 'text-slate-200 hover:bg-[#222C3A]'
                  }`}
                >
                  <BatteryWarning className="w-4 h-4 text-[#34A853]" />
                  <span>Auto (Detect Battery Saver)</span>
                </button>
              </div>
            )}
          </div>

          {/* Hybrid Online-Offline Mode Selector Pill */}
          <div className="relative inline-flex items-center bg-[#1A222D] p-1 rounded-2xl border border-[#2E3A4B]">
            <button
              id="mode-online-btn"
              onClick={() => onToggleConnectivity('online')}
              title="Online Live Cloud Sync"
              className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                connectivityMode === 'online'
                  ? 'bg-[#34A853] text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
              <Wifi className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Live Synced</span>
            </button>

            <button
              id="mode-lowband-btn"
              onClick={() => onToggleConnectivity('low-bandwidth')}
              title="Low-Bandwidth (Text Only Mode)"
              className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                connectivityMode === 'low-bandwidth'
                  ? 'bg-[#FBBC05] text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <SignalLow className="w-3.5 h-3.5" />
              <span className="hidden md:inline">2G Low-Data</span>
            </button>

            <button
              id="mode-offline-btn"
              onClick={() => onToggleConnectivity('offline')}
              title="Offline (Local Cache Active - No Internet Needed)"
              className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                connectivityMode === 'offline'
                  ? 'bg-[#4285F4] text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <WifiOff className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden md:inline">Offline Cache</span>
            </button>
          </div>

          {/* Refresh Grid Telemetry Button */}
          <button
            id="refresh-grid-btn"
            onClick={onRefreshData}
            title={`Last synced: ${lastSyncedTime}. Click to re-sync.`}
            className={`p-2 rounded-2xl bg-[#1A222D] text-slate-300 hover:text-white hover:bg-[#222C3A] border border-[#2E3A4B] transition-colors ${
              isRefreshing ? 'animate-spin text-[#4285F4]' : ''
            }`}
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Google Calendar Sync Button */}
          {onOpenCalendarSync && (
            <button
              id="calendar-sync-header-btn"
              onClick={onOpenCalendarSync}
              title="Sync Outage Windows to Google Calendar"
              className="p-2 rounded-2xl bg-[#1A222D] text-[#4285F4] hover:bg-[#4285F4]/20 border border-[#2E3A4B] transition-colors flex items-center gap-1 font-semibold text-xs"
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden lg:inline text-slate-200">Calendar</span>
            </button>
          )}

          {/* Emergency Toolkit SOS Button */}
          <button
            id="emergency-toolkit-btn"
            onClick={onOpenEmergency}
            title="Dead-Zone Emergency SOS & Flashlight"
            className="px-2.5 py-1.5 rounded-2xl text-[#EA4335] bg-[#EA4335]/15 hover:bg-[#EA4335]/25 transition-colors border border-[#EA4335]/40 flex items-center gap-1.5 font-bold text-xs"
          >
            <ShieldAlert className="w-4 h-4 text-[#EA4335]" />
            <span className="hidden sm:inline">SOS</span>
          </button>

          {/* Utility Alerts Dropdown */}
          <div className="relative">
            <button
              id="alerts-bell-btn"
              onClick={() => setShowAlertDropdown(!showAlertDropdown)}
              className="relative p-2 rounded-2xl bg-[#1A222D] text-slate-300 hover:text-white hover:bg-[#222C3A] transition-colors border border-[#2E3A4B]"
              title="TNEB Grid Notices"
            >
              <Bell className="w-4 h-4" />
              {alerts.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FBBC05] text-slate-950 text-[10px] font-black rounded-full flex items-center justify-center animate-pulse">
                  {alerts.length}
                </span>
              )}
            </button>

            {showAlertDropdown && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#1A222D] rounded-3xl shadow-2xl border border-[#2E3A4B] p-4 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-3 border-b border-[#2E3A4B]">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-[#FBBC05]" />
                    <h4 className="font-extrabold text-white text-sm">Official Grid Advisories</h4>
                  </div>
                  <span className="text-[11px] font-bold text-slate-300 bg-[#222C3A] px-2.5 py-0.5 rounded-full border border-[#2E3A4B]">
                    {alerts.length} Active
                  </span>
                </div>

                <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {alerts.map((alt) => (
                    <div
                      key={alt.id}
                      className={`p-3 rounded-2xl border text-xs ${
                        alt.type === 'CRITICAL'
                          ? 'bg-[#EA4335]/15 border-[#EA4335]/40 text-rose-200'
                          : alt.type === 'WARNING'
                          ? 'bg-[#FBBC05]/15 border-[#FBBC05]/40 text-amber-200'
                          : 'bg-[#4285F4]/15 border-[#4285F4]/40 text-blue-200'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold mb-1">
                        <span className="text-white">{alt.title}</span>
                        <span className="text-[10px] opacity-75 font-mono">{alt.timestamp}</span>
                      </div>
                      <p className="leading-relaxed opacity-90">{alt.message}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {alt.affectedAreas.map((area, idx) => (
                          <span
                            key={idx}
                            className="bg-[#121820]/60 px-2 py-0.5 rounded-lg text-[10px] font-medium border border-[#2E3A4B]"
                          >
                            📍 {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-3 pt-2 border-t border-[#2E3A4B] text-center">
                  <button
                    onClick={() => setShowAlertDropdown(false)}
                    className="text-xs text-slate-400 hover:text-white font-medium"
                  >
                    Close Advisories
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* TNEB Admin Simulator Trigger */}
          <button
            id="admin-sim-btn"
            onClick={onOpenAdmin}
            title="Electricity Board Outage Simulator"
            className="px-3 py-1.5 rounded-2xl bg-[#4285F4] hover:bg-[#3367D6] text-white text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-md active:scale-95"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Grid Admin</span>
          </button>

          {/* Settings Modal Trigger */}
          {onOpenSettings && (
            <button
              id="settings-btn"
              onClick={onOpenSettings}
              className="p-2 rounded-2xl bg-[#1A222D] text-slate-300 hover:text-white hover:bg-[#222C3A] transition-colors border border-[#2E3A4B]"
              title="Notification & Battery Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}

          {/* Quick Share */}
          <button
            id="share-app-btn"
            onClick={handleShare}
            className="p-2 rounded-2xl bg-[#1A222D] text-slate-300 hover:text-white hover:bg-[#222C3A] transition-colors border border-[#2E3A4B]"
            title="Share CurrentCast"
          >
            {copied ? <Check className="w-4 h-4 text-[#34A853]" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};

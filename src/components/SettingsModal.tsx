import React, { useState } from 'react';
import { NotificationSettings, ThemeMode, BatteryState } from '../types';
import { 
  getNotificationPermission, 
  requestNotificationPermission, 
  sendBrowserNotification,
  isNotificationSupported
} from '../utils/notifications';
import { 
  Settings, 
  Bell, 
  Zap, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  ShieldCheck,
  Volume2,
  Info,
  Sun,
  Moon,
  BatteryCharging,
  BatteryMedium,
  BatteryWarning,
  Sliders,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: NotificationSettings;
  onUpdateSettings: (newSettings: NotificationSettings) => void;
  themeMode: ThemeMode;
  onUpdateTheme: (theme: ThemeMode) => void;
  batteryState: BatteryState;
  onSimulateBattery: (level: number, charging: boolean) => void;
  onClearSimulatedBattery: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  themeMode,
  onUpdateTheme,
  batteryState,
  onSimulateBattery,
  onClearSimulatedBattery,
}) => {
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>(
    getNotificationPermission()
  );
  const [testSent, setTestSent] = useState(false);
  const [activeTab, setActiveTab] = useState<'theme' | 'notifications'>('theme');

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    const res = await requestNotificationPermission();
    setPermission(res);
    if (res === 'granted') {
      sendBrowserNotification('⚡ CurrentCast: Notifications Active', {
        body: 'You will now receive alerts for Grid Restoration and Outage changes.',
      });
      setTestSent(true);
      setTimeout(() => setTestSent(false), 3000);
    }
  };

  const handleSendTestNotification = () => {
    if (permission === 'granted') {
      sendBrowserNotification('⚡ CurrentCast: 230V Grid Restored', {
        body: 'All residential and commercial feeders energized safely (Test Alert).',
      });
      setTestSent(true);
      setTimeout(() => setTestSent(false), 3000);
    } else {
      handleRequestPermission();
    }
  };

  const handleToggle = (key: keyof NotificationSettings) => {
    const updated = {
      ...settings,
      [key]: !settings[key],
    };
    onUpdateSettings(updated);

    // If user turned on and permission not yet granted, prompt for permission
    if (updated[key] && permission === 'default') {
      handleRequestPermission();
    }
  };

  const supported = isNotificationSupported();

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div 
        className="bg-[#1A222D] rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 shadow-2xl border border-[#2E3A4B] space-y-5 text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#2E3A4B]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#4285F4]/20 border border-[#4285F4]/40 text-[#4285F4] flex items-center justify-center shadow-xs">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-lg">
                Preferences & Battery Optimization
              </h3>
              <p className="text-xs text-slate-400">
                Display theme, battery saver triggers & real-time alerts
              </p>
            </div>
          </div>

          <button
            id="close-settings-modal-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#121820] hover:bg-[#222C3A] text-slate-400 hover:text-white flex items-center justify-center transition-colors font-bold border border-[#2E3A4B]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 bg-[#121820] p-1 rounded-2xl border border-[#2E3A4B]">
          <button
            id="tab-theme-btn"
            onClick={() => setActiveTab('theme')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'theme'
                ? 'bg-[#4285F4] text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sun className="w-4 h-4" />
            <span>Theme & Battery Saver</span>
          </button>
          <button
            id="tab-alerts-btn"
            onClick={() => setActiveTab('notifications')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'notifications'
                ? 'bg-[#4285F4] text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Outage Alerts</span>
          </button>
        </div>

        {activeTab === 'theme' ? (
          <div className="space-y-4">
            {/* Live Device Battery Sensor Telemetry Card */}
            <div className="p-4 rounded-2xl bg-[#121820] border border-[#2E3A4B] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {batteryState.charging ? (
                    <BatteryCharging className="w-5 h-5 text-[#34A853] animate-pulse" />
                  ) : batteryState.isBatterySaver ? (
                    <BatteryWarning className="w-5 h-5 text-[#EA4335]" />
                  ) : (
                    <BatteryMedium className="w-5 h-5 text-[#FBBC05]" />
                  )}
                  <span className="font-extrabold text-sm text-white">Live Device Battery Telemetry</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {batteryState.isSimulated && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Simulated
                    </span>
                  )}
                  <span className={`px-2.5 py-0.5 rounded-full font-extrabold text-xs ${
                    batteryState.isBatterySaver
                      ? 'bg-[#EA4335]/20 text-[#EA4335] border border-[#EA4335]/40'
                      : batteryState.charging
                      ? 'bg-[#34A853]/20 text-[#34A853] border border-[#34A853]/40'
                      : 'bg-[#4285F4]/20 text-[#4285F4] border border-[#4285F4]/40'
                  }`}>
                    {batteryState.percentage}% {batteryState.charging ? '• Charging' : '• Discharging'}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[#1A222D] h-2.5 rounded-full overflow-hidden border border-[#2E3A4B]/60 p-0.5">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    batteryState.percentage <= 20 
                      ? 'bg-[#EA4335]' 
                      : batteryState.percentage <= 50 
                      ? 'bg-[#FBBC05]' 
                      : 'bg-[#34A853]'
                  }`}
                  style={{ width: `${Math.max(5, Math.min(100, batteryState.percentage))}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Hardware API: {batteryState.isSupported ? 'Native Web Battery Sensor Connected' : 'Emulated Fallback Engine'}</span>
                <span>Saver State: {batteryState.isBatterySaver ? '🔴 Active (Low Power)' : '🟢 Normal Power'}</span>
              </div>

              {/* Simulation Quick Toggles */}
              <div className="pt-2 border-t border-[#2E3A4B]/60 flex flex-wrap items-center gap-2">
                <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                  <Sliders className="w-3 h-3 text-[#4285F4]" />
                  Test Battery:
                </span>
                <button
                  id="sim-low-battery-btn"
                  onClick={() => onSimulateBattery(14, false)}
                  className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-[#EA4335]/15 hover:bg-[#EA4335]/25 text-rose-300 border border-[#EA4335]/30 transition-colors"
                >
                  ⚡ Simulate 14% (Low Battery)
                </button>
                <button
                  id="sim-full-battery-btn"
                  onClick={() => onSimulateBattery(95, true)}
                  className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-[#34A853]/15 hover:bg-[#34A853]/25 text-emerald-300 border border-[#34A853]/30 transition-colors"
                >
                  🔌 Simulate 95% (Charging)
                </button>
                {batteryState.isSimulated && (
                  <button
                    id="reset-battery-btn"
                    onClick={onClearSimulatedBattery}
                    className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-[#1A222D] hover:bg-[#222C3A] text-slate-300 border border-[#2E3A4B] flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Theme Mode Selector Grid */}
            <div className="space-y-2.5">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Display Theme Mode
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {/* 1. Light Mode */}
                <button
                  id="theme-select-light"
                  onClick={() => onUpdateTheme('light')}
                  className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                    themeMode === 'light'
                      ? 'bg-amber-100 text-amber-950 border-amber-400 shadow-md ring-2 ring-amber-400/40'
                      : 'bg-[#121820] text-slate-200 border-[#2E3A4B] hover:border-slate-400'
                  }`}
                >
                  <div className={`p-2 rounded-xl ${themeMode === 'light' ? 'bg-amber-200 text-amber-800' : 'bg-[#1A222D] text-amber-400'}`}>
                    <Sun className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-extrabold text-xs">Daylight (Light Mode)</div>
                    <div className={`text-[11px] leading-tight mt-0.5 ${themeMode === 'light' ? 'text-amber-800' : 'text-slate-400'}`}>
                      High-contrast sunlight visibility for field inspection.
                    </div>
                  </div>
                </button>

                {/* 2. Dark Mode */}
                <button
                  id="theme-select-dark"
                  onClick={() => onUpdateTheme('dark')}
                  className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                    themeMode === 'dark'
                      ? 'bg-[#4285F4]/15 text-white border-[#4285F4] shadow-md ring-2 ring-[#4285F4]/40'
                      : 'bg-[#121820] text-slate-200 border-[#2E3A4B] hover:border-slate-400'
                  }`}
                >
                  <div className={`p-2 rounded-xl ${themeMode === 'dark' ? 'bg-[#4285F4] text-white' : 'bg-[#1A222D] text-slate-400'}`}>
                    <Moon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-extrabold text-xs text-white">Default Dark (Slate)</div>
                    <div className="text-[11px] text-slate-400 leading-tight mt-0.5">
                      Material You deep slate palette for evening usage.
                    </div>
                  </div>
                </button>

                {/* 3. AMOLED Battery Saver Mode */}
                <button
                  id="theme-select-amoled"
                  onClick={() => onUpdateTheme('amoled')}
                  className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                    themeMode === 'amoled'
                      ? 'bg-black text-[#FBBC05] border-[#FBBC05] shadow-md ring-2 ring-[#FBBC05]/40'
                      : 'bg-[#121820] text-slate-200 border-[#2E3A4B] hover:border-slate-400'
                  }`}
                >
                  <div className={`p-2 rounded-xl ${themeMode === 'amoled' ? 'bg-[#FBBC05] text-slate-950' : 'bg-[#1A222D] text-[#FBBC05]'}`}>
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-extrabold text-xs">AMOLED Saver (Pure #000)</div>
                    <div className="text-[11px] text-slate-400 leading-tight mt-0.5">
                      0-Watt black pixels save up to 40% phone battery.
                    </div>
                  </div>
                </button>

                {/* 4. Auto Battery Saver Mode */}
                <button
                  id="theme-select-auto"
                  onClick={() => onUpdateTheme('auto')}
                  className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                    themeMode === 'auto'
                      ? 'bg-[#34A853]/15 text-emerald-200 border-[#34A853] shadow-md ring-2 ring-[#34A853]/40'
                      : 'bg-[#121820] text-slate-200 border-[#2E3A4B] hover:border-slate-400'
                  }`}
                >
                  <div className={`p-2 rounded-xl ${themeMode === 'auto' ? 'bg-[#34A853] text-white' : 'bg-[#1A222D] text-[#34A853]'}`}>
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-extrabold text-xs">Auto Smart Detection</div>
                    <div className="text-[11px] text-slate-400 leading-tight mt-0.5">
                      Switches to pure black automatically below 20% battery.
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Auto Battery Saver Switch */}
            <div className="p-4 rounded-2xl border border-[#2E3A4B] bg-[#121820] hover:border-[#4285F4] transition-colors flex items-center justify-between gap-3 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FBBC05]/20 text-[#FBBC05] border border-[#FBBC05]/30 flex items-center justify-center shrink-0 mt-0.5">
                  <BatteryWarning className="w-5 h-5 text-[#FBBC05]" />
                </div>
                <div className="space-y-0.5">
                  <div className="font-extrabold text-sm text-white">
                    Auto-Switch to AMOLED on Low Battery
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    When phone battery drops below 20% or battery saver is enabled, CurrentCast immediately enables pure OLED black mode to extend standby time during outages.
                  </p>
                </div>
              </div>

              <button
                id="toggle-auto-battery-saver-btn"
                type="button"
                role="switch"
                aria-checked={settings.autoBatterySaver ?? true}
                onClick={() => handleToggle('autoBatterySaver')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  (settings.autoBatterySaver ?? true) ? 'bg-[#34A853]' : 'bg-[#2E3A4B]'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    (settings.autoBatterySaver ?? true) ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Browser Permission Status Banner */}
            <div className="p-4 rounded-2xl bg-[#121820] border border-[#2E3A4B] space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-[#4285F4]" />
                  <span>Browser Notification Permission</span>
                </span>

                <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] uppercase tracking-wider ${
                  permission === 'granted'
                    ? 'bg-[#34A853]/20 text-[#34A853] border border-[#34A853]/30'
                    : permission === 'denied'
                    ? 'bg-[#EA4335]/20 text-[#EA4335] border border-[#EA4335]/30'
                    : 'bg-[#FBBC05]/20 text-[#FBBC05] border border-[#FBBC05]/30'
                }`}>
                  {permission === 'granted' ? 'Active / Granted' : permission === 'denied' ? 'Blocked / Denied' : 'Not Enabled'}
                </span>
              </div>

              <p className="text-slate-400 text-[11px] leading-relaxed">
                {permission === 'granted'
                  ? 'Browser permission is granted. Outage alerts and grid restoration updates will pop up on your desktop/device.'
                  : permission === 'denied'
                  ? 'Notifications are blocked in your browser settings. Please click the padlock icon in your address bar to allow notifications.'
                  : 'Allow notifications so CurrentCast can alert you even if this tab is in the background.'}
              </p>

              <div className="pt-1 flex items-center gap-2">
                {permission !== 'granted' && supported && (
                  <button
                    id="grant-permission-btn"
                    onClick={handleRequestPermission}
                    className="px-3.5 py-1.5 rounded-xl bg-[#4285F4] hover:bg-[#3367D6] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-transform active:scale-95"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Enable Browser Alerts</span>
                  </button>
                )}

                {permission === 'granted' && (
                  <button
                    id="send-test-notification-btn"
                    onClick={handleSendTestNotification}
                    className="px-3.5 py-1.5 rounded-xl bg-[#1A222D] border border-[#2E3A4B] hover:bg-[#222C3A] text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-[#4285F4]" />
                    <span>Send Test Alert</span>
                  </button>
                )}

                {testSent && (
                  <span className="text-xs font-bold text-[#34A853] flex items-center gap-1 animate-in fade-in">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Notification Sent!</span>
                  </span>
                )}
              </div>
            </div>

            {/* Notification Simulation Toggles */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Alert Categories
              </div>

              {/* 1. Grid Restoration */}
              <div className="p-4 rounded-2xl border border-[#2E3A4B] bg-[#121820] hover:border-[#4285F4] transition-colors flex items-center justify-between gap-3 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#34A853]/20 text-[#34A853] border border-[#34A853]/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Zap className="w-5 h-5 text-[#34A853]" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="font-extrabold text-sm text-white">
                      Grid Restoration Alerts
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Triggers when power returns, substation feeders stabilize, or full 230V normalcy is restored.
                    </p>
                  </div>
                </div>

                <button
                  id="toggle-grid-restoration-btn"
                  type="button"
                  role="switch"
                  aria-checked={settings.gridRestoration}
                  onClick={() => handleToggle('gridRestoration')}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    settings.gridRestoration ? 'bg-[#34A853]' : 'bg-[#2E3A4B]'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      settings.gridRestoration ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* 2. New Outage Alerts */}
              <div className="p-4 rounded-2xl border border-[#2E3A4B] bg-[#121820] hover:border-[#4285F4] transition-colors flex items-center justify-between gap-3 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#EA4335]/20 text-[#EA4335] border border-[#EA4335]/30 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle className="w-5 h-5 text-[#EA4335]" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="font-extrabold text-sm text-white">
                      New Outage & Fault Alerts
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Triggers on transformer blowouts, scheduled tree trimming maintenance, or monsoon storm trips.
                    </p>
                  </div>
                </div>

                <button
                  id="toggle-outage-alerts-btn"
                  type="button"
                  role="switch"
                  aria-checked={settings.outageAlerts}
                  onClick={() => handleToggle('outageAlerts')}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    settings.outageAlerts ? 'bg-[#4285F4]' : 'bg-[#2E3A4B]'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      settings.outageAlerts ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Info Box */}
            <div className="p-3.5 bg-[#4285F4]/10 border border-[#4285F4]/30 rounded-2xl flex items-start gap-2.5 text-xs text-slate-300">
              <Info className="w-4 h-4 text-[#4285F4] shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Testing Simulations:</strong> You can open the <strong>Grid Simulator</strong> in the top bar to simulate blackouts or restore power, which will trigger these browser notifications.
              </p>
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div className="pt-2 flex justify-end">
          <button
            id="done-settings-btn"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#4285F4] hover:bg-[#3367D6] text-white font-bold text-xs shadow-md active:scale-95 transition-all"
          >
            Save & Done
          </button>
        </div>
      </div>
    </div>
  );
};

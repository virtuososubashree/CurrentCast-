import React, { useState } from 'react';
import { Region, DayForecast } from '../types';
import { useLivePhoneTime } from '../utils/dateUtils';
import { BackdropVectorScene } from './BackdropVectorScenes';
import { 
  Zap, 
  AlertOctagon, 
  Clock, 
  Wind, 
  Thermometer, 
  Calendar,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  Info,
  Radio,
  MapPin,
  Sparkles
} from 'lucide-react';

interface ForecastHeroProps {
  region: Region;
  forecast: DayForecast;
  onOpenReport: () => void;
  onOpenCalendarSync?: () => void;
}

export const ForecastHero: React.FC<ForecastHeroProps> = ({
  region,
  forecast,
  onOpenReport,
  onOpenCalendarSync,
}) => {
  const [skyModeOverride, setSkyModeOverride] = useState<'auto' | 'morning' | 'afternoon' | 'evening' | 'night'>('auto');
  const [showFeederDetails, setShowFeederDetails] = useState(false);
  const { shortTime, currentHour } = useLivePhoneTime();

  const isOutage = forecast.status === 'OUTAGE_FAULT';
  const isMaintenance = forecast.status === 'MAINTENANCE';
  const isStormRisk = forecast.status === 'STORM_RISK';
  const isNormal = forecast.status === 'NORMAL' || forecast.status === 'RESTORED';

  // Calculate dynamic time of day:
  // Morning: 06:00 - 11:59
  // Afternoon: 12:00 - 16:59
  // Evening: 17:00 - 19:59
  // Night: 20:00 - 05:59
  const naturalTimeOfDay = 
    currentHour >= 6 && currentHour < 12 ? 'morning' :
    currentHour >= 12 && currentHour < 17 ? 'afternoon' :
    currentHour >= 17 && currentHour < 20 ? 'evening' : 'night';

  const activeTimeOfDay = skyModeOverride === 'auto' ? naturalTimeOfDay : skyModeOverride;

  // Derive countdown text to next event
  const getEventCountdown = () => {
    if (isOutage) {
      return forecast.scheduledCut ? 'Restoration in: 01h 15m' : 'Emergency Crew on Site: ~45m';
    }
    if (isMaintenance && forecast.scheduledCut) {
      return `Outage Window: ${forecast.scheduledCut.from} - ${forecast.scheduledCut.to}`;
    }
    if (isStormRisk) {
      return 'High Risk Squall Window: 02h 10m';
    }
    return 'Next Scheduled Cut: Safe for 24h+';
  };

  const timeSlotMeta = {
    morning: { label: 'Morning Dawn', icon: <Sunrise className="w-3.5 h-3.5 text-amber-500" />, time: '06:00 - 11:59' },
    afternoon: { label: 'Midday', icon: <Sun className="w-3.5 h-3.5 text-sky-500" />, time: '12:00 - 16:59' },
    evening: { label: 'Sunset', icon: <Sunset className="w-3.5 h-3.5 text-orange-500" />, time: '17:00 - 19:59' },
    night: { label: 'Night', icon: <Moon className="w-3.5 h-3.5 text-indigo-500" />, time: '20:00 - 05:59' },
  };

  return (
    <div className="space-y-4">
      {/* Clean, Vibrant Hero Banner Card */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-[#2E3A4B] bg-white dark:bg-[#1A222D] shadow-xl transition-all select-none">
        
        {/* Dynamic Graphic Vector Canvas Container */}
        <div className="relative h-64 sm:h-72 md:h-84 w-full overflow-hidden bg-slate-900">
          
          {/* Bespoke Graphic Vector Scene */}
          <div className="w-full h-full">
            <BackdropVectorScene timeOfDay={activeTimeOfDay} isOutage={isOutage} />
          </div>

          {/* Minimal Subtle Scrim for Contrast */}
          <div 
            className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${
              isOutage 
                ? 'bg-gradient-to-t from-red-950/60 via-transparent to-black/20' 
                : isStormRisk
                ? 'bg-gradient-to-t from-amber-950/50 via-transparent to-black/15'
                : 'bg-gradient-to-t from-black/50 via-transparent to-black/15'
            }`} 
          />

          {/* Top Floating Telemetry & Time-of-Day Switcher */}
          <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2">
            
            {/* Feeder Energized Live Status Badge */}
            <div className="bg-black/65 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/25 flex items-center gap-2 text-xs text-white shadow-lg">
              <span className={`w-2.5 h-2.5 rounded-full ${isOutage ? 'bg-[#EA4335] animate-ping' : isNormal ? 'bg-[#34A853] animate-pulse' : 'bg-[#FBBC05] animate-pulse'}`} />
              <span className="font-extrabold tracking-wide text-[11px] sm:text-xs">
                {isOutage ? 'FEEDER TRIPPED (0V)' : isStormRisk ? 'HIGH LOAD SQUALL' : isMaintenance ? 'PLANNED CUT' : 'FEEDER ENERGIZED (230V)'}
              </span>
            </div>

            {/* Time of Day Cycle Switcher */}
            <div className="flex items-center gap-1 bg-black/65 backdrop-blur-md p-1 rounded-full border border-white/20 text-white text-xs shadow-lg">
              {/* Auto Clock Button */}
              <button
                onClick={() => setSkyModeOverride('auto')}
                className={`px-2.5 py-1 rounded-full transition-all text-xs font-bold ${
                  skyModeOverride === 'auto' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
                }`}
                title="Follow Local Phone Clock"
              >
                Auto
              </button>

              {(['morning', 'afternoon', 'evening', 'night'] as const).map((slot) => {
                const isSelected = activeTimeOfDay === slot && skyModeOverride !== 'auto';
                const meta = timeSlotMeta[slot];
                return (
                  <button
                    key={slot}
                    onClick={() => setSkyModeOverride(slot)}
                    className={`px-2.5 py-1 rounded-full flex items-center gap-1 text-[11px] font-bold transition-all ${
                      isSelected
                        ? slot === 'morning'
                          ? 'bg-amber-500 text-white'
                          : slot === 'afternoon'
                          ? 'bg-sky-500 text-white'
                          : slot === 'evening'
                          ? 'bg-orange-500 text-white'
                          : 'bg-indigo-600 text-white'
                        : 'text-slate-300 hover:text-white'
                    }`}
                    title={`${meta.label} (${meta.time})`}
                  >
                    {meta.icon}
                    <span className="hidden sm:inline">{meta.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Floating Atmosphere Label */}
          <div className="absolute bottom-3 left-4 z-10 flex items-center text-xs text-white">
            <div className="flex items-center gap-2 bg-black/65 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-bold capitalize">{timeSlotMeta[activeTimeOfDay].label}</span>
              <span className="text-white/40">•</span>
              <span className="text-slate-200 text-[11px]">
                Vector Graphic Illustration ({timeSlotMeta[activeTimeOfDay].time})
              </span>
            </div>
          </div>
        </div>

        {/* Clean Hero Status Details Card */}
        <div className="p-5 sm:p-7 space-y-4 bg-white dark:bg-[#1A222D] text-slate-900 dark:text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* Status Information & Info Pills */}
            <div className="space-y-3 flex-1">
              
              {/* Minimal Info Pills Row: Location | Sync State | Countdown */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                
                {/* Location Pill */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-[#121820] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-[#2E3A4B]">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-[#4285F4]" />
                  <span>{region.name}, {region.state}</span>
                </div>

                {/* Sync State Pill */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-[#121820] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-[#2E3A4B]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-emerald-700 dark:text-emerald-300">Live Synced</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-500 dark:text-slate-400 font-normal">{shortTime}</span>
                </div>

                {/* Countdown to Next Event Pill */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-[#121820] text-amber-800 dark:text-[#FBBC05] border border-amber-200 dark:border-[#FBBC05]/30">
                  <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-[#FBBC05]" />
                  <span>{getEventCountdown()}</span>
                </div>
              </div>

              {/* Status Headline */}
              <div className="space-y-1">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                  {isOutage ? (
                    <span className="text-red-600 dark:text-[#EA4335]">CRITICAL OUTAGE IMMINENT (0V)</span>
                  ) : isStormRisk ? (
                    <span className="text-amber-600 dark:text-[#FBBC05]">HIGH SQUALL LOAD (218V)</span>
                  ) : isMaintenance ? (
                    <span className="text-amber-600 dark:text-[#FBBC05]">PLANNED MAINTENANCE (0V)</span>
                  ) : (
                    <span>STABLE GRID (230V)</span>
                  )}
                </h1>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                  {forecast.summary}
                </p>
              </div>

              {/* Weather & Load Metrics Row */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-semibold pt-1">
                <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#121820] text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#2E3A4B]">
                  <Thermometer className="w-3.5 h-3.5 text-amber-500" />
                  <span>{forecast.weatherTemp}°C • {forecast.weatherCondition}</span>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#121820] text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#2E3A4B]">
                  <Wind className="w-3.5 h-3.5 text-blue-500" />
                  <span>Substation Load: {isOutage ? '0%' : '78%'}</span>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#121820] text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#2E3A4B]">
                  <Zap className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Reliability: {region.gridUptimeMonthly}%</span>
                </div>

                <button
                  onClick={() => setShowFeederDetails(!showFeederDetails)}
                  className="text-xs font-semibold text-blue-600 dark:text-[#4285F4] hover:underline flex items-center gap-1 px-2 py-1"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>{showFeederDetails ? 'Hide Diagnostics' : 'Feeder Diagnostics'}</span>
                </button>
              </div>
            </div>

            {/* Right Action Buttons */}
            <div className="flex flex-col sm:flex-row md:flex-col items-stretch md:items-end gap-3 shrink-0">
              <button
                id="report-outage-hero-btn"
                onClick={onOpenReport}
                className="px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs sm:text-sm transition-all active:scale-95 shadow-md flex items-center justify-center gap-2"
              >
                <AlertOctagon className="w-4 h-4" />
                <span>Report Blackout in My Street</span>
              </button>

              {onOpenCalendarSync && (
                <button
                  id="sync-calendar-hero-btn"
                  onClick={onOpenCalendarSync}
                  className="px-5 py-2.5 rounded-2xl bg-slate-100 dark:bg-[#222C3A] hover:bg-slate-200 dark:hover:bg-[#2E3A4B] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-[#2E3A4B] font-bold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-[#4285F4]" />
                  <span>Sync Outage to Calendar</span>
                </button>
              )}
            </div>
          </div>

          {/* Substation Diagnostics Drawer */}
          {showFeederDetails && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#121820] border border-slate-200 dark:border-[#2E3A4B] text-xs text-slate-700 dark:text-slate-300 space-y-2 animate-in fade-in slide-in-from-top-2">
              <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
                <Radio className="w-4 h-4 text-blue-600 dark:text-[#4285F4]" />
                <span>Substation Telemetry: {region.substation} ({region.feederCode})</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono">
                <div className="p-2.5 rounded-xl bg-white dark:bg-[#1A222D] border border-slate-200 dark:border-[#2E3A4B]">
                  <div className="text-slate-500 dark:text-slate-400 text-[10px]">FEEDER TYPE</div>
                  <div className="font-bold text-slate-900 dark:text-white">11 kV Dedicated</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-[#1A222D] border border-slate-200 dark:border-[#2E3A4B]">
                  <div className="text-slate-500 dark:text-slate-400 text-[10px]">FREQ DRIFT</div>
                  <div className="font-bold text-emerald-600 dark:text-[#34A853]">49.98 Hz</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-[#1A222D] border border-slate-200 dark:border-[#2E3A4B]">
                  <div className="text-slate-500 dark:text-slate-400 text-[10px]">POWER FACTOR</div>
                  <div className="font-bold text-slate-900 dark:text-white">0.96 Lag</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-[#1A222D] border border-slate-200 dark:border-[#2E3A4B]">
                  <div className="text-slate-500 dark:text-slate-400 text-[10px]">BTS BACKUP</div>
                  <div className="font-bold text-amber-600 dark:text-[#FBBC05]">~{region.cellTowerBackupHours}h Battery</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

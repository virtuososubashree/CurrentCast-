import React, { useState, useRef, useEffect } from 'react';
import { DayForecast, TimelineBlock } from '../types';
import { useLivePhoneTime } from '../utils/dateUtils';
import { 
  Sun, 
  AlertTriangle, 
  ZapOff, 
  CheckCircle2, 
  CloudLightning, 
  Clock, 
  Info, 
  ChevronRight, 
  ChevronLeft,
  Sparkles,
  Layers,
  Zap,
  Activity,
  Radio
} from 'lucide-react';

interface ForecastTimelineProps {
  forecasts: DayForecast[];
  selectedDayIndex: number;
  onSelectDayIndex: (index: number) => void;
}

export const ForecastTimeline: React.FC<ForecastTimelineProps> = ({
  forecasts,
  selectedDayIndex,
  onSelectDayIndex,
}) => {
  const { currentHour, currentMinute, shortTime } = useLivePhoneTime();
  const [activeBlock, setActiveBlock] = useState<TimelineBlock | null>(null);
  const [selectedHourIndex, setSelectedHourIndex] = useState<number>(() => (selectedDayIndex === 0 ? currentHour : 12));
  const [viewMode, setViewMode] = useState<'hourly-carousel' | 'vertical-log'>('hourly-carousel');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const currentForecast = forecasts[selectedDayIndex] || forecasts[0];
  const isToday = selectedDayIndex === 0;

  // Auto-scroll to active current hour on mount / when today is selected
  useEffect(() => {
    if (isToday && scrollContainerRef.current) {
      const targetScroll = Math.max(0, (currentHour - 1) * 110);
      scrollContainerRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' });
      setSelectedHourIndex(currentHour);
    }
  }, [selectedDayIndex, currentHour, isToday]);

  // Generate 24 hourly data points for the day
  const hourlyData = Array.from({ length: 24 }).map((_, i) => {
    const hourNum = i;
    const isNow = isToday && hourNum === currentHour;
    
    let hourLabel = '';
    if (isNow) {
      hourLabel = 'Now';
    } else if (hourNum === 0) {
      hourLabel = '12 AM';
    } else if (hourNum < 12) {
      hourLabel = `${hourNum} AM`;
    } else if (hourNum === 12) {
      hourLabel = '12 PM';
    } else {
      hourLabel = `${hourNum - 12} PM`;
    }
    
    // Status modeling for today's forecast
    const isOutageHour = currentForecast.status === 'OUTAGE_FAULT' && hourNum >= 16 && hourNum < 20;
    const isRiskHour = (currentForecast.status === 'OUTAGE_FAULT' && hourNum >= 12 && hourNum < 16) || (currentForecast.status === 'STORM_RISK' && hourNum >= 16 && hourNum < 20);
    const isRestoreHour = currentForecast.status === 'OUTAGE_FAULT' && hourNum >= 20 && hourNum < 22;
    const isMaintHour = currentForecast.status === 'MAINTENANCE' && hourNum >= 9 && hourNum < 14;

    let status: 'NORMAL' | 'RISK' | 'OUTAGE' | 'RESTORE' | 'MAINTENANCE' = 'NORMAL';
    let riskPercent = 5;
    let voltage = 230;
    let label = 'Stable Power';
    let icon = <Zap className="w-5 h-5 text-[#34A853]" />;
    let bgStyle = 'bg-[#1A222D] border-[#2E3A4B] text-slate-100 hover:border-[#4285F4]';

    if (isOutageHour) {
      status = 'OUTAGE';
      riskPercent = 98;
      voltage = 0;
      label = 'Blackout';
      icon = <ZapOff className="w-5 h-5 text-[#EA4335]" />;
      bgStyle = 'bg-[#310A0A] border-[#EA4335]/60 text-white hover:border-[#EA4335]';
    } else if (isMaintHour) {
      status = 'MAINTENANCE';
      riskPercent = 90;
      voltage = 0;
      label = 'Scheduled Cut';
      icon = <ZapOff className="w-5 h-5 text-[#FBBC05]" />;
      bgStyle = 'bg-[#2A1E0B] border-[#FBBC05]/60 text-white hover:border-[#FBBC05]';
    } else if (isRiskHour) {
      status = 'RISK';
      riskPercent = 65;
      voltage = 216;
      label = 'Storm Trip Risk';
      icon = <CloudLightning className="w-5 h-5 text-[#FBBC05]" />;
      bgStyle = 'bg-[#2A200F] border-[#FBBC05]/40 text-slate-100 hover:border-[#FBBC05]';
    } else if (isRestoreHour) {
      status = 'RESTORE';
      riskPercent = 20;
      voltage = 228;
      label = 'Restoring';
      icon = <CheckCircle2 className="w-5 h-5 text-[#34A853]" />;
      bgStyle = 'bg-[#0E2419] border-[#34A853]/50 text-emerald-200 hover:border-[#34A853]';
    }

    return {
      hour: hourNum,
      label: hourLabel,
      isNow,
      status,
      riskPercent,
      voltage,
      statusText: label,
      icon,
      bgStyle,
      temp: currentForecast.weatherTemp,
    };
  });

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#1A222D] rounded-3xl p-4 sm:p-6 border border-[#2E3A4B] shadow-lg space-y-4">
      {/* 1. 5-DAY / WEEKLY FORECAST PILLS SELECTOR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#2E3A4B]">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 max-w-full">
          {forecasts.map((fc, index) => {
            const isSelected = selectedDayIndex === index;
            const hasAlert = fc.status === 'OUTAGE_FAULT' || fc.status === 'MAINTENANCE' || fc.status === 'STORM_RISK';
            
            return (
              <button
                key={fc.date}
                id={`day-pill-tab-${index}`}
                onClick={() => {
                  onSelectDayIndex(index);
                  setSelectedHourIndex(0);
                }}
                className={`px-3.5 sm:px-4 py-2 rounded-2xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-[#4285F4] text-white shadow-md'
                    : 'bg-[#121820] text-slate-400 hover:text-slate-200 hover:bg-[#222C3A] border border-[#2E3A4B]'
                }`}
              >
                <span>{fc.dayLabel}</span>
                {hasAlert && (
                  <span
                    className={`w-2 h-2 rounded-full ${
                      fc.status === 'OUTAGE_FAULT'
                        ? 'bg-[#EA4335] animate-ping'
                        : 'bg-[#FBBC05]'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* View Mode Toggle: Google Weather Carousel vs Vertical Diagnostic Rail */}
        <div className="flex items-center gap-1 bg-[#121820] p-1 rounded-2xl border border-[#2E3A4B] shrink-0 self-end sm:self-auto">
          <button
            onClick={() => setViewMode('hourly-carousel')}
            className={`px-3 py-1 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all ${
              viewMode === 'hourly-carousel' ? 'bg-[#4285F4] text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>24h Timeline</span>
          </button>
          <button
            onClick={() => setViewMode('vertical-log')}
            className={`px-3 py-1 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all ${
              viewMode === 'vertical-log' ? 'bg-[#4285F4] text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Feeder Log</span>
          </button>
        </div>
      </div>

      {/* 2. HOURLY PREDICTIVE POWER TIMELINE (Horizontal Scroll - Google Weather Style) */}
      {viewMode === 'hourly-carousel' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[#4285F4]" />
                <span>24-Hour Electricity & Risk Forecast</span>
              </span>
              <span className="text-slate-400 font-mono hidden sm:inline">
                ({currentForecast.dayLabel})
              </span>
            </div>

            {/* Carousel Navigation Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleScroll('left')}
                className="w-7 h-7 rounded-xl bg-[#121820] hover:bg-[#222C3A] text-slate-300 flex items-center justify-center border border-[#2E3A4B]"
                title="Scroll Left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleScroll('right')}
                className="w-7 h-7 rounded-xl bg-[#121820] hover:bg-[#222C3A] text-slate-300 flex items-center justify-center border border-[#2E3A4B]"
                title="Scroll Right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Horizontal Scroll Cards Container */}
          <div
            ref={scrollContainerRef}
            className="flex items-stretch gap-2.5 overflow-x-auto pb-3 pt-1 snap-x scrollbar-thin"
          >
            {hourlyData.map((item, index) => {
              const isSelected = selectedHourIndex === index;
              return (
                <div
                  key={index}
                  onClick={() => setSelectedHourIndex(index)}
                  className={`snap-start shrink-0 w-24 sm:w-28 p-3 rounded-2xl border transition-all cursor-pointer flex flex-col items-center justify-between text-center select-none relative ${
                    item.bgStyle
                  } ${
                    item.isNow 
                      ? 'border-[#34A853] ring-2 ring-[#34A853]/40 shadow-lg shadow-[#34A853]/10'
                      : isSelected 
                      ? 'ring-2 ring-[#4285F4] scale-105 shadow-xl' 
                      : 'hover:scale-102'
                  }`}
                >
                  {/* Live Now Pulsing Badge */}
                  {item.isNow && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#34A853] text-white text-[9px] font-black uppercase px-2 py-0.2 rounded-full tracking-wider shadow-sm flex items-center gap-1 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                      <span>Live</span>
                    </div>
                  )}

                  {/* Time Label */}
                  <div className={`text-xs font-black tracking-tight ${item.isNow ? 'text-[#34A853]' : 'text-slate-300'}`}>
                    {item.label}
                  </div>

                  {/* Icon */}
                  <div className="my-2 p-2 rounded-2xl bg-[#121820]/70 border border-white/5">
                    {item.icon}
                  </div>

                  {/* Voltage & State */}
                  <div className="text-xs font-black text-white">
                    {item.voltage === 0 ? '0V Cut' : `${item.voltage}V`}
                  </div>

                  {/* Risk Badge */}
                  <div
                    className={`mt-2 w-full py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                      item.riskPercent >= 80
                        ? 'bg-[#EA4335] text-white'
                        : item.riskPercent >= 50
                        ? 'bg-[#FBBC05] text-slate-950'
                        : 'bg-[#34A853]/20 text-[#34A853] border border-[#34A853]/30'
                    }`}
                  >
                    {item.riskPercent}% Risk
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Hour Telemetry Inspector */}
          {hourlyData[selectedHourIndex] && (
            <div className="p-3.5 rounded-2xl bg-[#121820] border border-[#2E3A4B] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#1A222D] border border-[#2E3A4B] text-amber-400">
                  {hourlyData[selectedHourIndex].icon}
                </div>
                <div>
                  <div className="font-extrabold text-white text-sm">
                    {hourlyData[selectedHourIndex].label} Detailed Telemetry • {hourlyData[selectedHourIndex].statusText}
                  </div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    Expected Voltage: <span className="font-mono text-white">{hourlyData[selectedHourIndex].voltage}V</span> • Outage Probability: <span className="font-mono font-bold text-[#FBBC05]">{hourlyData[selectedHourIndex].riskPercent}%</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span className="text-[11px] font-medium text-slate-400">
                  Weather: {currentForecast.weatherTemp}°C {currentForecast.weatherCondition}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. VERTICAL DIAGNOSTIC RAIL TIMELINE */}
      {viewMode === 'vertical-log' && (
        <div className="relative pl-6 sm:pl-8 space-y-4 pt-2">
          {/* Vertical Track Rail */}
          <div className="absolute left-2.5 sm:left-3.5 top-3 bottom-3 w-1 bg-[#2E3A4B] rounded-full" />

          {/* Current Time Laser Line Indicator */}
          <div className="relative flex items-center gap-3 my-2 z-20">
            <div className="absolute -left-[27px] sm:-left-[31px] w-5 h-5 rounded-full bg-[#EA4335] border-4 border-[#1A222D] shadow-md flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            </div>

            <div className="flex items-center gap-2 bg-[#EA4335] text-white px-3 py-1 rounded-full text-xs font-black shadow-sm">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>Current Time Indicator</span>
            </div>

            <div className="flex-1 h-[2px] bg-gradient-to-r from-[#EA4335] via-[#EA4335]/40 to-transparent" />
          </div>

          {/* Blocks */}
          {currentForecast.blocks.map((block) => {
            const isBlockOutage = block.status === 'OUTAGE_FAULT' || block.status === 'MAINTENANCE';
            const isBlockRisk = block.status === 'STORM_RISK';

            return (
              <div
                key={block.id}
                onClick={() => setActiveBlock(block)}
                className={`relative group rounded-2xl p-4 sm:p-5 border transition-all cursor-pointer hover:shadow-lg ${
                  isBlockOutage
                    ? 'bg-[#310A0A] border-[#EA4335]/50 text-white'
                    : isBlockRisk
                    ? 'bg-[#2A200F] border-[#FBBC05]/40 text-slate-100'
                    : 'bg-[#121820] border-[#2E3A4B] text-slate-100 hover:border-[#4285F4]'
                }`}
              >
                {/* Timeline Marker Dot */}
                <div
                  className={`absolute -left-[27px] sm:-left-[31px] top-6 w-4 h-4 rounded-full border-2 border-[#1A222D] shadow-xs transition-transform group-hover:scale-125 ${
                    isBlockOutage
                      ? 'bg-[#EA4335]'
                      : isBlockRisk
                      ? 'bg-[#FBBC05]'
                      : 'bg-[#34A853]'
                  }`}
                />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-[#1A222D] border border-[#2E3A4B] text-slate-200">
                        {block.startTime} - {block.endTime}
                      </span>

                      <span
                        className={`inline-flex items-center gap-1 text-xs font-extrabold px-2.5 py-0.5 rounded-lg border ${
                          isBlockOutage
                            ? 'bg-[#EA4335]/20 text-[#EA4335] border-[#EA4335]/40'
                            : isBlockRisk
                            ? 'bg-[#FBBC05]/20 text-[#FBBC05] border-[#FBBC05]/40'
                            : 'bg-[#34A853]/20 text-[#34A853] border-[#34A853]/40'
                        }`}
                      >
                        <span>{block.label}</span>
                      </span>

                      {block.probability > 0 && (
                        <span className="text-[11px] font-semibold text-slate-400 bg-[#1A222D] px-2 py-0.5 rounded-md border border-[#2E3A4B]">
                          {block.probability}% Probability
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
                      {block.subtext}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    <span className="text-xs font-bold text-[#4285F4] group-hover:underline flex items-center">
                      Inspect <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Block Diagnostics Modal */}
      {activeBlock && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setActiveBlock(null)}
        >
          <div
            className="bg-[#1A222D] border border-[#2E3A4B] rounded-3xl max-w-lg w-full p-6 shadow-2xl text-slate-100 space-y-4 animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#2E3A4B]">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-[#4285F4]" />
                <h3 className="font-extrabold text-white text-lg">
                  Feeder & Outage Diagnostics
                </h3>
              </div>
              <button
                onClick={() => setActiveBlock(null)}
                className="w-8 h-8 rounded-full bg-[#222C3A] text-slate-400 hover:text-white flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="bg-[#121820] p-4 rounded-2xl border border-[#2E3A4B] space-y-2">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-400">Scheduled Time Window</span>
                  <span className="font-bold text-white font-mono">
                    {activeBlock.startTime} - {activeBlock.endTime}
                  </span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-slate-400">Grid Status</span>
                  <span className="font-bold text-white">{activeBlock.label}</span>
                </div>
                {activeBlock.feederLine && (
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-400">Feeder ID</span>
                    <span className="font-mono font-bold text-[#4285F4]">{activeBlock.feederLine}</span>
                  </div>
                )}
                {activeBlock.affectedTransformers && (
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-400">Affected Transformers</span>
                    <span className="font-bold text-[#EA4335]">{activeBlock.affectedTransformers} Units</span>
                  </div>
                )}
                {activeBlock.expectedRestoration && (
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-400">Estimated Power Back</span>
                    <span className="font-bold text-[#34A853]">{activeBlock.expectedRestoration}</span>
                  </div>
                )}
              </div>

              <div className="p-3.5 bg-[#4285F4]/10 rounded-2xl border border-[#4285F4]/30 text-xs text-slate-200 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-[#4285F4]">
                  <Sparkles className="w-4 h-4 text-[#4285F4]" />
                  <span>CurrentCast Grid Advisory</span>
                </div>
                <p className="leading-relaxed text-slate-300">
                  {activeBlock.status === 'OUTAGE_FAULT' || activeBlock.status === 'MAINTENANCE'
                    ? 'Cell towers in this circle will exhaust their battery backup in ~90 minutes. Turn off background app refresh and prepare your inverter load.'
                    : 'Grid voltage is operating stably at 230V. Ideal window for high-load appliances like washing machines and water pumping.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveBlock(null)}
              className="w-full py-2.5 rounded-2xl bg-[#222C3A] hover:bg-[#2E3A4B] text-white font-bold text-sm transition-colors border border-[#2E3A4B]"
            >
              Close Diagnostics
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { Region } from '../types';
import { 
  CalendarDays, 
  TrendingUp, 
  Database, 
  History, 
  Cpu, 
  CheckCircle2, 
  Sparkles, 
  BarChart3,
  Activity
} from 'lucide-react';

interface HistoricalPatternCardProps {
  region: Region;
}

export const HistoricalPatternCard: React.FC<HistoricalPatternCardProps> = ({ region }) => {
  const { historicalPattern } = region;

  return (
    <div className="bg-[#1A222D] rounded-3xl p-4 sm:p-6 border border-[#2E3A4B] shadow-lg space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#2E3A4B]">
        <div>
          <div className="text-[11px] font-bold text-[#4285F4] uppercase tracking-wider flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-[#4285F4]" />
            <span>Cached Offline Pattern Intelligence</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2 mt-0.5">
            <span>Historical Grid Pattern Analyzer</span>
          </h3>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-2xl bg-[#34A853]/15 text-[#34A853] border border-[#34A853]/30 text-xs font-bold">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#34A853]" />
          <span>{historicalPattern.confidence}% Predictive Accuracy</span>
        </div>
      </div>

      {/* Main Pattern Prediction Hero Box */}
      <div className="bg-[#121820] rounded-2xl p-4 sm:p-5 border border-[#2E3A4B] space-y-3 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#FBBC05] uppercase tracking-wide flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5" />
            <span>Substation Maintenance Cycle Rule</span>
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            TANGEDCO 3-Year Dataset
          </span>
        </div>

        <div>
          <div className="text-sm sm:text-base font-black text-white">
            {historicalPattern.rule}
          </div>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            Predicted Next Major Shutdown:{' '}
            <strong className="text-[#FBBC05] font-black underline underline-offset-4">
              {historicalPattern.nextPredictedDate}
            </strong>{' '}
            (Insulator high-pressure wash & 110kV feeder transformer overhaul)
          </p>
        </div>

        <div className="pt-2 border-t border-[#2E3A4B] flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
          <span>Last Recorded Outage: <strong className="text-slate-200">{historicalPattern.lastMaintenanceDate}</strong></span>
          <span className="text-[#34A853] font-bold flex items-center gap-1">
            <Activity className="w-3.5 h-3.5" />
            <span>Works 100% Offline via Local Storage</span>
          </span>
        </div>
      </div>

      {/* Grid Pattern Metrics Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-[#121820] border border-[#2E3A4B] space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Monthly Grid Uptime</span>
            <TrendingUp className="w-4 h-4 text-[#34A853]" />
          </div>
          <div className="text-2xl font-black text-white">
            {region.gridUptimeMonthly}%
          </div>
          <div className="text-[11px] text-slate-400">
            Avg 4.8 hrs downtime / month
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#121820] border border-[#2E3A4B] space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Seasonal Vulnerability</span>
            <History className="w-4 h-4 text-[#FBBC05]" />
          </div>
          <div className="text-sm font-bold text-white leading-snug">
            Northeast Monsoon (Oct-Dec)
          </div>
          <div className="text-[11px] text-slate-400">
            High coastal storm trip risk
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#121820] border border-[#2E3A4B] space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Primary Outage Cause</span>
            <BarChart3 className="w-4 h-4 text-[#4285F4]" />
          </div>
          <div className="text-sm font-bold text-white leading-snug">
            Tree Branch Snaps (64%)
          </div>
          <div className="text-[11px] text-slate-400">
            Overhead 11kV LT conductors
          </div>
        </div>
      </div>
    </div>
  );
};

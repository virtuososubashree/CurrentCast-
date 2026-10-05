import React, { useState } from 'react';
import { InverterDevice } from '../types';
import { BatteryCharging, Zap, Plus, Minus, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface InverterCalculatorProps {
  devices: InverterDevice[];
  onUpdateDeviceCount: (id: string, count: number) => void;
}

export const InverterCalculator: React.FC<InverterCalculatorProps> = ({
  devices,
  onUpdateDeviceCount,
}) => {
  const [batteryAh, setBatteryAh] = useState<number>(150); // 150 Ah default 12V battery
  const batteryVoltage = 12;
  const inverterEfficiency = 0.85; // 85% typical inverter efficiency
  const depthOfDischarge = 0.75; // 75% usable battery capacity to prevent battery degradation

  // Calculate total active load in Watts
  const totalWatts = devices.reduce((sum, dev) => sum + dev.watts * dev.count, 0);

  // Total energy available in Watt-Hours (Wh) = Ah * V * DoD * Efficiency
  const usableWattHours = batteryAh * batteryVoltage * depthOfDischarge * inverterEfficiency;

  // Runtime in hours = Usable Wh / Total Watts
  const runtimeHours = totalWatts > 0 ? usableWattHours / totalWatts : 0;
  const hours = Math.floor(runtimeHours);
  const minutes = Math.round((runtimeHours - hours) * 60);

  return (
    <div className="bg-[#121820] rounded-2xl p-4 sm:p-5 border border-[#2E3A4B] space-y-4">
      {/* Header & Big Result Pill */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-[11px] font-bold text-[#4285F4] uppercase tracking-wider flex items-center gap-1.5">
            <BatteryCharging className="w-3.5 h-3.5 text-[#4285F4]" />
            <span>Home Inverter Runtime Predictor</span>
          </div>
          <h4 className="text-base font-black text-white mt-0.5">
            Real-Time Backup Duration
          </h4>
        </div>

        {/* Calculated Time Pill */}
        <div className="bg-[#1A222D] text-white px-4 py-2 rounded-2xl border border-[#2E3A4B] shadow-md flex items-center gap-2.5 self-start sm:self-auto">
          <Clock className="w-4 h-4 text-[#FBBC05]" />
          <div className="text-right">
            <div className="text-[11px] text-slate-400 font-medium leading-none">Estimated Backup</div>
            <div className="text-lg font-black text-[#FBBC05]">
              {totalWatts === 0 ? 'No Load' : `${hours}h ${minutes}m`}
            </div>
          </div>
        </div>
      </div>

      {/* Battery Capacity Slider */}
      <div className="bg-[#1A222D] p-4 rounded-2xl border border-[#2E3A4B] space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-300">Inverter Battery Capacity:</span>
          <span className="font-mono font-bold text-[#4285F4] bg-[#121820] px-2.5 py-0.5 rounded-lg border border-[#2E3A4B]">
            {batteryAh} Ah (12V Tubular)
          </span>
        </div>

        <input
          type="range"
          min="100"
          max="250"
          step="10"
          value={batteryAh}
          onChange={(e) => setBatteryAh(Number(e.target.value))}
          className="w-full h-2 bg-[#121820] rounded-lg appearance-none cursor-pointer accent-[#4285F4]"
        />

        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>100 Ah (Compact)</span>
          <span>150 Ah (Standard)</span>
          <span>200 Ah (Long Life)</span>
          <span>250 Ah (Heavy)</span>
        </div>
      </div>

      {/* Active Load Items Table */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300">
          <span>Running Appliances</span>
          <span className="font-mono text-[#4285F4]">Total Load: {totalWatts} Watts</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {devices.map((dev) => {
            return (
              <div
                key={dev.id}
                className={`p-3 rounded-2xl border flex items-center justify-between transition-colors ${
                  dev.count > 0
                    ? 'bg-[#1A222D] border-[#4285F4]/50 shadow-sm'
                    : 'bg-[#1A222D]/60 border-[#2E3A4B] opacity-75'
                }`}
              >
                <div className="min-w-0 pr-2">
                  <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                    <span>{dev.name}</span>
                    {dev.essential && (
                      <span className="text-[9px] bg-[#34A853]/20 text-[#34A853] px-1.5 py-0.5 rounded font-bold border border-[#34A853]/30">
                        Eco
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {dev.watts}W each • {dev.watts * dev.count}W total
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 bg-[#121820] p-1 rounded-xl border border-[#2E3A4B]">
                  <button
                    onClick={() => onUpdateDeviceCount(dev.id, Math.max(0, dev.count - 1))}
                    className="w-6 h-6 rounded-lg bg-[#1A222D] text-slate-300 hover:text-white hover:bg-[#222C3A] flex items-center justify-center font-bold text-xs"
                  >
                    <Minus className="w-3 h-3" />
                  </button>

                  <span className="w-5 text-center font-mono font-bold text-xs text-white">
                    {dev.count}
                  </span>

                  <button
                    onClick={() => onUpdateDeviceCount(dev.id, dev.count + 1)}
                    className="w-6 h-6 rounded-lg bg-[#1A222D] text-slate-300 hover:text-white hover:bg-[#222C3A] flex items-center justify-center font-bold text-xs"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Battery Conservation Pro Tip */}
      <div className="p-3.5 bg-[#FBBC05]/10 rounded-2xl border border-[#FBBC05]/30 text-xs text-amber-200 flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-[#FBBC05] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-white">Inverter Lifeline Tip:</strong> Disconnecting induction ceiling fans and keeping only 1 BLDC fan + WiFi router increases your inverter backup duration by nearly <strong>3.4x</strong>!
        </p>
      </div>
    </div>
  );
};

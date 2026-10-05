import React, { useState } from 'react';
import { PowerHub, OfflineActivity, InverterDevice } from '../types';
import { InverterCalculator } from './InverterCalculator';
import { 
  Compass, 
  MapPin, 
  Wifi, 
  Zap, 
  Clock, 
  CheckCircle2, 
  Navigation, 
  BookOpen, 
  Coffee, 
  Sparkles, 
  Battery, 
  Filter,
  Map as MapIcon,
  List
} from 'lucide-react';

interface WattNextGuideProps {
  powerHubs: PowerHub[];
  activities: OfflineActivity[];
  inverterDevices: InverterDevice[];
  onUpdateInverterDevice: (id: string, count: number) => void;
}

export const WattNextGuide: React.FC<WattNextGuideProps> = ({
  powerHubs,
  activities,
  inverterDevices,
  onUpdateInverterDevice,
}) => {
  const [activeTab, setActiveTab] = useState<'hubs' | 'activities' | 'inverter'>('hubs');
  const [hubFilter, setHubFilter] = useState<'all' | 'free' | 'generator'>('all');
  const [hubView, setHubView] = useState<'list' | 'map'>('list');
  const [selectedActivityDuration, setSelectedActivityDuration] = useState<number | 'all'>('all');

  const filteredHubs = powerHubs.filter((hub) => {
    if (hubFilter === 'free') return hub.feeType === 'Free';
    if (hubFilter === 'generator') return hub.verifiedBackup === 'Diesel Generator';
    return true;
  });

  const filteredActivities = activities.filter((act) => {
    if (selectedActivityDuration === 'all') return true;
    return act.durationMinutes === selectedActivityDuration;
  });

  return (
    <div id="watt-next-guide" className="bg-[#1A222D] rounded-3xl p-4 sm:p-6 border border-[#2E3A4B] shadow-lg space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#2E3A4B]">
        <div>
          <div className="text-[11px] font-bold text-[#4285F4] uppercase tracking-wider flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-[#4285F4]" />
            <span>Blackout Productivity & Resilience Hub</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2 mt-0.5">
            <span>"WattNext" Lifestyle Guide</span>
          </h3>
        </div>

        {/* Sub Tabs */}
        <div className="flex items-center gap-1 bg-[#121820] p-1 rounded-2xl border border-[#2E3A4B]">
          <button
            id="tab-power-hubs"
            onClick={() => setActiveTab('hubs')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'hubs'
                ? 'bg-[#4285F4] text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-[#FBBC05]" />
            <span>Find Power Nearby</span>
          </button>

          <button
            id="tab-offline-activities"
            onClick={() => setActiveTab('activities')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'activities'
                ? 'bg-[#4285F4] text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#FBBC05]" />
            <span>Offline Prep</span>
          </button>

          <button
            id="tab-inverter-calc"
            onClick={() => setActiveTab('inverter')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'inverter'
                ? 'bg-[#4285F4] text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Battery className="w-3.5 h-3.5 text-[#FBBC05]" />
            <span>Inverter Calc</span>
          </button>
        </div>
      </div>

      {/* TAB 1: FIND POWER NEARBY */}
      {activeTab === 'hubs' && (
        <div className="space-y-4">
          {/* Controls & Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-semibold text-slate-400">Filter:</span>
              <button
                onClick={() => setHubFilter('all')}
                className={`px-3 py-1 rounded-xl font-bold transition-colors ${
                  hubFilter === 'all'
                    ? 'bg-[#4285F4] text-white'
                    : 'bg-[#121820] text-slate-400 hover:text-white border border-[#2E3A4B]'
                }`}
              >
                All ({powerHubs.length})
              </button>
              <button
                onClick={() => setHubFilter('free')}
                className={`px-3 py-1 rounded-xl font-bold transition-colors ${
                  hubFilter === 'free'
                    ? 'bg-[#4285F4] text-white'
                    : 'bg-[#121820] text-slate-400 hover:text-white border border-[#2E3A4B]'
                }`}
              >
                Free Public Hubs
              </button>
              <button
                onClick={() => setHubFilter('generator')}
                className={`px-3 py-1 rounded-xl font-bold transition-colors ${
                  hubFilter === 'generator'
                    ? 'bg-[#4285F4] text-white'
                    : 'bg-[#121820] text-slate-400 hover:text-white border border-[#2E3A4B]'
                }`}
              >
                Diesel Generator Backup
              </button>
            </div>

            {/* List vs Map Toggle */}
            <div className="flex items-center gap-1 bg-[#121820] p-1 rounded-xl border border-[#2E3A4B] text-xs">
              <button
                onClick={() => setHubView('list')}
                className={`p-1.5 rounded-lg ${
                  hubView === 'list' ? 'bg-[#4285F4] text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setHubView('map')}
                className={`p-1.5 rounded-lg ${
                  hubView === 'map' ? 'bg-[#4285F4] text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Interactive Map View"
              >
                <MapIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive SVG Radar Map View */}
          {hubView === 'map' && (
            <div className="relative w-full h-64 sm:h-80 bg-[#121820] rounded-2xl overflow-hidden border border-[#2E3A4B] flex items-center justify-center p-4">
              {/* Radar Grid Circles */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <div className="w-32 h-32 rounded-full border border-[#34A853]" />
                <div className="w-56 h-56 rounded-full border border-[#34A853] absolute" />
                <div className="w-80 h-80 rounded-full border border-[#34A853] absolute" />
              </div>

              {/* Center User Location Marker */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20 pointer-events-none">
                <div className="w-4 h-4 rounded-full bg-[#4285F4] border-2 border-white shadow-lg animate-ping" />
                <div className="w-3 h-3 rounded-full bg-[#4285F4] border border-white absolute" />
                <span className="text-[10px] font-bold text-white bg-[#1A222D] px-2 py-0.5 rounded-lg mt-1 border border-[#4285F4]">
                  Your Location
                </span>
              </div>

              {/* Power Hub Pins on Map */}
              {filteredHubs.map((hub) => (
                <div
                  key={hub.id}
                  style={{ top: `${hub.coords.y}%`, left: `${hub.coords.x}%` }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-30"
                >
                  <div className="w-7 h-7 rounded-full bg-[#FBBC05] text-slate-950 flex items-center justify-center shadow-lg font-black text-xs border-2 border-white group-hover:scale-125 transition-transform">
                    ⚡
                  </div>
                  
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block w-48 p-2.5 rounded-2xl bg-[#1A222D] text-white text-xs shadow-2xl border border-[#2E3A4B] z-40">
                    <div className="font-bold truncate">{hub.name}</div>
                    <div className="text-[10px] text-slate-400">{hub.distanceKm} km • {hub.verifiedBackup}</div>
                    <div className="text-[10px] text-[#34A853] font-bold mt-0.5">🟢 {hub.socketsAvailable} Sockets Available</div>
                  </div>
                </div>
              ))}

              <div className="absolute bottom-2 left-2 text-[11px] text-slate-400 bg-[#1A222D]/80 px-2.5 py-1 rounded-xl backdrop-blur-xs border border-[#2E3A4B]">
                📡 Verified Power Sanctuaries & Microgrids
              </div>
            </div>
          )}

          {/* Directory Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {filteredHubs.map((hub) => {
              return (
                <div
                  key={hub.id}
                  className="p-4 rounded-2xl border border-[#2E3A4B] bg-[#121820] hover:bg-[#1A222D] hover:border-[#4285F4] transition-all shadow-md space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase bg-[#4285F4]/20 text-[#4285F4] border border-[#4285F4]/30">
                          {hub.category}
                        </span>
                        {hub.isOpenNow && (
                          <span className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase bg-[#34A853]/20 text-[#34A853] border border-[#34A853]/30 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#34A853] animate-pulse" />
                            Open Now
                          </span>
                        )}
                      </div>
                      <h4 className="font-extrabold text-sm sm:text-base text-white mt-1">
                        {hub.name}
                      </h4>
                      <p className="text-xs text-slate-400 leading-snug mt-0.5">
                        {hub.address}
                      </p>
                    </div>

                    <span className="text-xs font-mono font-black text-[#4285F4] bg-[#1A222D] px-2.5 py-1 rounded-xl border border-[#2E3A4B] shrink-0">
                      {hub.distanceKm} km
                    </span>
                  </div>

                  {/* Feature Badges */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-300">
                    <div className="flex items-center gap-1.5 bg-[#1A222D] p-2 rounded-xl border border-[#2E3A4B]">
                      <Zap className="w-3.5 h-3.5 text-[#FBBC05]" />
                      <span className="truncate">{hub.verifiedBackup}</span>
                    </div>

                    <div className="flex items-center gap-1.5 bg-[#1A222D] p-2 rounded-xl border border-[#2E3A4B]">
                      <Wifi className="w-3.5 h-3.5 text-[#4285F4]" />
                      <span>{hub.wifiSpeedMbps} Mbps Fiber</span>
                    </div>

                    <div className="flex items-center gap-1.5 bg-[#1A222D] p-2 rounded-xl border border-[#2E3A4B]">
                      <Battery className="w-3.5 h-3.5 text-[#34A853]" />
                      <span>{hub.socketsAvailable} Power Sockets</span>
                    </div>

                    <div className="flex items-center gap-1.5 bg-[#1A222D] p-2 rounded-xl border border-[#2E3A4B]">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-[11px] truncate">{hub.openHours}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-[#2E3A4B] text-xs">
                    <span className="font-bold text-slate-400">Access: <strong className="text-white">{hub.feeType}</strong></span>
                    <button
                      onClick={() => {
                        window.open(`https://maps.google.com/?q=${encodeURIComponent(hub.name + ' ' + hub.address)}`, '_blank');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#4285F4] hover:bg-[#3367D6] text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5 text-amber-300" />
                      <span>Navigate</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: CURATED OFFLINE ACTIVITIES */}
      {activeTab === 'activities' && (
        <div className="space-y-4">
          {/* Duration Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Duration:</span>
            <button
              onClick={() => setSelectedActivityDuration('all')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                selectedActivityDuration === 'all'
                  ? 'bg-[#4285F4] text-white'
                  : 'bg-[#121820] text-slate-400 hover:text-white border border-[#2E3A4B]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedActivityDuration(30)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                selectedActivityDuration === 30
                  ? 'bg-[#4285F4] text-white'
                  : 'bg-[#121820] text-slate-400 hover:text-white border border-[#2E3A4B]'
              }`}
            >
              ⚡ 30 Mins (Quick)
            </button>
            <button
              onClick={() => setSelectedActivityDuration(120)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                selectedActivityDuration === 120
                  ? 'bg-[#4285F4] text-white'
                  : 'bg-[#121820] text-slate-400 hover:text-white border border-[#2E3A4B]'
              }`}
            >
              🎯 2 Hours (Deep Focus)
            </button>
            <button
              onClick={() => setSelectedActivityDuration(240)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                selectedActivityDuration === 240
                  ? 'bg-[#4285F4] text-white'
                  : 'bg-[#121820] text-slate-400 hover:text-white border border-[#2E3A4B]'
              }`}
            >
              🌌 4+ Hours (Evening Downtime)
            </button>
          </div>

          {/* Activities Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredActivities.map((act) => {
              return (
                <div
                  key={act.id}
                  className="p-4 rounded-2xl bg-[#121820] border border-[#2E3A4B] hover:border-[#4285F4] transition-all flex flex-col justify-between space-y-3 shadow-md"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#4285F4] bg-[#1A222D] px-2.5 py-0.5 rounded-lg border border-[#2E3A4B]">
                        ⏱️ {act.durationMinutes} mins
                      </span>
                      <span className="text-[10px] font-bold text-[#34A853] bg-[#34A853]/15 px-2 py-0.5 rounded-lg border border-[#34A853]/30">
                        {act.batteryDrainImpact}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-sm sm:text-base text-white">
                      {act.title}
                    </h4>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {act.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#2E3A4B] space-y-1">
                    <div className="text-[10px] font-bold text-[#FBBC05] uppercase tracking-wider">
                      Action Steps:
                    </div>
                    {act.steps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-300">
                        <span className="text-[#4285F4] font-bold">•</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: INVERTER CALCULATOR */}
      {activeTab === 'inverter' && (
        <InverterCalculator
          devices={inverterDevices}
          onUpdateDeviceCount={onUpdateInverterDevice}
        />
      )}
    </div>
  );
};

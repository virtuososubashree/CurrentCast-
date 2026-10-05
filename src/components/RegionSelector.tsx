import React, { useState } from 'react';
import { Region } from '../types';
import { 
  MapPin, 
  ChevronDown, 
  Check, 
  Zap, 
  AlertTriangle, 
  ShieldCheck, 
  Search,
  Building2,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';

interface RegionSelectorProps {
  regions: Region[];
  selectedRegion: Region;
  onSelectRegion: (region: Region) => void;
}

export const RegionSelector: React.FC<RegionSelectorProps> = ({
  regions,
  selectedRegion,
  onSelectRegion,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrictFilter, setSelectedDistrictFilter] = useState<string>('ALL');

  // Extract unique districts
  const districts = ['ALL', ...Array.from(new Set(regions.map((r) => r.district)))];

  const filteredRegions = regions.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.substation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.feederCode.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDistrict = selectedDistrictFilter === 'ALL' || r.district === selectedDistrictFilter;

    return matchesSearch && matchesDistrict;
  });

  return (
    <div className="relative w-full">
      {/* Floating Pill Search & Region Selector Bar (Material You Style) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#1A222D] p-3 sm:p-4 rounded-3xl border border-[#2E3A4B] shadow-lg">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-[#4285F4]/15 border border-[#4285F4]/30 flex items-center justify-center text-[#4285F4] shrink-0">
            <MapPin className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-bold text-[#FBBC05] uppercase tracking-wider flex items-center gap-1.5">
              <span>Selected Electrical Circle / Substation</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#34A853] animate-pulse" />
            </div>
            
            {/* Custom Interactive Floating Pill Button */}
            <button
              id="region-dropdown-trigger"
              onClick={() => setIsOpen(!isOpen)}
              className="mt-0.5 flex items-center gap-2 text-left font-black text-white text-base sm:text-lg hover:text-[#4285F4] transition-colors truncate group"
            >
              <span className="truncate">
                {selectedRegion.name}, {selectedRegion.district} ({selectedRegion.state})
              </span>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 group-hover:text-[#4285F4] transition-transform ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* Substation & Feeder Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-[#121820] text-slate-300 border border-[#2E3A4B] flex items-center gap-1.5 font-mono font-bold">
            <Zap className="w-3.5 h-3.5 text-[#FBBC05]" />
            <span>{selectedRegion.feederCode}</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-[#34A853]/15 text-[#34A853] border border-[#34A853]/30 flex items-center gap-1 font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-[#34A853]" />
            <span>{selectedRegion.gridUptimeMonthly}% Uptime</span>
          </div>

          <div
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-1 font-bold ${
              selectedRegion.deadZoneRiskLevel === 'HIGH'
                ? 'bg-[#EA4335]/15 text-[#EA4335] border-[#EA4335]/30'
                : selectedRegion.deadZoneRiskLevel === 'MEDIUM'
                ? 'bg-[#FBBC05]/15 text-[#FBBC05] border-[#FBBC05]/30'
                : 'bg-[#121820] text-slate-300 border-[#2E3A4B]'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{selectedRegion.deadZoneRiskLevel} Dead-Zone Risk</span>
          </div>
        </div>
      </div>

      {/* Hierarchical Regional Resolution Dropdown Modal */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-2 z-40 bg-[#1A222D] rounded-3xl shadow-2xl border border-[#2E3A4B] p-4 text-slate-100 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between pb-3 border-b border-[#2E3A4B]">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#4285F4]" />
                <h4 className="font-extrabold text-white text-sm">
                  Hierarchical Grid & Feeder Resolver
                </h4>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                TANGEDCO / TNPDCL Directory
              </span>
            </div>

            {/* Search Input */}
            <div className="relative my-3">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="search-region-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search town, district, feeder ID (e.g. Kurinjipadi, Cuddalore, TN-CUD-KUR)..."
                className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm bg-[#121820] text-white border border-[#2E3A4B] rounded-2xl focus:border-[#4285F4] focus:outline-none"
                autoFocus
              />
            </div>

            {/* District Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2">
              {districts.map((district) => (
                <button
                  key={district}
                  onClick={() => setSelectedDistrictFilter(district)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                    selectedDistrictFilter === district
                      ? 'bg-[#4285F4] text-white'
                      : 'bg-[#121820] text-slate-400 hover:text-white border border-[#2E3A4B]'
                  }`}
                >
                  {district}
                </button>
              ))}
            </div>

            {/* Region List */}
            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {filteredRegions.map((region) => {
                const isSelected = region.id === selectedRegion.id;
                return (
                  <button
                    key={region.id}
                    onClick={() => {
                      onSelectRegion(region);
                      setIsOpen(false);
                      setSearchQuery('');
                    }}
                    className={`w-full p-3 rounded-2xl text-left flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-[#4285F4]/20 text-white border border-[#4285F4] font-semibold'
                        : 'bg-[#121820] hover:bg-[#222C3A] text-slate-200 border border-[#2E3A4B]'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-extrabold flex items-center gap-2 text-sm text-white">
                        <span>{region.name}</span>
                        <span className="text-xs font-normal text-slate-400">({region.district}, {region.state})</span>
                      </div>
                      <div className="text-xs text-slate-400 truncate mt-0.5 flex items-center gap-2 font-mono">
                        <span>⚡ {region.substation}</span>
                        <span>•</span>
                        <span className="text-[#4285F4] font-bold">Feeder: {region.feederCode}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className="text-xs font-mono px-2 py-0.5 rounded-lg bg-[#1A222D] text-slate-300 border border-[#2E3A4B]">
                        {region.gridUptimeMonthly}%
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-[#34A853]" />}
                    </div>
                  </button>
                );
              })}

              {filteredRegions.length === 0 && (
                <div className="py-8 text-center text-xs text-slate-400">
                  No matching electrical circle found for "{searchQuery}".
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

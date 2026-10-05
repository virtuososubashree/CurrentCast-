import React, { useState } from 'react';
import { Region } from '../types';
import { 
  AlertTriangle, 
  Radio, 
  Download, 
  PhoneCall, 
  Check, 
  ShieldAlert, 
  MessageSquare, 
  BatteryMedium,
  WifiOff,
  Clock
} from 'lucide-react';

interface DeadZoneWarningProps {
  region: Region;
  onOpenEmergency: () => void;
}

export const DeadZoneWarning: React.FC<DeadZoneWarningProps> = ({
  region,
  onOpenEmergency,
}) => {
  const [downloaded, setDownloaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedSMS, setCopiedSMS] = useState(false);

  const isHighRisk = region.deadZoneRiskLevel === 'HIGH';

  const handleDownloadOfflinePack = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 5000);
    }, 1200);
  };

  const handleCopySMS = () => {
    const smsTemplate = `EMERGENCY SOS: Power blackout & cell tower failing in ${region.name}, ${region.district}. Grid Feeder: ${region.feederCode}. My phone battery is low.`;
    navigator.clipboard.writeText(smsTemplate);
    setCopiedSMS(true);
    setTimeout(() => setCopiedSMS(false), 3000);
  };

  return (
    <div
      className={`rounded-3xl p-4 sm:p-6 border shadow-lg transition-all ${
        isHighRisk
          ? 'bg-[#1A222D] border-[#EA4335]/40 text-slate-100'
          : 'bg-[#1A222D] border-[#2E3A4B] text-slate-100'
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Warning Info */}
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider ${
                isHighRisk
                  ? 'bg-[#EA4335] text-white'
                  : 'bg-[#FBBC05] text-slate-950'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Double-Vulnerability Dead-Zone Alert</span>
            </span>

            <span className="text-xs font-semibold text-slate-400">
              Substation + 4G Tower Cascade Risk
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-black text-white leading-snug">
            {region.name} Dead-Zone Risk: 4G/5G Towers Deplete Backup Battery in ~{region.cellTowerBackupHours} Hours
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
            When the {region.substation.split(' ')[0]} drops power, nearby cellular Base Transceiver Stations (BTS) exhaust diesel/battery reserves within ~{region.cellTowerBackupHours} hours, dropping mobile internet & emergency voice connectivity.
          </p>

          <div className="pt-1 flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-medium">
            <div className="flex items-center gap-1.5 bg-[#121820] text-slate-200 px-3 py-1.5 rounded-xl border border-[#2E3A4B]">
              <BatteryMedium className="w-3.5 h-3.5 text-[#EA4335]" />
              <span>Tower Battery Reserve: ~{region.cellTowerBackupHours} hrs max</span>
            </div>

            <div className="flex items-center gap-1.5 bg-[#121820] text-slate-200 px-3 py-1.5 rounded-xl border border-[#2E3A4B]">
              <Radio className="w-3.5 h-3.5 text-[#FBBC05]" />
              <span>Dead-Zone Drop: Likely 90m after cut</span>
            </div>

            <div className="flex items-center gap-1.5 bg-[#121820] text-slate-200 px-3 py-1.5 rounded-xl border border-[#2E3A4B]">
              <WifiOff className="w-3.5 h-3.5 text-slate-400" />
              <span>Offline Cache Active</span>
            </div>
          </div>
        </div>

        {/* Right Action Toolkit */}
        <div className="flex flex-wrap sm:flex-nowrap md:flex-col gap-2 shrink-0 self-stretch sm:self-auto justify-end">
          {/* Download Offline Pack */}
          <button
            id="download-offline-pack-btn"
            onClick={handleDownloadOfflinePack}
            disabled={isDownloading}
            className={`px-4 py-2.5 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 shadow-md ${
              downloaded
                ? 'bg-[#34A853] text-white'
                : 'bg-[#4285F4] hover:bg-[#3367D6] text-white active:scale-95'
            }`}
          >
            {isDownloading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Caching Local Offline Intelligence...</span>
              </>
            ) : downloaded ? (
              <>
                <Check className="w-4 h-4" />
                <span>Offline Pack Stored in IndexedDB!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-amber-300" />
                <span>Download Essential Offline Pack</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2 w-full">
            {/* Copy SOS SMS */}
            <button
              id="copy-emergency-sms-btn"
              onClick={handleCopySMS}
              className="flex-1 px-3 py-2 rounded-2xl bg-[#121820] hover:bg-[#222C3A] border border-[#2E3A4B] text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#4285F4]" />
              <span>{copiedSMS ? 'SMS Copied!' : 'Pre-Draft SOS SMS'}</span>
            </button>

            {/* Open Emergency Modal */}
            <button
              id="deadzone-sos-modal-btn"
              onClick={onOpenEmergency}
              className="px-3 py-2 rounded-2xl bg-[#EA4335]/20 hover:bg-[#EA4335]/30 border border-[#EA4335]/40 text-[#EA4335] text-xs font-black flex items-center justify-center gap-1.5 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>TNEB SOS</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Region } from '../types';
import { 
  ShieldAlert, 
  PhoneCall, 
  Flashlight, 
  BatteryLow, 
  Radio, 
  Copy, 
  Check, 
  X,
  Sparkles
} from 'lucide-react';

interface EmergencyOfflineModalProps {
  isOpen: boolean;
  onClose: () => void;
  region: Region;
}

export const EmergencyOfflineModal: React.FC<EmergencyOfflineModalProps> = ({
  isOpen,
  onClose,
  region,
}) => {
  const [flashlightActive, setFlashlightActive] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      {/* Fullscreen Flashlight Screen Overlay */}
      {flashlightActive && (
        <div
          onClick={() => setFlashlightActive(false)}
          className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-between p-8 cursor-pointer select-none text-slate-900"
        >
          <div className="text-sm font-bold opacity-60">
            Emergency Lantern Mode (Max White Screen)
          </div>
          <div className="text-center space-y-2">
            <div className="text-4xl font-black">💡 Screen Lantern Active</div>
            <div className="text-sm opacity-75">Tap anywhere on the screen to turn off</div>
          </div>
          <div className="text-xs opacity-50">CurrentCast Offline Rescue Tool</div>
        </div>
      )}

      <div
        className="bg-[#1A222D] rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 shadow-2xl border border-[#2E3A4B] space-y-5 text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#2E3A4B]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EA4335]/20 border border-[#EA4335]/40 text-[#EA4335] flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-lg">
                Emergency & Dead-Zone SOS Center
              </h3>
              <p className="text-xs text-slate-400">
                {region.name} • Feeder {region.feederCode}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#121820] hover:bg-[#222C3A] text-slate-400 hover:text-white flex items-center justify-center transition-colors font-bold border border-[#2E3A4B]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Screen Flashlight Feature */}
        <div className="p-4 rounded-2xl bg-[#121820] border border-[#2E3A4B] text-white flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="font-extrabold text-sm flex items-center gap-1.5 text-[#FBBC05]">
              <Flashlight className="w-4 h-4" />
              <span>Screen Lantern / Room Light</span>
            </div>
            <p className="text-xs text-slate-400">
              Turns your screen into a high-lumen reading light without draining LED camera flash battery.
            </p>
          </div>

          <button
            onClick={() => setFlashlightActive(true)}
            className="px-4 py-2 rounded-xl bg-[#FBBC05] hover:bg-amber-300 text-slate-950 font-black text-xs shrink-0 transition-transform active:scale-95 shadow-md"
          >
            Turn On Light
          </button>
        </div>

        {/* Emergency Contacts Directory */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Verified Substation & Emergency Contacts
          </div>

          <div className="space-y-2">
            <div className="p-3.5 rounded-2xl bg-[#121820] border border-[#2E3A4B] flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-white">TNEB Fuse Call Center (24/7 Toll Free)</div>
                <div className="font-mono text-[#4285F4] font-bold mt-0.5">{region.emergencyContacts.tnebFuseCall}</div>
              </div>
              <button
                onClick={() => handleCopy(region.emergencyContacts.tnebFuseCall)}
                className="px-3 py-1.5 rounded-xl bg-[#1A222D] border border-[#2E3A4B] text-slate-300 hover:text-white hover:bg-[#222C3A] font-bold flex items-center gap-1 transition-colors"
              >
                {copiedNumber === region.emergencyContacts.tnebFuseCall ? <Check className="w-3.5 h-3.5 text-[#34A853]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedNumber === region.emergencyContacts.tnebFuseCall ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#121820] border border-[#2E3A4B] flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-white">Assistant Engineer (AE / O&M)</div>
                <div className="font-mono text-[#4285F4] font-bold mt-0.5">{region.emergencyContacts.substationAE}</div>
              </div>
              <button
                onClick={() => handleCopy(region.emergencyContacts.substationAE)}
                className="px-3 py-1.5 rounded-xl bg-[#1A222D] border border-[#2E3A4B] text-slate-300 hover:text-white hover:bg-[#222C3A] font-bold flex items-center gap-1 transition-colors"
              >
                {copiedNumber === region.emergencyContacts.substationAE ? <Check className="w-3.5 h-3.5 text-[#34A853]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedNumber === region.emergencyContacts.substationAE ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#121820] border border-[#2E3A4B] flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-white">Nearest Government Hospital</div>
                <div className="font-mono text-[#4285F4] font-bold mt-0.5">{region.emergencyContacts.nearestHospital}</div>
              </div>
              <button
                onClick={() => handleCopy(region.emergencyContacts.nearestHospital)}
                className="px-3 py-1.5 rounded-xl bg-[#1A222D] border border-[#2E3A4B] text-slate-300 hover:text-white hover:bg-[#222C3A] font-bold flex items-center gap-1 transition-colors"
              >
                {copiedNumber === region.emergencyContacts.nearestHospital ? <Check className="w-3.5 h-3.5 text-[#34A853]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedNumber === region.emergencyContacts.nearestHospital ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Battery Preservation Protocol */}
        <div className="p-4 rounded-2xl bg-[#FBBC05]/10 border border-[#FBBC05]/30 space-y-2 text-xs text-amber-200">
          <div className="font-extrabold flex items-center gap-1.5 text-[#FBBC05]">
            <BatteryLow className="w-4 h-4 text-[#FBBC05]" />
            <span>Dead-Zone 4G Tower Failure Survival Protocol</span>
          </div>
          <ul className="space-y-1 text-slate-300 pl-4 list-disc">
            <li>Turn on <strong>Airplane Mode</strong> when cell towers die to stop phone transceiver from draining battery searching for signal.</li>
            <li>Keep display on <strong>Dark Mode</strong> (saves up to 60% display power).</li>
            <li>Keep emergency medical packs and insulin in the coldest interior shelf of your refrigerator.</li>
          </ul>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-2xl bg-[#222C3A] hover:bg-[#2E3A4B] text-white font-bold text-sm transition-colors border border-[#2E3A4B]"
        >
          Close SOS Center
        </button>
      </div>
    </div>
  );
};

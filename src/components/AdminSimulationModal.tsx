import React, { useState } from 'react';
import { Region, UtilityAlert } from '../types';
import confetti from 'canvas-confetti';
import { 
  SlidersHorizontal, 
  ZapOff, 
  Trees, 
  CloudLightning, 
  CheckCircle2, 
  AlertOctagon, 
  Radio, 
  Send,
  X
} from 'lucide-react';

interface AdminSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  region: Region;
  onSimulateOutage: (type: 'blowout' | 'tree-trim' | 'storm' | 'restore') => void;
  onPostCustomAlert: (alert: UtilityAlert) => void;
}

export const AdminSimulationModal: React.FC<AdminSimulationModalProps> = ({
  isOpen,
  onClose,
  region,
  onSimulateOutage,
  onPostCustomAlert,
}) => {
  const [customTitle, setCustomTitle] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [customType, setCustomType] = useState<'CRITICAL' | 'WARNING' | 'INFO'>('WARNING');
  const [simulatedFeedback, setSimulatedFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const triggerAction = (type: 'blowout' | 'tree-trim' | 'storm' | 'restore', feedbackText: string) => {
    onSimulateOutage(type);
    setSimulatedFeedback(feedbackText);

    if (type === 'restore') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }

    setTimeout(() => {
      setSimulatedFeedback(null);
    }, 4000);
  };

  const handlePostAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim() || !customMessage.trim()) return;

    const newAlert: UtilityAlert = {
      id: `alert-${Date.now()}`,
      type: customType,
      title: customTitle.trim(),
      message: customMessage.trim(),
      timestamp: 'Just now (Official TANGEDCO Notice)',
      affectedAreas: [region.name, 'Adjacent Ring Feeders'],
    };

    onPostCustomAlert(newAlert);
    setCustomTitle('');
    setCustomMessage('');
    setSimulatedFeedback('Official announcement broadcasted to all active app users!');
    setTimeout(() => setSimulatedFeedback(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div
        className="bg-[#1A222D] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-7 shadow-2xl border border-[#2E3A4B] space-y-6 text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#2E3A4B]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#4285F4]/20 border border-[#4285F4]/40 text-[#4285F4] flex items-center justify-center">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-lg sm:text-xl">
                Electricity Board (TNEB) Grid Simulator
              </h3>
              <p className="text-xs text-slate-400">
                Target Substation: <strong className="text-slate-200">{region.substation}</strong> (Feeder {region.feederCode})
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

        {/* Feedback Banner */}
        {simulatedFeedback && (
          <div className="p-3.5 bg-[#34A853]/20 border border-[#34A853]/40 rounded-2xl text-xs font-bold text-emerald-300 flex items-center gap-2 animate-in slide-in-from-top-1">
            <CheckCircle2 className="w-4 h-4 text-[#34A853] shrink-0" />
            <span>{simulatedFeedback}</span>
          </div>
        )}

        {/* Simulation Actions Grid */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-[#FBBC05] uppercase tracking-wider">
            1. Trigger Live Grid Disruption / Maintenance Scenarios
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Scenario 1: Transformer Blowout */}
            <button
              onClick={() =>
                triggerAction(
                  'blowout',
                  'Simulated 250kVA Distribution Transformer Explosion in Sector 3! Timeline switched to emergency blackout.'
                )
              }
              className="p-4 rounded-2xl border border-[#EA4335]/50 bg-[#310A0A] hover:bg-[#400E0E] text-left transition-all hover:scale-[1.01] active:scale-95 space-y-1.5"
            >
              <div className="flex items-center gap-2 text-[#EA4335] font-extrabold text-sm">
                <ZapOff className="w-4 h-4" />
                <span>Simulate Transformer Blowout</span>
              </div>
              <p className="text-xs text-rose-200/80 leading-snug">
                Trips 11kV feeder immediately with 0% voltage. Triggers Dead-Zone alert and pushes ETR countdown.
              </p>
            </button>

            {/* Scenario 2: Feeder Tree Trimming */}
            <button
              onClick={() =>
                triggerAction(
                  'tree-trim',
                  'Scheduled 4-hour maintenance shut-down queued for feeder line clearing!'
                )
              }
              className="p-4 rounded-2xl border border-[#FBBC05]/50 bg-[#2A1E0B] hover:bg-[#38280E] text-left transition-all hover:scale-[1.01] active:scale-95 space-y-1.5"
            >
              <div className="flex items-center gap-2 text-[#FBBC05] font-extrabold text-sm">
                <Trees className="w-4 h-4" />
                <span>Schedule Tree Line Trimming</span>
              </div>
              <p className="text-xs text-amber-200/80 leading-snug">
                Schedules planned 09:00 AM - 01:00 PM power cut with official notice broadcast and preparation checklist.
              </p>
            </button>

            {/* Scenario 3: Storm / Lightning Trip */}
            <button
              onClick={() =>
                triggerAction(
                  'storm',
                  'Coastal squall simulated! High risk probability curve applied across 4 PM - 8 PM.'
                )
              }
              className="p-4 rounded-2xl border border-[#4285F4]/50 bg-[#14233D] hover:bg-[#1B2F52] text-left transition-all hover:scale-[1.01] active:scale-95 space-y-1.5"
            >
              <div className="flex items-center gap-2 text-[#4285F4] font-extrabold text-sm">
                <CloudLightning className="w-4 h-4" />
                <span>Simulate Monsoon Storm Auto-Trip</span>
              </div>
              <p className="text-xs text-blue-200/80 leading-snug">
                Simulates 55 km/h squalls tripping transmission lines; alerts users to charge powerbanks in advance.
              </p>
            </button>

            {/* Scenario 4: Restore Grid */}
            <button
              onClick={() =>
                triggerAction(
                  'restore',
                  'Grid re-energized successfully! 232V stable power restored across all ring feeders.'
                )
              }
              className="p-4 rounded-2xl border border-[#34A853]/60 bg-[#0E2419] hover:bg-[#143323] text-emerald-200 text-left transition-all hover:scale-[1.01] active:scale-95 space-y-1.5 shadow-sm"
            >
              <div className="flex items-center gap-2 font-black text-sm text-[#34A853]">
                <CheckCircle2 className="w-4 h-4 text-[#34A853]" />
                <span>⚡ Restore Grid & Clear Blackout</span>
              </div>
              <p className="text-xs text-emerald-300/80 leading-snug">
                Re-energizes all feeder lines to 230V Normal status and fires celebration confetti.
              </p>
            </button>
          </div>
        </div>

        {/* Custom Broadcast Feed */}
        <form onSubmit={handlePostAlert} className="space-y-3 pt-3 border-t border-[#2E3A4B]">
          <div className="text-xs font-bold text-[#4285F4] uppercase tracking-wider flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-[#4285F4]" />
            <span>2. Broadcast Official Utility Notice to App</span>
          </div>

          <div className="space-y-2">
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="Notice Title (e.g. Substation Breaker Replacement)"
              className="w-full px-3.5 py-2 text-xs bg-[#121820] text-white border border-[#2E3A4B] rounded-xl focus:outline-none focus:border-[#4285F4]"
            />

            <textarea
              rows={2}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Announcement details, affected streets, expected time of resumption..."
              className="w-full px-3.5 py-2 text-xs bg-[#121820] text-white border border-[#2E3A4B] rounded-xl focus:outline-none focus:border-[#4285F4] resize-none"
            />

            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 font-medium">Severity:</span>
                <select
                  value={customType}
                  onChange={(e) => setCustomType(e.target.value as any)}
                  className="px-2.5 py-1 text-xs bg-[#121820] text-white border border-[#2E3A4B] rounded-lg"
                >
                  <option value="WARNING">Warning (Amber)</option>
                  <option value="CRITICAL">Critical (Red)</option>
                  <option value="INFO">Info (Blue)</option>
                </select>
              </div>

              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#4285F4] hover:bg-[#3367D6] text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5 text-amber-300" />
                <span>Broadcast Alert</span>
              </button>
            </div>
          </div>
        </form>

        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-bold text-slate-400 hover:text-white"
          >
            Close Grid Simulator
          </button>
        </div>
      </div>
    </div>
  );
};

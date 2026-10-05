import React, { useState } from 'react';
import { ChecklistItem } from '../types';
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Sparkles,
  RotateCcw,
  MapPin,
  Download,
  Clock,
  Check,
  ChevronRight
} from 'lucide-react';

interface PreOutageChecklistProps {
  items: ChecklistItem[];
  onToggleItem: (id: string) => void;
  onAddItem: (item: ChecklistItem) => void;
  onResetItems: () => void;
  onNavigateToHubs?: () => void;
  timeWindow?: string;
}

export const PreOutageChecklist: React.FC<PreOutageChecklistProps> = ({
  items,
  onToggleItem,
  onAddItem,
  onResetItems,
  onNavigateToHubs,
  timeWindow = '4:00 PM - 8:00 PM',
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [cachedDocs, setCachedDocs] = useState(false);

  const completedCount = items.filter((i) => i.completed).length;
  const progressPercent = Math.round((completedCount / (items.length || 1)) * 100);

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: ChecklistItem = {
      id: `custom-${Date.now()}`,
      title: newTitle.trim(),
      description: newDesc.trim() || 'Custom checklist action',
      emoji: '⚡',
      countdown: '1h 00m',
      icon: 'power',
      completed: false,
      category: 'essential',
      timeframe: 'Complete within: 1h 00m',
    };

    onAddItem(newItem);
    setNewTitle('');
    setNewDesc('');
    setShowAddForm(false);
  };

  const handleSimulatePreCache = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCachedDocs(true);
    setTimeout(() => setCachedDocs(false), 3500);
  };

  return (
    <div className="bg-[#1A222D] rounded-3xl p-5 sm:p-7 border border-[#2E3A4B] shadow-xl space-y-6 select-none">
      
      {/* Header & Dynamic Progress Bar Section */}
      <div className="space-y-4 pb-4 border-b border-[#2E3A4B]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-bold text-[#FBBC05] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FBBC05]" />
              <span>Grid Outage Readiness</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white flex flex-wrap items-center gap-2 mt-0.5">
              <span>ACTIONABLE PREPARATION CHECKLIST</span>
            </h3>
          </div>

          {/* Reset Action */}
          <button
            onClick={onResetItems}
            title="Reset All Checklist Items"
            className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#121820] text-slate-300 hover:text-white hover:bg-[#222C3A] border border-[#2E3A4B] text-xs font-bold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset List</span>
          </button>
        </div>

        {/* Dynamic Progress Metric Header */}
        <div className="bg-[#121820] p-4 rounded-2xl border border-[#2E3A4B] space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
            <span className="text-white flex items-center gap-2">
              <span className="text-emerald-400 font-extrabold">{completedCount} of {items.length} Preps Complete</span>
              <span className="text-slate-500 font-normal">({progressPercent}%)</span>
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Window: <span className="text-amber-400 font-bold">{timeWindow}</span>
            </span>
          </div>

          {/* Glowing Animated Progress Track */}
          <div className="w-full h-2.5 bg-[#1A222D] rounded-full overflow-hidden border border-[#2E3A4B]/80 relative">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 rounded-full shadow-[0_0_12px_rgba(52,168,83,0.5)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Sleek Vertical Checklist Container */}
      <div className="space-y-3">
        {items.map((item) => {
          const isDone = item.completed;
          const emoji = item.emoji || (item.icon === 'battery' ? '🔋' : item.icon === 'phone' ? '📶' : item.icon === 'book' ? '📖' : '💡');
          const countdown = item.countdown || item.timeframe?.replace('Complete within: ', '') || '2h 00m';

          return (
            <div
              key={item.id}
              onClick={() => onToggleItem(item.id)}
              className={`group rounded-2xl p-4 sm:p-5 border transition-all duration-200 cursor-pointer flex items-start gap-4 select-none ${
                isDone
                  ? 'bg-[#0E2419]/70 border-[#34A853]/40 text-emerald-100'
                  : 'bg-[#121820] hover:bg-[#16202C] border-[#2E3A4B] hover:border-[#4285F4]/60 text-slate-100 shadow-sm'
              }`}
            >
              {/* Checkbox Icon */}
              <div className="pt-0.5 shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleItem(item.id);
                  }}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                    isDone
                      ? 'bg-[#34A853] border-[#34A853] text-white shadow-sm'
                      : 'border-slate-500 hover:border-slate-300 bg-[#1A222D]'
                  }`}
                >
                  {isDone && <Check className="w-4 h-4 stroke-[3]" />}
                </button>
              </div>

              {/* Emoji Badge */}
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0 border ${
                isDone ? 'bg-[#143323] border-[#34A853]/50' : 'bg-[#1A222D] border-[#2E3A4B]'
              }`}>
                <span>{emoji}</span>
              </div>

              {/* Title & Description Body */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
                  <h4
                    className={`text-sm sm:text-base font-bold tracking-tight transition-opacity ${
                      isDone ? 'text-[#34A853] line-through opacity-80' : 'text-white'
                    }`}
                  >
                    {item.title}
                  </h4>

                  {/* Real-time Countdown Badge */}
                  <div className="shrink-0">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2.5 py-1 rounded-full border ${
                        isDone
                          ? 'bg-[#143323] text-emerald-300 border-[#34A853]/40'
                          : countdown === 'No rush'
                          ? 'bg-[#1A222D] text-slate-400 border-[#2E3A4B]'
                          : 'bg-[#FBBC05]/15 text-[#FBBC05] border-[#FBBC05]/30'
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      <span>{countdown === 'No rush' ? '⏱️ No rush' : `⏱️ Complete within: ${countdown}`}</span>
                    </span>
                  </div>
                </div>

                <p
                  className={`mt-1 text-xs sm:text-sm leading-relaxed transition-opacity ${
                    isDone ? 'text-emerald-300/70' : 'text-slate-400'
                  }`}
                >
                  {item.description}
                </p>

                {/* Contextual Interactive Actions inside Checklist row */}
                {item.id === 'chk-2' && (
                  <div className="mt-3 pt-2 border-t border-[#2E3A4B]/60 flex items-center gap-2">
                    <button
                      onClick={handleSimulatePreCache}
                      className="py-1.5 px-3 rounded-xl bg-[#4285F4]/20 hover:bg-[#4285F4]/30 text-[#4285F4] border border-[#4285F4]/40 font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{cachedDocs ? '✓ Study Docs & Maps Saved Offline' : 'Cache Offline Documents & Maps Now'}</span>
                    </button>
                  </div>
                )}

                {item.id === 'chk-4' && onNavigateToHubs && (
                  <div className="mt-3 pt-2 border-t border-[#2E3A4B]/60 flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigateToHubs();
                      }}
                      className="py-1.5 px-3 rounded-xl bg-[#FBBC05]/20 hover:bg-[#FBBC05]/30 text-[#FBBC05] border border-[#FBBC05]/40 font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Open Live Power Hubs Navigation</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Custom Task Form / Trigger */}
      <div className="pt-2">
        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            className="text-xs font-bold text-[#4285F4] hover:text-[#3367D6] flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#121820] hover:bg-[#1A222D] border border-[#2E3A4B] transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Preparation Task</span>
          </button>
        ) : (
          <form onSubmit={handleAddNew} className="p-4 bg-[#121820] rounded-2xl border border-[#2E3A4B] space-y-3">
            <div className="text-xs font-bold text-slate-200">New Outage Checklist Action</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g., Turn on water sump pump"
                className="px-3.5 py-2.5 text-xs bg-[#1A222D] text-white border border-[#2E3A4B] rounded-xl focus:outline-none focus:border-[#4285F4]"
                autoFocus
              />
              <input
                type="text"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Description / guidance notes..."
                className="px-3.5 py-2.5 text-xs bg-[#1A222D] text-white border border-[#2E3A4B] rounded-xl focus:outline-none focus:border-[#4285F4]"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold bg-[#4285F4] hover:bg-[#3367D6] text-white rounded-xl transition-colors"
              >
                Save Task
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-2 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

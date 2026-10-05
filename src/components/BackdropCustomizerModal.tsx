import React, { useState } from 'react';
import { 
  TimeOfDayBackdrops, 
  DEFAULT_BACKDROPS, 
  BackdropArtStyle 
} from '../utils/backdropImages';
import { BackdropVectorScene } from './BackdropVectorScenes';
import { 
  Upload, 
  Image as ImageIcon, 
  RotateCcw, 
  Check, 
  X, 
  Sunrise, 
  Sun, 
  Sunset, 
  Moon, 
  Link as LinkIcon, 
  Sparkles,
  Palette,
  Camera,
  CheckCircle2
} from 'lucide-react';

interface BackdropCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBackdrops: TimeOfDayBackdrops;
  onSaveBackdrops: (newBackdrops: TimeOfDayBackdrops) => void;
  activePreviewSlot: 'morning' | 'afternoon' | 'evening' | 'night';
  onSelectPreviewSlot: (slot: 'morning' | 'afternoon' | 'evening' | 'night') => void;
  artStyle: BackdropArtStyle;
  onSelectArtStyle: (style: BackdropArtStyle) => void;
}

const PRESET_GALLERY = {
  morning: [
    { label: 'Morning Transmission Dawn', url: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&w=1600&q=80' },
    { label: 'Golden Sunrise Pylons', url: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=1600&q=80' },
    { label: 'Pastel Dawn Grid', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80' },
  ],
  afternoon: [
    { label: 'Blue Sky Solar Farm', url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1600&q=80' },
    { label: 'Daylight Power Pylons', url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80' },
    { label: 'Crisp Azure Sky Grid', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80' },
  ],
  evening: [
    { label: 'Golden Twilight Substation', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80' },
    { label: 'Fiery Sunset Transmission', url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1600&q=80' },
    { label: 'Purple Dusk Grid Horizon', url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1600&q=80' },
  ],
  night: [
    { label: 'Illuminated City Nightlife', url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80' },
    { label: 'Midnight Blue Grid', url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1600&q=80' },
    { label: 'Starry Sky City Lights', url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80' },
  ],
};

export const BackdropCustomizerModal: React.FC<BackdropCustomizerModalProps> = ({
  isOpen,
  onClose,
  currentBackdrops,
  onSaveBackdrops,
  activePreviewSlot,
  onSelectPreviewSlot,
  artStyle,
  onSelectArtStyle,
}) => {
  const [backdrops, setBackdrops] = useState<TimeOfDayBackdrops>(currentBackdrops);
  const [selectedSlot, setSelectedSlot] = useState<'morning' | 'afternoon' | 'evening' | 'night'>(activePreviewSlot);
  const [urlInput, setUrlInput] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [dragOverSlot, setDragOverSlot] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, slot: 'morning' | 'afternoon' | 'evening' | 'night') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFeedback('Please upload a valid image file (JPG, PNG, WebP, GIF).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        const updated = { ...backdrops, [slot]: dataUrl };
        setBackdrops(updated);
        onSaveBackdrops(updated);
        onSelectArtStyle('photo');
        onSelectPreviewSlot(slot);
        setFeedback(`✓ Custom image uploaded for ${slot.toUpperCase()}!`);
        setTimeout(() => setFeedback(null), 3000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent, slot: 'morning' | 'afternoon' | 'evening' | 'night') => {
    e.preventDefault();
    setDragOverSlot(null);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          const updated = { ...backdrops, [slot]: dataUrl };
          setBackdrops(updated);
          onSaveBackdrops(updated);
          onSelectArtStyle('photo');
          onSelectPreviewSlot(slot);
          setFeedback(`✓ Dropped & saved image for ${slot.toUpperCase()}!`);
          setTimeout(() => setFeedback(null), 3000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    const updated = { ...backdrops, [selectedSlot]: urlInput.trim() };
    setBackdrops(updated);
    onSaveBackdrops(updated);
    onSelectArtStyle('photo');
    onSelectPreviewSlot(selectedSlot);
    setUrlInput('');
    setFeedback(`✓ URL applied to ${selectedSlot.toUpperCase()} slot!`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleSelectPreset = (slot: 'morning' | 'afternoon' | 'evening' | 'night', url: string) => {
    const updated = { ...backdrops, [slot]: url };
    setBackdrops(updated);
    onSaveBackdrops(updated);
    onSelectArtStyle('photo');
    onSelectPreviewSlot(slot);
    setFeedback(`✓ Set photo preset for ${slot.toUpperCase()}`);
    setTimeout(() => setFeedback(null), 2500);
  };

  const handleResetToDefaults = () => {
    setBackdrops(DEFAULT_BACKDROPS);
    onSaveBackdrops(DEFAULT_BACKDROPS);
    setFeedback('✓ Reset all 4 time slots to default configuration!');
    setTimeout(() => setFeedback(null), 3000);
  };

  const slotMetadata = {
    morning: {
      title: 'Morning Dawn',
      time: '06:00 - 11:59',
      icon: <Sunrise className="w-4 h-4 text-amber-500" />,
      description: 'High-voltage pylon, sunrise glow, transformer & engineers',
    },
    afternoon: {
      title: 'Midday / Afternoon',
      time: '12:00 - 16:59',
      icon: <Sun className="w-4 h-4 text-sky-500" />,
      description: 'Crisp azure sky, solar array, battery storage & technicians',
    },
    evening: {
      title: 'Twilight / Sunset',
      time: '17:00 - 19:59',
      icon: <Sunset className="w-4 h-4 text-orange-500" />,
      description: 'Golden-orange sunset, lattice towers, insulators & bays',
    },
    night: {
      title: 'Nightlife / City',
      time: '20:00 - 05:59',
      icon: <Moon className="w-4 h-4 text-indigo-500" />,
      description: 'Sapphire night, skyscraper windows & glowing distribution lines',
    },
  };

  const slots = ['morning', 'afternoon', 'evening', 'night'] as const;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white dark:bg-[#1A222D] border border-slate-200 dark:border-[#2E3A4B] rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-[#2E3A4B] flex items-center justify-between bg-slate-50 dark:bg-[#121820]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-500/10 dark:bg-[#4285F4]/20 border border-blue-500/20 dark:border-[#4285F4]/40 text-blue-600 dark:text-[#4285F4]">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>Hero Backdrop Customizer</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose between Graphic Illustration, High-Res Photography, or Upload Custom Images
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#2E3A4B] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Art Style Selector Bar */}
        <div className="px-6 py-4 bg-slate-100 dark:bg-[#151D28] border-b border-slate-200 dark:border-[#2E3A4B] flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Active Art Theme:</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onSelectArtStyle('vector');
                setFeedback('✓ Switched to Graphic Vector Illustration Theme!');
                setTimeout(() => setFeedback(null), 2500);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                artStyle === 'vector'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white dark:bg-[#1A222D] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#2E3A4B] hover:border-slate-400'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>🎨 Graphic Illustration Art</span>
            </button>

            <button
              onClick={() => {
                onSelectArtStyle('photo');
                setFeedback('✓ Switched to Photography & Custom Uploads!');
                setTimeout(() => setFeedback(null), 2500);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                artStyle === 'photo'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white dark:bg-[#1A222D] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#2E3A4B] hover:border-slate-400'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>📸 Photo / Custom Uploads</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div className="mx-6 mt-4 p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-2xl flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
            <span>{feedback}</span>
          </div>
        )}

        {/* 4 Time Slots Grid */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {slots.map((slot) => {
              const meta = slotMetadata[slot];
              const isSelected = selectedSlot === slot;
              const isDragTarget = dragOverSlot === slot;

              return (
                <div
                  key={slot}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOverSlot(slot);
                  }}
                  onDragLeave={() => setDragOverSlot(null)}
                  onDrop={(e) => handleDrop(e, slot)}
                  onClick={() => {
                    setSelectedSlot(slot);
                    onSelectPreviewSlot(slot);
                  }}
                  className={`rounded-2xl border transition-all overflow-hidden flex flex-col cursor-pointer ${
                    isSelected
                      ? 'border-blue-500 ring-2 ring-blue-500/30 shadow-lg bg-blue-50/30 dark:bg-[#121820]'
                      : 'border-slate-200 dark:border-[#2E3A4B] bg-white dark:bg-[#16202C] hover:border-slate-400'
                  } ${isDragTarget ? 'border-dashed border-emerald-500 scale-[1.02]' : ''}`}
                >
                  {/* Slot Image / Vector Thumbnail Container */}
                  <div className="relative h-36 w-full bg-slate-900 overflow-hidden">
                    {artStyle === 'vector' ? (
                      <div className="w-full h-full pointer-events-none transform scale-100">
                        <BackdropVectorScene timeOfDay={slot} isOutage={false} />
                      </div>
                    ) : (
                      <img
                        src={backdrops[slot]}
                        alt={`${meta.title} backdrop`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    )}

                    {/* Gradient Overlay for badging */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/25 pointer-events-none" />
                    
                    {/* Slot Badge */}
                    <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold">
                      {meta.icon}
                      <span>{meta.title}</span>
                    </div>

                    <div className="absolute top-2 right-2 text-[10px] font-mono text-white/90 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-full">
                      {meta.time}
                    </div>

                    {/* Description */}
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-white/90 drop-shadow">
                      <span className="font-semibold truncate">{meta.description}</span>
                    </div>
                  </div>

                  {/* Slot Controls */}
                  <div className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-between">
                    <div className="flex items-center justify-between gap-2">
                      <label
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-sm"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Photo for {meta.title}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, slot)}
                          className="hidden"
                        />
                      </label>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSlot(slot);
                          onSelectPreviewSlot(slot);
                        }}
                        className={`p-2 rounded-xl border text-xs font-bold transition-colors ${
                          isSelected
                            ? 'bg-blue-100 dark:bg-blue-950/50 text-blue-600 border-blue-300'
                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-white border-slate-200 dark:border-[#2E3A4B]'
                        }`}
                        title="Preview Slot"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Quick Photo Presets for this slot */}
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Or Pick Photo Preset:
                      </div>
                      <div className="grid grid-cols-3 gap-1.5">
                        {PRESET_GALLERY[slot].map((preset, pIdx) => (
                          <button
                            key={pIdx}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectPreset(slot, preset.url);
                            }}
                            className={`p-1 text-[9px] font-semibold rounded-lg border truncate transition-all text-left ${
                              backdrops[slot] === preset.url && artStyle === 'photo'
                                ? 'bg-emerald-500 text-white border-emerald-600 font-bold'
                                : 'bg-slate-100 dark:bg-[#121820] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-[#2E3A4B] hover:border-slate-400'
                            }`}
                            title={preset.label}
                          >
                            {preset.label.split(' ')[0]} {preset.label.split(' ')[1] || ''}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Paste Web Image URL Section */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#121820] border border-slate-200 dark:border-[#2E3A4B] space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-blue-500" />
                <span>Paste Custom Image URL for {selectedSlot.toUpperCase()} Slot</span>
              </span>
              <span className="text-[11px] text-slate-400 font-mono">Selected: {selectedSlot}</span>
            </div>

            <form onSubmit={handleApplyUrl} className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://images.unsplash.com/... or any custom web image"
                className="flex-1 px-3.5 py-2 bg-white dark:bg-[#1A222D] text-slate-900 dark:text-white text-xs rounded-xl border border-slate-300 dark:border-[#2E3A4B] focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 text-white text-xs font-bold transition-colors shrink-0"
              >
                Apply URL
              </button>
            </form>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-[#121820] border-t border-slate-200 dark:border-[#2E3A4B] flex items-center justify-between">
          <button
            onClick={handleResetToDefaults}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl border border-slate-200 dark:border-[#2E3A4B] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Defaults</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md transition-all active:scale-95 flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Done & Apply</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export interface TimeOfDayBackdrops {
  morning: string;
  afternoon: string;
  evening: string;
  night: string;
}

// Option A: Curated high-resolution photography matching power grid, solar, and cityscape at each time of day
export const DEFAULT_BACKDROPS: TimeOfDayBackdrops = {
  // Morning: Crisp sunrise dawn over electrical transmission lines & morning landscape
  morning: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&w=1600&q=80',
  
  // Afternoon: Bright sun-drenched blue sky with electricity pylons and modern solar arrays
  afternoon: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1600&q=80',
  
  // Evening: High-voltage substation & transmission towers during golden hour / twilight sunset
  evening: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
  
  // Night: Vibrant illuminated city nightlife skyline & electricity grid glow
  night: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
};

const STORAGE_KEY = 'currentcast_custom_backdrops';

export function getStoredBackdrops(): TimeOfDayBackdrops {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        morning: parsed.morning || DEFAULT_BACKDROPS.morning,
        afternoon: parsed.afternoon || DEFAULT_BACKDROPS.afternoon,
        evening: parsed.evening || DEFAULT_BACKDROPS.evening,
        night: parsed.night || DEFAULT_BACKDROPS.night,
      };
    }
  } catch {
    // fallback
  }
  return DEFAULT_BACKDROPS;
}

export function saveStoredBackdrops(backdrops: TimeOfDayBackdrops): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(backdrops));
  } catch {
    // handle storage quota
  }
}

export type BackdropArtStyle = 'vector' | 'photo' | 'custom';

const STYLE_KEY = 'currentcast_backdrop_style';

export function getStoredArtStyle(): BackdropArtStyle {
  try {
    const saved = localStorage.getItem(STYLE_KEY);
    if (saved === 'vector' || saved === 'photo' || saved === 'custom') {
      return saved;
    }
  } catch {
    // fallback
  }
  return 'vector'; // Graphic Vector Illustration Theme is default
}

export function saveStoredArtStyle(style: BackdropArtStyle): void {
  try {
    localStorage.setItem(STYLE_KEY, style);
  } catch {
    // fallback
  }
}


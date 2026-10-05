import { useState, useEffect } from 'react';
import { BatteryState, ThemeMode } from '../types';

export function getInitialBatteryState(): BatteryState {
  return {
    isSupported: false,
    level: 1,
    percentage: 100,
    charging: true,
    chargingTime: 0,
    dischargingTime: Infinity,
    isBatterySaver: false,
    isSimulated: false,
  };
}

export function useBatteryStatus() {
  const [batteryState, setBatteryState] = useState<BatteryState>(() => {
    // Check localStorage for simulated battery if set
    const storedSim = localStorage.getItem('currentcast_sim_battery');
    if (storedSim) {
      try {
        const parsed = JSON.parse(storedSim);
        return {
          isSupported: true,
          level: parsed.level,
          percentage: Math.round(parsed.level * 100),
          charging: parsed.charging,
          chargingTime: parsed.charging ? 3600 : 0,
          dischargingTime: !parsed.charging ? 7200 : Infinity,
          isBatterySaver: !parsed.charging && parsed.level <= 0.20,
          isSimulated: true,
        };
      } catch (e) {
        // ignore
      }
    }
    return getInitialBatteryState();
  });

  useEffect(() => {
    let batteryInstance: any = null;

    const updateBatteryInfo = (battery: any) => {
      // If user has manual simulation active, don't overwrite
      if (localStorage.getItem('currentcast_sim_battery')) {
        return;
      }

      const isLow = !battery.charging && battery.level <= 0.20;
      setBatteryState({
        isSupported: true,
        level: battery.level,
        percentage: Math.round(battery.level * 100),
        charging: battery.charging,
        chargingTime: battery.chargingTime,
        dischargingTime: battery.dischargingTime,
        isBatterySaver: isLow,
        isSimulated: false,
      });
    };

    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        batteryInstance = battery;
        updateBatteryInfo(battery);

        battery.addEventListener('levelchange', () => updateBatteryInfo(battery));
        battery.addEventListener('chargingchange', () => updateBatteryInfo(battery));
        battery.addEventListener('chargingtimechange', () => updateBatteryInfo(battery));
        battery.addEventListener('dischargingtimechange', () => updateBatteryInfo(battery));
      }).catch(() => {
        // Battery API blocked by permissions policy
      });
    } else {
      // Fallback check for CSS prefers-reduced-motion or dark-mode device hints
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setBatteryState((prev) => ({
        ...prev,
        isSupported: false,
      }));
    }

    return () => {
      if (batteryInstance) {
        try {
          batteryInstance.removeEventListener('levelchange', updateBatteryInfo);
          batteryInstance.removeEventListener('chargingchange', updateBatteryInfo);
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  const simulateBattery = (level: number, charging: boolean) => {
    const isLow = !charging && level <= 0.20;
    const newState: BatteryState = {
      isSupported: true,
      level,
      percentage: Math.round(level * 100),
      charging,
      chargingTime: charging ? 3600 : 0,
      dischargingTime: !charging ? 5400 : Infinity,
      isBatterySaver: isLow,
      isSimulated: true,
    };
    localStorage.setItem('currentcast_sim_battery', JSON.stringify({ level, charging }));
    setBatteryState(newState);
  };

  const clearSimulatedBattery = () => {
    localStorage.removeItem('currentcast_sim_battery');
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        const isLow = !battery.charging && battery.level <= 0.20;
        setBatteryState({
          isSupported: true,
          level: battery.level,
          percentage: Math.round(battery.level * 100),
          charging: battery.charging,
          chargingTime: battery.chargingTime,
          dischargingTime: battery.dischargingTime,
          isBatterySaver: isLow,
          isSimulated: false,
        });
      });
    } else {
      setBatteryState(getInitialBatteryState());
    }
  };

  return {
    batteryState,
    simulateBattery,
    clearSimulatedBattery,
  };
}

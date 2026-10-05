/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Region, DayForecast } from '../types';

/**
 * Format date to YYYY-MM-DD
 */
export const formatISODate = (d: Date): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Format Day Label for UI e.g. "TODAY, AUGUST 27", "TOMORROW, AUGUST 28", "FRIDAY, AUGUST 29"
 */
export const getDayLabel = (d: Date, dayIndex: number): string => {
  const monthNames = [
    'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
  ];
  const dayNames = [
    'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'
  ];

  const month = monthNames[d.getMonth()];
  const dateNum = d.getDate();

  if (dayIndex === 0) {
    return `TODAY, ${month} ${dateNum}`;
  } else if (dayIndex === 1) {
    return `TOMORROW, ${month} ${dateNum}`;
  } else {
    return `${dayNames[d.getDay()]}, ${month} ${dateNum}`;
  }
};

/**
 * Format short day string e.g. "Today", "Tomorrow", "Fri, Aug 29"
 */
export const getShortDay = (d: Date, dayIndex: number): string => {
  const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (dayIndex === 0) return 'Today';
  if (dayIndex === 1) return 'Tomorrow';
  return `${shortDays[d.getDay()]}, ${shortMonths[d.getMonth()]} ${d.getDate()}`;
};

/**
 * Calculate the Nth weekday of a month (e.g. 3rd Thursday)
 */
export const getNthDayOfMonth = (year: number, month: number, dayOfWeek: number, nth: number): Date => {
  const firstDay = new Date(year, month, 1);
  let count = 0;
  for (let day = 1; day <= 31; day++) {
    const d = new Date(year, month, day);
    if (d.getMonth() !== month) break;
    if (d.getDay() === dayOfWeek) {
      count++;
      if (count === nth) {
        return d;
      }
    }
  }
  return new Date(year, month, 15);
};

/**
 * Dynamically calculate next maintenance shutdown date (e.g. 3rd Thursday of month)
 */
export const getNextPredictedMaintenanceDate = (baseDate: Date = new Date()): string => {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  
  // 3rd Thursday of current month
  let target = getNthDayOfMonth(year, month, 4, 3); // 4 = Thursday

  // If already passed this month, compute next month's 3rd Thursday
  if (target.getTime() <= baseDate.getTime()) {
    const nextMonth = (month + 1) % 12;
    const nextYear = nextMonth === 0 ? year + 1 : year;
    target = getNthDayOfMonth(nextYear, nextMonth, 4, 3);
  }

  const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${shortMonths[target.getMonth()]} ${target.getDate()}, ${target.getFullYear()}`;
};

/**
 * Dynamically calculate last recorded maintenance date (e.g. previous month's 3rd Thursday)
 */
export const getLastRecordedMaintenanceDate = (baseDate: Date = new Date()): string => {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  
  const target = getNthDayOfMonth(prevYear, prevMonth, 4, 3);
  const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${shortMonths[target.getMonth()]} ${target.getDate()}, ${target.getFullYear()}`;
};

/**
 * Synchronize regions and forecast arrays with the phone's active date
 */
export const syncRegionsWithActivePhoneDate = (regions: Region[], phoneNow: Date = new Date()): Region[] => {
  return regions.map((region) => {
    const updatedForecasts: DayForecast[] = region.forecasts.map((fc, index) => {
      const forecastDate = new Date(phoneNow);
      forecastDate.setDate(phoneNow.getDate() + index);

      const isToday = index === 0;
      const scheduledCut = fc.scheduledCut
        ? {
            ...fc.scheduledCut,
            officialNoticeNo: isToday
              ? fc.scheduledCut.officialNoticeNo.replace(/\d{4}$/, `${phoneNow.getFullYear()}/${(phoneNow.getDate() * 27) % 900 + 100}`)
              : fc.scheduledCut.officialNoticeNo,
          }
        : undefined;

      return {
        ...fc,
        date: formatISODate(forecastDate),
        dayLabel: getDayLabel(forecastDate, index),
        shortDay: getShortDay(forecastDate, index),
        scheduledCut,
      };
    });

    const historicalPattern = {
      ...region.historicalPattern,
      lastMaintenanceDate: getLastRecordedMaintenanceDate(phoneNow),
      nextPredictedDate: getNextPredictedMaintenanceDate(phoneNow),
    };

    return {
      ...region,
      historicalPattern,
      forecasts: updatedForecasts,
    };
  });
};

/**
 * Custom Hook for real-time live clock updates from user's phone/device
 */
export const useLivePhoneTime = () => {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    // Update every second for live countdowns and exact clock synchronization
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedTime = now.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const shortTime = now.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const formattedDate = now.toLocaleDateString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  return {
    now,
    formattedTime,
    shortTime,
    formattedDate,
    currentHour,
    currentMinute,
  };
};

/**
 * Calculate dynamic relative time string from timestamp
 */
export const getDynamicRelativeTime = (timestamp: string | number, currentNow: Date = new Date()): string => {
  if (typeof timestamp === 'string' && !timestamp.includes('T') && isNaN(Date.parse(timestamp))) {
    return timestamp; // If it's already a label like "Just now"
  }

  const timeVal = typeof timestamp === 'string' ? new Date(timestamp).getTime() : timestamp;
  if (isNaN(timeVal)) return 'Just now';

  const diffMs = currentNow.getTime() - timeVal;
  const diffMins = Math.max(0, Math.floor(diffMs / 60000));

  if (diffMins < 1) return 'Just now';
  if (diffMins === 1) return '1 min ago';
  if (diffMins < 60) return `${diffMins} mins ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours === 1) return '1 hr ago';
  if (diffHours < 24) return `${diffHours} hrs ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays} days ago`;
};

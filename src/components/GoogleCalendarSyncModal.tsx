import React, { useState } from 'react';
import { Region, DayForecast } from '../types';
import { 
  Calendar, 
  Download, 
  ExternalLink, 
  Check, 
  Bell, 
  Clock, 
  Share2, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface GoogleCalendarSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  region: Region;
  forecast: DayForecast;
}

export const GoogleCalendarSyncModal: React.FC<GoogleCalendarSyncModalProps> = ({
  isOpen,
  onClose,
  region,
  forecast,
}) => {
  const [synced, setSynced] = useState(false);
  const [downloadedICS, setDownloadedICS] = useState(false);

  if (!isOpen) return null;

  const cut = forecast.scheduledCut;
  const eventTitle = cut
    ? `⚡ TNEB Power Shutdown: ${region.name} (${region.feederCode})`
    : `⚡ Grid Advisory: ${region.name} (${forecast.status})`;

  const eventDescription = cut
    ? `Scheduled Power Shutdown by ${cut.substation}.\n` +
      `Notice: ${cut.officialNoticeNo}\n` +
      `Purpose: ${cut.purpose}\n\n` +
      `PRE-OUTAGE PREPARATION CHECKLIST:\n` +
      `• [ ] Charge phone, laptop & power banks before ${cut.from}\n` +
      `• [ ] Pre-cache offline maps & critical docs\n` +
      `• [ ] Fill overhead water tank\n` +
      `• [ ] Turn on inverter energy saver mode\n\n` +
      `Powered by CurrentCast (Weather Report for Blackouts)`
    : `CurrentCast Grid Advisory for ${region.name}.\n` +
      `Summary: ${forecast.summary}\n` +
      `Risk Score: ${forecast.outageRiskScore}/100`;

  // Generate Google Calendar Web URL
  const generateGoogleCalendarUrl = () => {
    const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const startTime = cut ? '160000' : '090000';
    const endTime = cut ? '200000' : '180000';
    const dates = `${todayStr}T${startTime}/${todayStr}T${endTime}`;

    const url = new URL('https://calendar.google.com/calendar/render');
    url.searchParams.set('action', 'TEMPLATE');
    url.searchParams.set('text', eventTitle);
    url.searchParams.set('details', eventDescription);
    url.searchParams.set('location', `${region.name}, ${region.district}, ${region.state}`);
    url.searchParams.set('dates', dates);
    return url.toString();
  };

  // Generate and download .ics iCalendar file
  const handleDownloadICS = () => {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//CurrentCast//Power Outage Forecast//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:cc-${region.id}-${Date.now()}@currentcast.app`,
      `DTSTAMP:${dateStr}T120000Z`,
      `DTSTART:${dateStr}T160000`,
      `DTEND:${dateStr}T200000`,
      `SUMMARY:${eventTitle}`,
      `DESCRIPTION:${eventDescription.replace(/\n/g, '\\n')}`,
      `LOCATION:${region.name}\\, ${region.district}\\, ${region.state}`,
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'TRIGGER:-PT24H',
      'ACTION:DISPLAY',
      'DESCRIPTION:Reminder: Power Outage tomorrow',
      'END:VALARM',
      'BEGIN:VALARM',
      'TRIGGER:-PT2H',
      'ACTION:DISPLAY',
      'DESCRIPTION:Reminder: Power Outage in 2 Hours - Charge devices now!',
      'END:VALARM',
      'BEGIN:VALARM',
      'TRIGGER:-PT30M',
      'ACTION:DISPLAY',
      'DESCRIPTION:Reminder: Power Outage in 30 Minutes',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `currentcast-outage-${region.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadedICS(true);
    setTimeout(() => setDownloadedICS(false), 4000);
  };

  const handleOpenGoogleCalendar = () => {
    setSynced(true);
    window.open(generateGoogleCalendarUrl(), '_blank');
    setTimeout(() => setSynced(false), 4000);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#1A222D] border border-[#2E3A4B] rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl text-slate-100 space-y-4 animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#2E3A4B]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#4285F4]/20 border border-[#4285F4]/30 flex items-center justify-center text-[#4285F4]">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base sm:text-lg">
                Google Calendar Sync Engine
              </h3>
              <p className="text-xs text-slate-400">
                Proactive T-24h & T-2h Outage Reminders
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#222C3A] text-slate-400 hover:text-white flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>

        {/* Outage Event Preview */}
        <div className="p-4 rounded-2xl bg-[#121820] border border-[#2E3A4B] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#FBBC05] uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Event Window</span>
            </span>
            <span className="font-mono text-slate-400">
              {forecast.dayLabel}, {cut ? `${cut.from} - ${cut.to}` : 'Today'}
            </span>
          </div>

          <div className="text-sm font-bold text-white leading-snug">
            {eventTitle}
          </div>

          <div className="text-xs text-slate-300 leading-relaxed bg-[#1A222D] p-3 rounded-xl border border-[#2E3A4B]/60">
            <div className="font-semibold text-slate-400 mb-1 flex items-center gap-1">
              <Bell className="w-3.5 h-3.5 text-[#4285F4]" />
              <span>Configured Multi-Stage Calendar Alarms:</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-300">
              <li><strong>24 Hours Before:</strong> Overview of upcoming maintenance window</li>
              <li><strong>2 Hours Before:</strong> Critical "Charge Devices & Water Tank" alert</li>
              <li><strong>30 Minutes Before:</strong> Final blackout preparation check</li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-1">
          <button
            id="sync-google-cal-btn"
            onClick={handleOpenGoogleCalendar}
            className="w-full py-3 px-4 rounded-2xl bg-[#4285F4] hover:bg-[#3367D6] text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 active:scale-98"
          >
            {synced ? <Check className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
            <span>Sync to Google Calendar</span>
          </button>

          <button
            id="download-ical-btn"
            onClick={handleDownloadICS}
            className="w-full py-2.5 px-4 rounded-2xl bg-[#222C3A] hover:bg-[#2E3A4B] text-slate-200 border border-[#2E3A4B] font-bold text-xs transition-all flex items-center justify-center gap-2"
          >
            {downloadedICS ? <Check className="w-4 h-4 text-[#34A853]" /> : <Download className="w-4 h-4 text-[#FBBC05]" />}
            <span>{downloadedICS ? 'ICS File Downloaded!' : 'Export Standard .ICS Calendar File (Apple/Outlook)'}</span>
          </button>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-[#2E3A4B]/60">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#34A853]" />
            <span>Feeder Code: {region.feederCode}</span>
          </span>
          <span>100% Client-Side Export</span>
        </div>
      </div>
    </div>
  );
};

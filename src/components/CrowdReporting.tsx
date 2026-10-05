import React, { useState } from 'react';
import { CrowdReport, Region } from '../types';
import { 
  Users, 
  AlertOctagon, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  ThumbsUp, 
  Send,
  Plus
} from 'lucide-react';

interface CrowdReportingProps {
  region: Region;
  reports: CrowdReport[];
  onAddReport: (report: CrowdReport) => void;
  onVerifyReport: (id: string) => void;
}

export const CrowdReporting: React.FC<CrowdReportingProps> = ({
  region,
  reports,
  onAddReport,
  onVerifyReport,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [streetName, setStreetName] = useState('');
  const [outageType, setOutageType] = useState<CrowdReport['outageType']>('Complete Blackout');
  const [comments, setComments] = useState('');
  const [submittedThanks, setSubmittedThanks] = useState(false);

  const regionReports = reports.filter((r) => r.regionId === region.id || !r.regionId);
  const totalVerifiedCount = regionReports.reduce((sum, r) => sum + r.verifiedCount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!streetName.trim()) return;

    const newReport: CrowdReport = {
      id: `crowd-${Date.now()}`,
      regionId: region.id,
      timestamp: 'Just now',
      streetName: streetName.trim(),
      outageType,
      verifiedCount: 1,
      userVerified: true,
      status: 'Investigating',
      comments: comments.trim() || 'Power lost in this street. Substation fuse check in progress.',
    };

    onAddReport(newReport);
    setStreetName('');
    setComments('');
    setShowForm(false);
    setSubmittedThanks(true);
    setTimeout(() => setSubmittedThanks(false), 4000);
  };

  return (
    <div className="bg-[#1A222D] rounded-3xl p-4 sm:p-6 border border-[#2E3A4B] shadow-lg space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#2E3A4B]">
        <div>
          <div className="text-[11px] font-bold text-[#4285F4] uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#4285F4]" />
            <span>Community Mesh Grid Sensing</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2 mt-0.5">
            <span>Crowd-Verified Outage Reports</span>
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-300 bg-[#121820] px-3 py-1.5 rounded-2xl border border-[#2E3A4B]">
            👥 {totalVerifiedCount} Verified Neighbors
          </span>

          <button
            onClick={() => setShowForm(!showForm)}
            className="px-3.5 py-1.5 rounded-2xl bg-[#FBBC05] hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Report Outage</span>
          </button>
        </div>
      </div>

      {submittedThanks && (
        <div className="p-3 bg-[#34A853]/20 border border-[#34A853]/40 rounded-2xl text-xs font-bold text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#34A853] shrink-0" />
          <span>Your report was broadcasted! Linemen dispatch notified.</span>
        </div>
      )}

      {/* New Report Submission Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="p-4 rounded-2xl bg-[#121820] border border-[#2E3A4B] space-y-3 animate-in fade-in">
          <div className="font-extrabold text-xs text-[#FBBC05] uppercase tracking-wider">
            Submit Outage Alert in {region.name}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <input
              type="text"
              required
              value={streetName}
              onChange={(e) => setStreetName(e.target.value)}
              placeholder="Street / Colony Name (e.g. Vadalur Road, Cross 2)"
              className="px-3.5 py-2 text-xs bg-[#1A222D] text-white border border-[#2E3A4B] rounded-xl focus:outline-none focus:border-[#4285F4]"
            />

            <select
              value={outageType}
              onChange={(e) => setOutageType(e.target.value as any)}
              className="px-3.5 py-2 text-xs bg-[#1A222D] text-white border border-[#2E3A4B] rounded-xl focus:outline-none focus:border-[#4285F4]"
            >
              <option value="Complete Blackout">🚨 Complete Blackout</option>
              <option value="Single Phase / Low Voltage">⚠️ Single Phase / Low Voltage (140V)</option>
              <option value="Transformer Spark">💥 Transformer Spark / Noise</option>
              <option value="Tree Fall on Cable">🌳 Tree Fall on Overhead Cable</option>
            </select>
          </div>

          <textarea
            rows={2}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Additional context (e.g. Inverter beeped, linemen working nearby, sparking sound...)"
            className="w-full px-3.5 py-2 text-xs bg-[#1A222D] text-white border border-[#2E3A4B] rounded-xl focus:outline-none focus:border-[#4285F4] resize-none"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-bold bg-[#4285F4] text-white rounded-xl hover:bg-[#3367D6] flex items-center gap-1.5 transition-colors"
            >
              <Send className="w-3.5 h-3.5 text-amber-300" />
              <span>Broadcast to Neighbors</span>
            </button>
          </div>
        </form>
      )}

      {/* Reports Feed */}
      <div className="space-y-3">
        {regionReports.map((report) => {
          return (
            <div
              key={report.id}
              className="p-3.5 sm:p-4 rounded-2xl bg-[#121820] border border-[#2E3A4B] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#4285F4] transition-colors"
            >
              <div className="space-y-1 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-extrabold text-white text-sm flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#4285F4]" />
                    <span>{report.streetName}</span>
                  </span>

                  <span className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-[#EA4335]/20 text-[#EA4335] border border-[#EA4335]/30">
                    {report.outageType}
                  </span>

                  <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {report.timestamp}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {report.comments}
                </p>

                <div className="text-[11px] font-bold text-[#4285F4] flex items-center gap-1.5 pt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4285F4] animate-pulse" />
                  <span>Status: {report.status}</span>
                </div>
              </div>

              {/* Verify / "Me Too" Button */}
              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <button
                  onClick={() => onVerifyReport(report.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    report.userVerified
                      ? 'bg-[#34A853]/20 text-[#34A853] border border-[#34A853]/40'
                      : 'bg-[#1A222D] hover:bg-[#222C3A] text-slate-300 border border-[#2E3A4B]'
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${report.userVerified ? 'fill-[#34A853] text-[#34A853]' : ''}`} />
                  <span>{report.verifiedCount} Affected</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

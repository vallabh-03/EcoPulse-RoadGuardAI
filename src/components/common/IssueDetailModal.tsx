import React, { useState } from 'react';
import { useEcoPulse } from '../../context/EcoPulseContext.tsx';
import { PriorityScoreDisplay } from './PriorityScoreDisplay.tsx';
import { IssueStatus } from '../../types/index.ts';
import {
  X,
  MapPin,
  Calendar,
  User,
  Users,
  CheckCircle2,
  ArrowRight,
  Clock,
  Sparkles,
  AlertOctagon,
  Wrench,
} from 'lucide-react';

const CREW_OPTIONS = [
  'VMC Public Health & Sanitation Wing (Vijayawada)',
  'GMC Municipal Solid Waste & Desilting Squad (Guntur)',
  'AP PWD Road Infrastructure & Bitumen Patching Division',
  'VMC Engineering & Stormwater Canal Taskforce',
  'GMC Drainage & Monsoon Preparedness Cell',
  'Krishna Riverfront & Canal Environmental Cell',
  'VMC/GMC Ward Rapid Response Mobile Team',
  'Citizen Swachh Volunteer Team',
];

export const IssueDetailModal: React.FC = () => {
  const { issues, inspectedIssueId, setInspectedIssueId, updateIssueStatus } = useEcoPulse();

  const issue = issues.find((i) => i.id === inspectedIssueId);

  const [selectedCrew, setSelectedCrew] = useState<string>('');
  const [resolutionNotes, setResolutionNotes] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  if (!issue) return null;

  const isRoadGuard = issue.reportType === 'roadguard';

  const handleStatusChange = (nextStatus: IssueStatus) => {
    setIsUpdating(true);
    const defaultCrew = isRoadGuard
      ? 'AP PWD Road Infrastructure & Bitumen Patching Division'
      : issue.city === 'Guntur'
      ? 'GMC Municipal Solid Waste & Desilting Squad (Guntur)'
      : 'VMC Public Health & Sanitation Wing (Vijayawada)';
    const crewToAssign = selectedCrew || issue.assignedTeam || defaultCrew;
    const defaultNotes = isRoadGuard
      ? 'Cold-mix bitumen patching completed. Surface leveled and inspected for traffic clearance.'
      : 'Debris desilted, sorted, and transported to authorized municipal recycling facility.';
    const notesToSave = nextStatus === 'Resolved' ? (resolutionNotes || defaultNotes) : issue.resolutionNotes;

    updateIssueStatus(issue.id, nextStatus, crewToAssign, notesToSave);

    setTimeout(() => {
      setIsUpdating(false);
    }, 200);
  };

  const statusSteps: IssueStatus[] = ['Reported', 'Assigned', 'In Progress', 'Resolved'];
  const currentStepIndex = statusSteps.indexOf(issue.status);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
      onClick={() => setInspectedIssueId(null)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="issue-modal-title"
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-100 bg-[#FAFBFB]">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono tabular-nums mb-1">
              <span className={`font-semibold ${isRoadGuard ? 'text-amber-800' : 'text-emerald-800'}`}>
                {issue.id}
              </span>
              <span aria-hidden="true">·</span>
              <span>{isRoadGuard ? 'EcoPulse RoadGuard' : 'Environmental'}</span>
              <span aria-hidden="true">·</span>
              <span>{issue.wardNumber || issue.neighborhood}</span>
            </div>
            <h2 id="issue-modal-title" className="text-xl font-bold text-slate-900 leading-snug">
              {issue.title}
            </h2>
          </div>
          <button
            onClick={() => setInspectedIssueId(null)}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Status Pipeline Tracker */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-600 mb-3 tracking-wide">
              MUNICIPAL REMEDIATION PIPELINE
            </p>
            <div className="grid grid-cols-4 gap-2">
              {statusSteps.map((step, idx) => {
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={step} className="text-center">
                    <div
                      className={`h-2 rounded-full mb-2 transition-colors ${
                        isCurrent
                          ? isRoadGuard ? 'bg-amber-600' : 'bg-emerald-600'
                          : isPassed
                          ? isRoadGuard ? 'bg-amber-300' : 'bg-emerald-300'
                          : 'bg-slate-200'
                      }`}
                    />
                    <span
                      className={`text-xs block ${
                        isCurrent
                          ? isRoadGuard ? 'font-bold text-amber-900' : 'font-bold text-emerald-900'
                          : isPassed
                          ? 'font-medium text-slate-700'
                          : 'text-slate-400'
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-white border border-slate-200 rounded-xl">
              <span className="text-[11px] font-medium text-slate-500 block mb-1">Priority Index</span>
              <PriorityScoreDisplay score={issue.priorityScore} breakdown={issue.priorityBreakdown} size="md" />
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-xl">
              <span className="text-[11px] font-medium text-slate-500 block mb-1">Hazard Severity</span>
              <span
                className={`text-sm font-semibold ${
                  issue.severity === 'Critical'
                    ? 'text-rose-700'
                    : issue.severity === 'High'
                    ? 'text-amber-700'
                    : 'text-emerald-700'
                }`}
              >
                {issue.severity}
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">50% formula weight</span>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-xl">
              <span className="text-[11px] font-medium text-slate-500 block mb-1">Citizen Confirmations</span>
              <span className="text-sm font-semibold text-slate-900 font-mono tabular-nums">
                {issue.reportCount} citizen{issue.reportCount > 1 ? 's' : ''}
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">30% cluster weight</span>
            </div>
          </div>

          {/* RoadGuard Crater Detail Card */}
          {isRoadGuard && issue.roadDamageDetails && (
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <AlertOctagon className="w-4 h-4 text-amber-700" />
                  RoadGuard Pothole Structural Diagnostics
                </span>
                <span className="text-xs font-mono font-bold text-amber-900">
                  {issue.roadDamageDetails.depthCm} cm deep
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-amber-900 pt-1">
                <div>
                  <span className="text-slate-500 block text-[10px]">LANE CORRIDOR</span>
                  <span className="font-semibold">{issue.roadDamageDetails.laneImpact}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">ACCIDENT HAZARD</span>
                  <span className="font-semibold">{issue.roadDamageDetails.trafficRisk}</span>
                </div>
              </div>
            </div>
          )}

          {/* Image & Description */}
          {issue.imageUrl && (
            <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 max-h-56">
              <img
                src={issue.imageUrl}
                alt={issue.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium rounded-md">
                Field Photo Evidence
              </div>
            </div>
          )}

          <div>
            <h4 className="text-xs font-semibold text-slate-500 tracking-wide mb-1.5">
              INCIDENT DESCRIPTION
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed bg-[#FAFBFB] p-3.5 rounded-xl border border-slate-100">
              {issue.description}
            </p>
          </div>

          {/* Location & Reporter Details */}
          <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-medium text-slate-900">{issue.landmark || issue.locationDetails}</span>
              </div>
              <div className="text-[11px] text-slate-500">
                {issue.wardNumber && <strong className="text-slate-700 mr-2">{issue.wardNumber}</strong>}
                {issue.neighborhood}
              </div>
              <div className="flex items-center gap-2 font-mono tabular-nums text-slate-500 text-[11px]">
                <span>Lat: {issue.coordinates.lat}</span>
                <span aria-hidden="true">·</span>
                <span>Lng: {issue.coordinates.lng}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Reported by <strong className="text-slate-900">{issue.reporterName}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-mono tabular-nums">
                  {new Date(issue.reportedAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Assigned Crew & Resolution Notes */}
          {issue.assignedTeam && (
            <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 text-xs">
              <div className="flex items-center gap-2 font-semibold text-emerald-950 mb-1">
                <Users className="w-4 h-4 text-emerald-700" />
                Assigned Team: {issue.assignedTeam}
              </div>
              {issue.assignedAt && (
                <div className="text-slate-500 font-mono tabular-nums">
                  Dispatched on {new Date(issue.assignedAt).toLocaleDateString()}
                </div>
              )}
            </div>
          )}

          {issue.status === 'Resolved' && (
            <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
              <div className="flex items-center gap-2 font-bold text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                Remediation Complete & Verified
              </div>
              <p className="leading-relaxed text-slate-700">{issue.resolutionNotes}</p>
              {issue.resolvedAt && (
                <p className="text-[11px] text-slate-500 font-mono tabular-nums">
                  Closed on {new Date(issue.resolvedAt).toLocaleString()}
                </p>
              )}
            </div>
          )}

          {/* Working Status Transition Controls */}
          {issue.status !== 'Resolved' && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-800">
                  MUNICIPAL ACTION ADVANCEMENT
                </p>
                <span className="text-[11px] text-emerald-700 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Resolving awards +100 GreenPoints
                </span>
              </div>

              {issue.status === 'Reported' && (
                <div className="space-y-2">
                  <label className="text-xs text-slate-700 font-semibold block">Select Civic Authority / Division:</label>
                  <select
                    value={selectedCrew || issue.assignedTeam || (isRoadGuard ? 'AP PWD Road Infrastructure & Bitumen Patching Division' : CREW_OPTIONS[0])}
                    onChange={(e) => setSelectedCrew(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white text-[#111827] font-medium border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  >
                    {CREW_OPTIONS.map((crew) => (
                      <option key={crew} value={crew} className="text-[#111827] bg-white">
                        {crew}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {issue.status === 'In Progress' && (
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-700 font-semibold block">Inspection & Remediation Notes:</label>
                  <input
                    type="text"
                    placeholder={isRoadGuard ? 'e.g. Cold-mix asphalt compacted, certified safe for two-wheelers.' : 'e.g. 450kg plastic waste desilted and delivered to recycling centre.'}
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white text-[#111827] placeholder:text-[#6B7280] border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 font-medium"
                  />
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2 pt-1">
                {issue.status === 'Reported' && (
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => handleStatusChange('Assigned')}
                    className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <span>Dispatch Team</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {(issue.status === 'Reported' || issue.status === 'Assigned') && (
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => handleStatusChange('In Progress')}
                    className="px-4 py-2 text-xs font-semibold text-slate-900 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Clock className="w-3.5 h-3.5 text-amber-700" />
                    <span>Commence Field Work (In Progress)</span>
                  </button>
                )}

                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => handleStatusChange('Resolved')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verify Remediation & Mark Resolved</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono tabular-nums">
            {isRoadGuard
              ? `RoadGuard Pothole Tracking ID: ${issue.id}`
              : `Estimated waste volume: ${issue.estimatedWasteKg} kg`}
          </span>
          <button
            type="button"
            onClick={() => setInspectedIssueId(null)}
            className="px-4 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

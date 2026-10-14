import React from 'react';
import { useEcoPulse } from '../../context/EcoPulseContext.tsx';
import { PriorityScoreDisplay } from '../common/PriorityScoreDisplay.tsx';
import {
  FileText,
  Clock,
  CheckCircle2,
  Percent,
  PlusCircle,
  MapPin,
  TrendingUp,
  Award,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  AlertOctagon,
  Wrench,
} from 'lucide-react';

export const OverviewTab: React.FC = () => {
  const {
    metrics,
    highestPriorityHotspots,
    filteredIssues,
    challenges,
    selectedNeighborhood,
    domainFilter,
    setDomainFilter,
    setActiveTab,
    setInspectedIssueId,
    joinChallenge,
  } = useEcoPulse();

  // Category breakdown derived from real current data
  const categoryCounts = React.useMemo(() => {
    const map = new Map<string, number>();
    filteredIssues.forEach((issue) => {
      map.set(issue.category, (map.get(issue.category) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([category, count]) => ({
        category,
        count,
        percent: filteredIssues.length > 0 ? Math.round((count / filteredIssues.length) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredIssues]);

  // Recent reports (first 5 from filtered list)
  const recentReports = React.useMemo(() => {
    return [...filteredIssues].slice(0, 5);
  }, [filteredIssues]);

  // Active challenge spotlight
  const activeChallenge = challenges.find((c) => c.status === 'Active');

  return (
    <div className="space-y-6">
      {/* Top Welcome & Quick Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
            <span>Civic Ward Console</span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200/60">{selectedNeighborhood}</span>
            <span aria-hidden="true">·</span>
            <span>Swachh & RoadGuard Division</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
            Civic Environmental & Road Action Console
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Community reporting for waste vulnerability points, Krishna canal protection, and EcoPulse RoadGuard pothole repair across Vijayawada & Guntur.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setActiveTab('map')}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-xs cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-cyan-600" />
            <span>Ward Map</span>
          </button>

          <button
            onClick={() => setActiveTab('report')}
            className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 hover:brightness-110 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap shadow-xs cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Report Issue / Pothole</span>
          </button>
        </div>
      </div>

      {/* Domain Switcher Pill Strip */}
      <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200 text-xs shadow-xs">
        <div className="flex items-center gap-1">
          <span className="text-slate-400 font-medium px-2 text-[11px] uppercase tracking-wide">
            Viewing:
          </span>
          <button
            onClick={() => setDomainFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              domainFilter === 'all'
                ? 'bg-slate-900 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Reports ({metrics.totalReports})
          </button>
          <button
            onClick={() => setDomainFilter('environmental')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              domainFilter === 'environmental'
                ? 'bg-emerald-700 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Environmental & Waste ({metrics.environmentalCount})
          </button>
          <button
            onClick={() => setDomainFilter('roadguard')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
              domainFilter === 'roadguard'
                ? 'bg-amber-600 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>RoadGuard Potholes ({metrics.roadguardCount})</span>
          </button>
        </div>

        <span className="hidden md:inline-block text-[11px] text-slate-400 font-mono tabular-nums">
          Deterministic 50/30/20 Prioritization Active
        </span>
      </div>

      {/* Primary KPI Metric Strip — Vibrant Multi-Colored Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Reports (Indigo/Blue) */}
        <div className="p-4 bg-gradient-to-br from-white via-white to-blue-50/40 border border-blue-200/80 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-600">Total Ward Reports</span>
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {metrics.totalReports}
            </span>
            <span className="text-xs text-blue-700 font-medium">logged</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-mono tabular-nums">
            <span className="text-emerald-700 font-semibold">{metrics.environmentalCount} eco</span> · <span className="text-amber-700 font-semibold">{metrics.roadguardCount} road hazards</span>
          </div>
        </div>

        {/* KPI 2: Pending Workflows (Amber/Orange Hazard) */}
        <div className="p-4 bg-gradient-to-br from-white via-white to-amber-50/50 border border-amber-200/80 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-600">Pending Remediation</span>
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-800 font-mono tabular-nums">
              {metrics.pendingCount}
            </span>
            <span className="text-xs text-amber-700 font-medium">in queue</span>
          </div>
          <div className="mt-2 text-[11px] text-rose-600 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            {metrics.criticalCount} marked critical danger
          </div>
        </div>

        {/* KPI 3: Issues Resolved (Eco Emerald) */}
        <div className="p-4 bg-gradient-to-br from-white via-white to-emerald-50/40 border border-emerald-200/80 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-600">Resolved & Closed</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-800 font-mono tabular-nums">
              {metrics.resolvedCount}
            </span>
            <span className="text-xs text-emerald-700 font-medium">completed</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-mono tabular-nums">
            {metrics.totalWasteCleanedKg} kg waste · {metrics.potholesPatched} craters fixed
          </div>
        </div>

        {/* KPI 4: Resolution Velocity (Royal Violet) */}
        <div className="p-4 bg-gradient-to-br from-white via-white to-violet-50/40 border border-violet-200/80 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-600">Resolution Velocity</span>
            <div className="w-7 h-7 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-violet-900 font-mono tabular-nums">
              {metrics.resolutionRate}%
            </span>
            <span className="text-xs text-violet-700 font-medium">closure rate</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-mono tabular-nums">
            Avg Priority: <span className="font-semibold text-violet-700">{metrics.averagePriorityScore}/100</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Priority Hotspots & Community Challenges */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Highest-Priority Hotspots & Pothole Queue */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  Urgent Priority Intervention Queue
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Severity (50%) + Citizen Reports (30%) + Days Unresolved (20%)
                </p>
              </div>

              <button
                onClick={() => setActiveTab('management')}
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 transition-colors"
              >
                <span>View Full List ({highestPriorityHotspots.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {highestPriorityHotspots.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  No active unresolved hotspots in this ward/filter!
                </div>
              ) : (
                highestPriorityHotspots.slice(0, 4).map((issue) => {
                  const isRoadGuard = issue.reportType === 'roadguard';

                  return (
                    <div
                      key={issue.id}
                      onClick={() => setInspectedIssueId(issue.id)}
                      className="py-3.5 flex items-center justify-between gap-4 cursor-pointer group hover:bg-[#FAFBFB] transition-colors -mx-2 px-2 rounded-lg"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                          <span className={`font-mono tabular-nums font-semibold ${isRoadGuard ? 'text-amber-800' : 'text-emerald-800'}`}>
                            {issue.id}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="font-medium text-slate-700">{issue.category}</span>
                          <span aria-hidden="true">·</span>
                          <span>{issue.wardNumber || issue.neighborhood}</span>
                        </div>
                        <h3 className="text-sm font-semibold text-slate-900 group-hover:text-emerald-900 transition-colors truncate">
                          {issue.title}
                        </h3>
                        <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span className="truncate max-w-[220px]">{issue.landmark || issue.locationDetails}</span>
                          </span>
                          {isRoadGuard && issue.roadDamageDetails && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="text-amber-800 font-semibold font-mono">
                                {issue.roadDamageDetails.depthCm}cm depth · {issue.roadDamageDetails.laneImpact}
                              </span>
                            </>
                          )}
                          <span aria-hidden="true">·</span>
                          <span>Status: <strong className="font-semibold text-slate-700">{issue.status}</strong></span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <PriorityScoreDisplay
                          score={issue.priorityScore}
                          breakdown={issue.priorityBreakdown}
                          size="md"
                        />
                        <span className="text-[11px] text-slate-400 block mt-0.5 font-mono tabular-nums">
                          {issue.reportCount} citizen report{issue.reportCount > 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Recent Reports Stream */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Recent Indian Ward Reports</h2>
              <button
                onClick={() => setActiveTab('report')}
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
              >
                <span>+ Log New Hotspot</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 font-medium border-b border-slate-100">
                    <th className="py-2.5 pr-3 font-medium">Incident & Location</th>
                    <th className="py-2.5 px-3 font-medium">Type</th>
                    <th className="py-2.5 px-3 font-medium">Severity</th>
                    <th className="py-2.5 px-3 font-medium">Status</th>
                    <th className="py-2.5 pl-3 text-right font-medium">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentReports.map((report) => (
                    <tr
                      key={report.id}
                      onClick={() => setInspectedIssueId(report.id)}
                      className="hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <td className="py-2.5 pr-3">
                        <span className="font-semibold text-slate-900 block truncate max-w-[200px]">
                          {report.title}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono tabular-nums">
                          {report.id} · {report.neighborhood}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`text-[11px] font-medium ${report.reportType === 'roadguard' ? 'text-amber-800' : 'text-emerald-800'}`}>
                          {report.reportType === 'roadguard' ? 'RoadGuard' : 'Environmental'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`font-semibold ${
                            report.severity === 'Critical'
                              ? 'text-rose-700'
                              : report.severity === 'High'
                              ? 'text-amber-700'
                              : 'text-emerald-700'
                          }`}
                        >
                          {report.severity}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="text-slate-700 font-medium">{report.status}</span>
                      </td>
                      <td className="py-2.5 pl-3 text-right font-mono tabular-nums font-semibold text-slate-900">
                        {report.priorityScore}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Col: Category Breakdown & Swachh / RoadGuard Challenge Progress */}
        <div className="space-y-6">
          {/* Category Breakdown Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-1">Hazard Distribution</h2>
            <p className="text-xs text-slate-500 mb-4">Breakdown across {selectedNeighborhood}</p>

            <div className="space-y-3">
              {categoryCounts.map((item) => (
                <div key={item.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700 truncate max-w-[180px]">{item.category}</span>
                    <span className="font-mono tabular-nums text-slate-500">
                      {item.count} ({item.percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-700 h-full rounded-full transition-all duration-300"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Civic Challenge Card */}
          {activeChallenge && (
            <div className="bg-[#FAFBFB] border border-slate-200 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-700" />
                  {activeChallenge.reportType === 'roadguard' ? 'RoadGuard Blitz' : 'Swachh Ward Drive'}
                </span>
                <span className="text-[11px] font-mono tabular-nums text-slate-500">
                  {activeChallenge.daysRemaining} days left
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 mb-1">
                {activeChallenge.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {activeChallenge.description}
              </p>

              {/* Progress bar */}
              <div className="space-y-1.5 mb-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Target</span>
                  <span className="font-mono tabular-nums font-semibold text-slate-900">
                    {activeChallenge.currentKg} / {activeChallenge.targetKg} {activeChallenge.unitLabel}
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full"
                    style={{
                      width: `${Math.min(
                        100,
                        (activeChallenge.currentKg / activeChallenge.targetKg) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <div className="text-xs text-slate-600 font-mono tabular-nums">
                  {activeChallenge.participantsCount} citizens enrolled
                </div>

                {activeChallenge.isJoined ? (
                  <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Enrolled (+{activeChallenge.rewardPoints} pts)
                  </span>
                ) : (
                  <button
                    onClick={() => joinChallenge(activeChallenge.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    Join Campaign
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Civic Governance Note */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <span className="font-semibold text-slate-900 block">Civic Coordination SLA</span>
            <p className="leading-relaxed">
              Reports are synchronized directly with VMC/GMC Ward Sanitation and AP PWD Road Infrastructure wings. Critical potholes on two-wheeler corridors are flagged for 48-hour response.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

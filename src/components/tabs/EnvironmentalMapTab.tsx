import React, { useState, useMemo } from 'react';
import { useEcoPulse } from '../../context/EcoPulseContext.tsx';
import { PriorityScoreDisplay } from '../common/PriorityScoreDisplay.tsx';
import { SupportedCity } from '../../types/index.ts';
import {
  MapPin,
  CheckCircle2,
  AlertOctagon,
  ChevronRight,
  RotateCcw,
  Compass,
} from 'lucide-react';

export const EnvironmentalMapTab: React.FC = () => {
  const {
    filteredIssues,
    selectedCity,
    setSelectedCity,
    selectedNeighborhood,
    domainFilter,
    setDomainFilter,
    setInspectedIssueId,
  } = useEcoPulse();

  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);

  // Apply map-level filters
  const displayedIssues = useMemo(() => {
    return filteredIssues.filter((issue) => {
      if (severityFilter !== 'All' && issue.severity !== severityFilter) return false;
      if (statusFilter !== 'All' && issue.status !== statusFilter) return false;
      return true;
    });
  }, [filteredIssues, severityFilter, statusFilter]);

  // Selected hotspot object
  const activeIssue = useMemo(() => {
    if (!selectedPinId) {
      return displayedIssues[0] || null;
    }
    return displayedIssues.find((i) => i.id === selectedPinId) || displayedIssues[0] || null;
  }, [selectedPinId, displayedIssues]);

  return (
    <div className="space-y-4">
      {/* Map Header & Filter Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-sm text-slate-100">
        <div>
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-medium">
            <span>Andhra Pradesh Twin Cities GIS Grid</span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-white">{selectedCity}</span>
            <span aria-hidden="true">·</span>
            <span className="text-amber-400 font-semibold">VMC & GMC Municipal Infrastructure</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Vijayawada & Guntur Road Hazard & Pothole Map
          </h1>
        </div>

        {/* Functional Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* City Filter */}
          <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-xs">
            {(['All Cities', 'Vijayawada', 'Guntur'] as const).map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-2.5 py-1 font-semibold rounded-md transition-colors cursor-pointer ${
                  selectedCity === city
                    ? city === 'Vijayawada'
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-xs'
                      : city === 'Guntur'
                      ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-xs'
                      : 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {city === 'All Cities' ? 'Both Cities' : city}
              </button>
            ))}
          </div>

          {/* Domain Filter */}
          <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setDomainFilter('all')}
              className={`px-2.5 py-1 font-medium rounded-md transition-colors cursor-pointer ${
                domainFilter === 'all'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setDomainFilter('roadguard')}
              className={`px-2.5 py-1 font-medium rounded-md transition-colors flex items-center gap-1 cursor-pointer ${
                domainFilter === 'roadguard'
                  ? 'bg-amber-600 text-white font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <AlertOctagon className="w-3 h-3 text-amber-300" />
              <span>RoadGuard</span>
            </button>
          </div>

          {/* Status Segmented Control */}
          <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-xs">
            {['All', 'Reported', 'In Progress', 'Resolved'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 font-medium rounded-md transition-colors cursor-pointer ${
                  statusFilter === st
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Map Viewport & Hotspot Inspector Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        {/* Interactive Vector Map Canvas of Vijayawada & Guntur */}
        <div className="lg:col-span-2 relative bg-[#0A0F1D] rounded-2xl border border-slate-800 overflow-hidden shadow-inner h-[540px] select-none">
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 1000 600"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="krishnaRiver" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0284c7" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#0369a1" stopOpacity="0.85" />
              </linearGradient>
              <pattern id="gridPatternAP" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0e2a1e" strokeWidth="0.8" strokeDasharray="2,2" />
              </pattern>
            </defs>

            {/* Grid */}
            <rect width="1000" height="600" fill="url(#gridPatternAP)" />

            {/* KRISHNA RIVER CORRIDOR DIVIDING VIJAYAWADA & GUNTUR */}
            <path
              d="M 50 240 C 250 280, 500 240, 750 260 S 950 290, 980 320"
              fill="none"
              stroke="url(#krishnaRiver)"
              strokeWidth="48"
              strokeLinecap="round"
            />
            <text x="320" y="265" fill="#7dd3fc" fontSize="13" fontWeight="700" opacity="0.9">
              KRISHNA RIVER (Prakasam Barrage & Varadhi Corridor)
            </text>

            {/* VIJAYAWADA SECTOR (NORTH OF KRISHNA RIVER) */}
            <path
              d="M 120 40 Q 520 20 850 70 T 820 230 Q 420 220 180 200 Z"
              fill="#062817"
              fillOpacity="0.5"
              stroke="#059669"
              strokeWidth="1.5"
            />
            <text x="240" y="70" fill="#34d399" fontSize="14" fontWeight="800" letterSpacing="1">
              VIJAYAWADA MUNICIPAL CORPORATION (VMC)
            </text>

            {/* Vijayawada Localities: Benz Circle & MG Road */}
            <circle cx="540" cy="140" r="45" fill="#064e3b" fillOpacity="0.6" stroke="#10b981" strokeWidth="1" />
            <text x="500" y="142" fill="#a7f3d0" fontSize="10" fontWeight="700">
              Benz Circle
            </text>
            <text x="490" y="156" fill="#6ee7b7" fontSize="9" fontWeight="500">
              MG Road (Bandar Rd)
            </text>

            {/* Autonagar Industrial Area */}
            <rect x="680" cy="110" width="100" height="60" rx="8" fill="#1e293b" fillOpacity="0.6" stroke="#475569" strokeWidth="1" />
            <text x="695" y="145" fill="#cbd5e1" fontSize="10" fontWeight="700">
              Autonagar 100ft
            </text>

            {/* Eluru Road & Governorpet */}
            <text x="420" y="105" fill="#a7f3d0" fontSize="10" fontWeight="600">
              Eluru Road · Governorpet
            </text>

            {/* GUNTUR SECTOR (SOUTH OF KRISHNA RIVER) */}
            <path
              d="M 80 320 Q 480 300 880 340 T 780 560 Q 380 580 120 520 Z"
              fill="#0b2e20"
              fillOpacity="0.5"
              stroke="#047857"
              strokeWidth="1.5"
            />
            <text x="240" y="360" fill="#34d399" fontSize="14" fontWeight="800" letterSpacing="1">
              GUNTUR MUNICIPAL CORPORATION (GMC)
            </text>

            {/* Guntur Localities: Brodipet & Arundalpet */}
            <circle cx="480" cy="420" r="45" fill="#064e3b" fillOpacity="0.6" stroke="#10b981" strokeWidth="1" />
            <text x="455" y="420" fill="#a7f3d0" fontSize="10" fontWeight="700">
              Brodipet Main
            </text>
            <text x="445" y="434" fill="#6ee7b7" fontSize="9" fontWeight="500">
              Commercial Lines
            </text>

            {/* Arundalpet Collectorate */}
            <text x="560" y="420" fill="#cbd5e1" fontSize="10" fontWeight="600">
              Arundalpet Collectorate
            </text>

            {/* Amaravathi Road */}
            <text x="260" y="430" fill="#cbd5e1" fontSize="10" fontWeight="600">
              Amaravathi Road
            </text>

            {/* Mirchi Yard Bypass */}
            <text x="640" y="520" fill="#f59e0b" fontSize="10" fontWeight="700">
              Mirchi Yard Bypass
            </text>

            {/* NH16 Twin Cities Connecting Express Highway */}
            <path
              d="M 520 40 L 520 240 L 490 320 L 490 580"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d="M 520 40 L 520 240 L 490 320 L 490 580"
              fill="none"
              stroke="#0f172a"
              strokeWidth="1.5"
              strokeDasharray="6,4"
            />
            <text x="535" y="220" fill="#fbbf24" fontSize="11" fontWeight="800">
              NH16 Express Highway
            </text>

            {/* Kanaka Durga Varadhi Bridge across Krishna */}
            <rect x="500" y="235" width="40" height="20" fill="#334155" stroke="#94a3b8" strokeWidth="1" rx="3" />
            <text x="460" y="270" fill="#f8fafc" fontSize="9" fontWeight="700">
              Varadhi Bridge
            </text>
          </svg>

          {/* Interactive Hotspot & Pothole Markers */}
          {displayedIssues.map((issue) => {
            const isSelected = activeIssue?.id === issue.id;
            const isResolved = issue.status === 'Resolved';
            const isRoadGuard = issue.reportType === 'roadguard';
            const isOver70 = (issue.roadDamageDetails?.assessmentScore || 0) > 70;

            let pinBg = 'bg-slate-700';
            if (isResolved) {
              pinBg = 'bg-emerald-500';
            } else if (isOver70) {
              pinBg = 'bg-rose-600';
            } else if (isRoadGuard) {
              pinBg = 'bg-amber-600';
            } else {
              pinBg = 'bg-emerald-700';
            }

            return (
              <div
                key={issue.id}
                onClick={() => setSelectedPinId(issue.id)}
                style={{
                  left: `${issue.coordinates.xPercent}%`,
                  top: `${issue.coordinates.yPercent}%`,
                }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform duration-150 ${
                  isSelected ? 'scale-125 z-30' : 'hover:scale-115 z-20'
                }`}
                title={`${issue.title} (${issue.city}) - Score: ${issue.priorityScore}`}
              >
                {/* Ripple for High Priority >70 */}
                {!isResolved && isOver70 && (
                  <div className="absolute -inset-2 rounded-full opacity-50 bg-rose-500 animate-ping" />
                )}

                {/* Marker Body */}
                <div
                  className={`flex items-center justify-center text-white rounded-full shadow-lg font-mono text-[10px] font-bold border-2 transition-all ${
                    isSelected ? 'w-8 h-8 border-white ring-2 ring-emerald-400' : 'w-7 h-7 border-slate-900'
                  } ${pinBg}`}
                >
                  {isResolved ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : isRoadGuard ? (
                    <AlertOctagon className="w-3.5 h-3.5" />
                  ) : (
                    issue.priorityScore
                  )}
                </div>

                {/* Pin Tooltip */}
                {isSelected && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 whitespace-nowrap bg-slate-950 text-white text-[10px] font-mono py-1 px-2.5 rounded-md shadow-2xl border border-slate-700 pointer-events-none">
                    {issue.id} · {issue.city} ({issue.wardNumber || issue.neighborhood})
                  </div>
                )}
              </div>
            );
          })}

          {/* Map Legend */}
          <div className="absolute bottom-3 left-3 bg-slate-950/90 backdrop-blur-md p-2.5 rounded-xl border border-slate-800 text-[11px] shadow-lg space-y-1 text-slate-300">
            <span className="font-semibold text-white block text-[10px] uppercase tracking-wide">
              AP Twin Cities Legend
            </span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block" />
                Severe Crater (&gt;70)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block" />
                RoadGuard Incident
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                Resolved
              </span>
            </div>
          </div>

          <div className="absolute top-3 right-3 bg-slate-950/90 backdrop-blur-md py-1 px-3 rounded-lg border border-slate-800 text-xs font-mono text-emerald-400 shadow-sm">
            {displayedIssues.length} active pins in {selectedCity}
          </div>
        </div>

        {/* Selected Hotspot Inspector Card */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-sm space-y-4 text-slate-100">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-semibold text-slate-400 tracking-wide uppercase">
              MUNICIPAL INCIDENT INSPECTION
            </span>
            {activeIssue && (
              <span className="text-xs font-mono text-emerald-400 font-bold">
                {activeIssue.id}
              </span>
            )}
          </div>

          {activeIssue ? (
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <span className={`font-semibold ${activeIssue.reportType === 'roadguard' ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {activeIssue.city} · {activeIssue.reportType === 'roadguard' ? 'RoadGuard Pothole' : 'Environmental'}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{activeIssue.wardNumber || activeIssue.neighborhood}</span>
                </div>
                <h3 className="text-base font-bold text-white leading-snug">
                  {activeIssue.title}
                </h3>
              </div>

              {/* Priority & Status Metrics */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400 block mb-0.5">Priority Score</span>
                  <PriorityScoreDisplay
                    score={activeIssue.priorityScore}
                    breakdown={activeIssue.priorityBreakdown}
                    size="md"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block mb-0.5">Status</span>
                  <span className="text-xs font-bold text-white">
                    {activeIssue.status}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {activeIssue.severity} hazard
                  </span>
                </div>
              </div>

              {/* RoadGuard Diagnostics */}
              {activeIssue.reportType === 'roadguard' && activeIssue.roadDamageDetails && (
                <div className="p-3 bg-amber-950/40 rounded-xl border border-amber-500/30 text-xs text-amber-200 space-y-1">
                  <div className="flex items-center justify-between font-bold">
                    <span className="flex items-center gap-1 text-amber-400">
                      <AlertOctagon className="w-3.5 h-3.5" />
                      Crater Depth Diagnostics
                    </span>
                    <span className="font-mono text-white text-sm">{activeIssue.roadDamageDetails.depthCm} cm deep</span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Lane: {activeIssue.roadDamageDetails.laneImpact} · Risk: {activeIssue.roadDamageDetails.trafficRisk}
                  </div>
                  {activeIssue.roadDamageDetails.demoRoutingDestination && (
                    <div className="text-[10px] text-emerald-400 pt-1 font-mono">
                      {activeIssue.roadDamageDetails.demoRoutingDestination}
                    </div>
                  )}
                </div>
              )}

              {/* Photo preview */}
              {activeIssue.imageUrl && (
                <div className="rounded-xl overflow-hidden border border-slate-800 h-32 bg-slate-950">
                  <img
                    src={activeIssue.imageUrl}
                    alt={activeIssue.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              {/* Location details */}
              <div className="space-y-1 text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center gap-1.5 font-medium text-white">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{activeIssue.landmark || activeIssue.locationDetails}</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono pl-5">
                  Cluster: {activeIssue.reportCount} reports · Coordinates: {activeIssue.coordinates.lat}° N, {activeIssue.coordinates.lng}° E
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                {activeIssue.description}
              </p>

              {/* Action */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setInspectedIssueId(activeIssue.id)}
                  className="w-full py-2.5 px-3 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Open Full Municipal Detail</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-slate-400">
              Select any marker on the Vijayawada / Guntur map to inspect its details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

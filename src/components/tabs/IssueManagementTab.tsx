import React, { useState, useMemo } from 'react';
import { useEcoPulse } from '../../context/EcoPulseContext.tsx';
import { PriorityScoreDisplay } from '../common/PriorityScoreDisplay.tsx';
import { IssueStatus, IssueCategory, IssueSeverity, ReportType } from '../../types/index.ts';
import {
  Search,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  ArrowRight,
  MapPin,
  LayoutList,
  LayoutGrid,
  Eye,
  AlertOctagon,
  Leaf,
} from 'lucide-react';

export const IssueManagementTab: React.FC = () => {
  const {
    filteredIssues,
    selectedNeighborhood,
    domainFilter,
    setDomainFilter,
    setInspectedIssueId,
    updateIssueStatus,
    metrics,
  } = useEcoPulse();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All Categories');
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'priority' | 'date' | 'depth'>('priority');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Filter and sort issues
  const processedIssues = useMemo(() => {
    let list = [...filteredIssues];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (i) =>
          i.id.toLowerCase().includes(q) ||
          i.title.toLowerCase().includes(q) ||
          i.locationDetails.toLowerCase().includes(q) ||
          i.neighborhood.toLowerCase().includes(q) ||
          (i.landmark && i.landmark.toLowerCase().includes(q)) ||
          (i.wardNumber && i.wardNumber.toLowerCase().includes(q)) ||
          (i.assignedTeam && i.assignedTeam.toLowerCase().includes(q))
      );
    }

    // Status filter
    if (statusFilter !== 'All') {
      list = list.filter((i) => i.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== 'All Categories') {
      list = list.filter((i) => i.category === categoryFilter);
    }

    // Severity filter
    if (severityFilter !== 'All') {
      list = list.filter((i) => i.severity === severityFilter);
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'priority') {
        if (a.status === 'Resolved' && b.status !== 'Resolved') return 1;
        if (a.status !== 'Resolved' && b.status === 'Resolved') return -1;
        return b.priorityScore - a.priorityScore;
      }
      if (sortBy === 'date') {
        return new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime();
      }
      if (sortBy === 'depth') {
        const depthA = a.roadDamageDetails?.depthCm || 0;
        const depthB = b.roadDamageDetails?.depthCm || 0;
        return depthB - depthA;
      }
      return 0;
    });

    return list;
  }, [filteredIssues, searchQuery, statusFilter, categoryFilter, severityFilter, sortBy]);

  // Quick inline status advancement
  const handleQuickAdvance = (
    e: React.MouseEvent,
    issue: typeof filteredIssues[0]
  ) => {
    e.stopPropagation();
    const defaultTeam = issue.reportType === 'roadguard'
      ? 'AP PWD Road Infrastructure & Bitumen Patching Division'
      : issue.city === 'Guntur'
      ? 'GMC Municipal Solid Waste & Desilting Squad'
      : 'VMC Public Health & Sanitation Wing';

    if (issue.status === 'Reported') {
      updateIssueStatus(issue.id, 'Assigned', defaultTeam);
    } else if (issue.status === 'Assigned') {
      updateIssueStatus(issue.id, 'In Progress');
    } else if (issue.status === 'In Progress') {
      const resolutionText = issue.reportType === 'roadguard'
        ? 'Bitumen cold-mix asphalt overlay completed and leveled for traffic.'
        : 'Solid waste cleared and transported to designated municipal recycling unit.';
      updateIssueStatus(issue.id, 'Resolved', undefined, resolutionText);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header and Summary Counts */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
            <span>Municipal Remediation & Dispatch</span>
            <span aria-hidden="true">·</span>
            <span>{selectedNeighborhood}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Issue Management & Field Dispatch
          </h1>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Table View"
            aria-label="Table View"
          >
            <LayoutList className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === 'cards' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Card Grid View"
            aria-label="Card Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Control Strip: Search & Multi-Faceted Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        {/* Search bar + Sort */}
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by ID, keyword, landmark, ward number, or assigned team..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 text-[#111827] placeholder:text-[#6B7280] border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:ring-1 focus:ring-emerald-600 transition-colors font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2 text-xs text-slate-400 hover:text-slate-700"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" />
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg text-[#111827] focus:outline-none focus:ring-1 focus:ring-emerald-600"
            >
              <option value="priority" className="text-[#111827] bg-white">Priority Index (High to Low)</option>
              <option value="date" className="text-[#111827] bg-white">Date Logged (Newest)</option>
              <option value="depth" className="text-[#111827] bg-white">Pothole Depth (Deepest First)</option>
            </select>
          </div>
        </div>

        {/* Filter Pills / Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          {/* Domain & Status Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Domain toggle */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
              <button
                onClick={() => setDomainFilter('all')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  domainFilter === 'all' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600'
                }`}
              >
                All Domains
              </button>
              <button
                onClick={() => setDomainFilter('environmental')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  domainFilter === 'environmental' ? 'bg-white text-emerald-900 shadow-xs font-semibold' : 'text-slate-600'
                }`}
              >
                Environmental
              </button>
              <button
                onClick={() => setDomainFilter('roadguard')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1 ${
                  domainFilter === 'roadguard' ? 'bg-white text-amber-900 shadow-xs font-semibold' : 'text-slate-600'
                }`}
              >
                <AlertOctagon className="w-3 h-3 text-amber-700" />
                <span>RoadGuard</span>
              </button>
            </div>

            {/* Status pills */}
            <div className="flex items-center gap-1">
              {['All', 'Reported', 'Assigned', 'In Progress', 'Resolved'].map((st) => {
                const isSelected = statusFilter === st;
                return (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {st}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Secondary Dropdown Filters */}
          <div className="flex items-center gap-2">
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg text-[#111827] font-semibold focus:outline-none"
            >
              <option value="All" className="text-[#111827] bg-white">All Severities</option>
              <option value="Critical" className="text-[#111827] bg-white">Critical</option>
              <option value="High" className="text-[#111827] bg-white">High</option>
              <option value="Medium" className="text-[#111827] bg-white">Medium</option>
              <option value="Low" className="text-[#111827] bg-white">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content: Table or Cards */}
      {processedIssues.length === 0 ? (
        <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
          <p className="text-sm font-semibold text-slate-700">No issues found matching your filters</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query, switching between Environmental and RoadGuard, or clearing status filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('All');
              setCategoryFilter('All Categories');
              setSeverityFilter('All');
              setDomainFilter('all');
            }}
            className="px-4 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* Data Table View */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#FAFBFB] text-slate-500 font-semibold border-b border-slate-200">
                  <th className="py-3 px-4">Identifier / Title</th>
                  <th className="py-3 px-3">Domain & Category</th>
                  <th className="py-3 px-3">Ward / Location</th>
                  <th className="py-3 px-3">Severity</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Priority</th>
                  <th className="py-3 px-4 text-right">Action Pipeline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {processedIssues.map((issue) => {
                  const isRoadGuard = issue.reportType === 'roadguard';

                  return (
                    <tr
                      key={issue.id}
                      onClick={() => setInspectedIssueId(issue.id)}
                      className="hover:bg-[#FAFBFB] cursor-pointer transition-colors group"
                    >
                      {/* Identifier & Title */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`font-mono tabular-nums font-semibold ${isRoadGuard ? 'text-amber-800' : 'text-emerald-800'}`}>
                            {issue.id}
                          </span>
                        </div>
                        <span className="font-semibold text-slate-900 block truncate max-w-xs mt-0.5">
                          {issue.title}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono tabular-nums">
                          {new Date(issue.reportedAt).toLocaleDateString()}
                        </span>
                      </td>

                      {/* Domain & Category */}
                      <td className="py-3.5 px-3">
                        <div className="space-y-0.5">
                          <span className={`text-[10px] font-semibold uppercase tracking-wider block ${isRoadGuard ? 'text-amber-800' : 'text-emerald-800'}`}>
                            {isRoadGuard ? 'RoadGuard Pothole' : 'Environmental'}
                          </span>
                          <span className="font-medium text-slate-700 block truncate max-w-[170px]">
                            {issue.category}
                          </span>
                          {isRoadGuard && issue.roadDamageDetails && (
                            <span className="text-[10px] text-amber-900 font-mono font-semibold block">
                              Depth: {issue.roadDamageDetails.depthCm}cm · {issue.roadDamageDetails.laneImpact}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-3">
                        <span className="font-semibold text-slate-800 block truncate max-w-[160px]">
                          {issue.wardNumber || issue.neighborhood}
                        </span>
                        <span className="text-[11px] text-slate-500 truncate max-w-[160px] block">
                          {issue.landmark || issue.locationDetails}
                        </span>
                      </td>

                      {/* Severity */}
                      <td className="py-3.5 px-3">
                        <span
                          className={`font-semibold ${
                            issue.severity === 'Critical'
                              ? 'text-rose-700'
                              : issue.severity === 'High'
                              ? 'text-amber-700'
                              : 'text-emerald-700'
                          }`}
                        >
                          {issue.severity}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3">
                        <div className="space-y-0.5">
                          <span className="font-semibold text-slate-800 block">
                            {issue.status}
                          </span>
                          {issue.assignedTeam && (
                            <span className="text-[10px] text-slate-500 truncate max-w-[130px] block">
                              {issue.assignedTeam}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Priority Score */}
                      <td className="py-3.5 px-3 text-right">
                        <PriorityScoreDisplay
                          score={issue.priorityScore}
                          breakdown={issue.priorityBreakdown}
                          size="sm"
                        />
                      </td>

                      {/* Pipeline Quick Transition */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          {issue.status === 'Reported' && (
                            <button
                              type="button"
                              onClick={(e) => handleQuickAdvance(e, issue)}
                              className="px-2.5 py-1 text-[11px] font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors"
                            >
                              Dispatch
                            </button>
                          )}

                          {issue.status === 'Assigned' && (
                            <button
                              type="button"
                              onClick={(e) => handleQuickAdvance(e, issue)}
                              className="px-2.5 py-1 text-[11px] font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-md transition-colors"
                            >
                              Start Work
                            </button>
                          )}

                          {issue.status === 'In Progress' && (
                            <button
                              type="button"
                              onClick={(e) => handleQuickAdvance(e, issue)}
                              className="px-2.5 py-1 text-[11px] font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-md transition-colors flex items-center gap-1 shadow-xs"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Resolve</span>
                            </button>
                          )}

                          {issue.status === 'Resolved' && (
                            <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Resolved
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => setInspectedIssueId(issue.id)}
                            className="p-1 text-slate-400 hover:text-slate-800 transition-colors ml-1"
                            title="Open full inspector"
                            aria-label="Inspect issue"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Card Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {processedIssues.map((issue) => {
            const isRoadGuard = issue.reportType === 'roadguard';

            return (
              <div
                key={issue.id}
                onClick={() => setInspectedIssueId(issue.id)}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono tabular-nums mb-1">
                    <span className={`font-semibold ${isRoadGuard ? 'text-amber-800' : 'text-emerald-800'}`}>
                      {issue.id}
                    </span>
                    <PriorityScoreDisplay
                      score={issue.priorityScore}
                      breakdown={issue.priorityBreakdown}
                      size="sm"
                    />
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 line-clamp-2">
                    {issue.title}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
                    <span>{issue.category}</span>
                    <span aria-hidden="true">·</span>
                    <span
                      className={`font-semibold ${
                        issue.severity === 'Critical'
                          ? 'text-rose-700'
                          : issue.severity === 'High'
                          ? 'text-amber-700'
                          : 'text-emerald-700'
                      }`}
                    >
                      {issue.severity}
                    </span>
                  </div>

                  {isRoadGuard && issue.roadDamageDetails && (
                    <div className="mt-2 p-2 bg-amber-50 rounded-lg text-[11px] text-amber-900 font-mono">
                      Depth: {issue.roadDamageDetails.depthCm}cm · {issue.roadDamageDetails.laneImpact}
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{issue.landmark || issue.locationDetails}</span>
                  </div>
                </div>

                {/* Status and Action Strip */}
                <div
                  className="pt-3 border-t border-slate-100 flex items-center justify-between"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="text-xs font-semibold text-slate-700">
                    {issue.status}
                  </span>

                  {issue.status !== 'Resolved' ? (
                    <button
                      type="button"
                      onClick={(e) => handleQuickAdvance(e, issue)}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <span>Advance</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Resolved
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

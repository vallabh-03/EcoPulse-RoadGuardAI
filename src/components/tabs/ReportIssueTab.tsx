import React, { useState, useMemo } from 'react';
import { useEcoPulse } from '../../context/EcoPulseContext.tsx';
import { IssueCategory, IssueSeverity, Neighborhood, ReportType, RoadDamageDetails } from '../../types/index.ts';
import { calculatePriorityScore } from '../../utils/priorityEngine.ts';
import { ASSETS } from '../../data/seedData.ts';
import {
  Upload,
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
  Camera,
  Layers,
  Clock,
  ArrowRight,
  AlertOctagon,
  Leaf,
} from 'lucide-react';

import { VIJAYAWADA_NEIGHBORHOODS, GUNTUR_NEIGHBORHOODS } from '../../utils/locationValidator.ts';

const ENVIRONMENTAL_CATEGORIES: IssueCategory[] = [
  'Garbage Vulnerability Point (GVP)',
  'Plastic & Storm Drain Clog',
  'Hazardous & Effluent Runoff',
  'Krishna Canal & Waterway Pollution',
  'Green Belt & Avenue Tree Hazard',
  'Open Waste Burning & Smog',
];

const ROADGUARD_CATEGORIES: IssueCategory[] = [
  'Severe Pothole & Road Crater',
  'Broken Manhole & Drainage Cover',
  'Asphalt Subsidence & Trenching',
  'Median & Divider Hazard',
];

export const ReportIssueTab: React.FC = () => {
  const { addReport, currentUser, setActiveTab, setInspectedIssueId } = useEcoPulse();

  const [reportType, setReportType] = useState<ReportType>('environmental');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<IssueCategory>('Garbage Vulnerability Point (GVP)');
  const [neighborhood, setNeighborhood] = useState<Neighborhood>('Benz Circle & MG Road (Bandar Road)');
  const [wardNumber, setWardNumber] = useState('Ward 12 (Benz Circle Zone)');
  const [landmark, setLandmark] = useState('');
  const [locationDetails, setLocationDetails] = useState('');
  const [severity, setSeverity] = useState<IssueSeverity>('High');
  const [estimatedWasteKg, setEstimatedWasteKg] = useState<number>(150);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [customImagePreview, setCustomImagePreview] = useState<string | null>(null);

  // RoadGuard specific fields
  const [potholeDepthCm, setPotholeDepthCm] = useState<number>(12);
  const [laneImpact, setLaneImpact] = useState<RoadDamageDetails['laneImpact']>('Two-Wheeler Lane');
  const [trafficRisk, setTrafficRisk] = useState<RoadDamageDetails['trafficRisk']>('High (Monsoon Waterlogged)');

  // Form submission feedback
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Switch category list when reportType changes
  const handleTypeChange = (newType: ReportType) => {
    setReportType(newType);
    if (newType === 'roadguard') {
      setCategory('Severe Pothole & Road Crater');
      if (!title) setTitle('Deep Crater Pothole on Commuter Lane');
    } else {
      setCategory('Garbage Vulnerability Point (GVP)');
      if (title === 'Deep Crater Pothole on Commuter Lane') setTitle('');
    }
  };

  // Live priority calculation preview based on current form values
  const livePriority = useMemo(() => {
    return calculatePriorityScore(severity, 1, new Date().toISOString(), 'Reported', reportType);
  }, [severity, reportType]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setCustomImagePreview(result);
        setImageUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Please provide a concise title for the incident.';
    if (!locationDetails.trim()) newErrors.locationDetails = 'Please specify the road, cross, or exact spot.';
    if (!description.trim() || description.length < 15) {
      newErrors.description = 'Please describe the hazard in at least 15 characters.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const roadDamageDetails: RoadDamageDetails | undefined =
      reportType === 'roadguard'
        ? {
            depthCm: Number(potholeDepthCm) || 10,
            laneImpact,
            trafficRisk,
            detectedVia: 'Citizen Manual Report',
          }
        : undefined;

    const newId = addReport({
      reportType,
      title: title.trim(),
      category,
      neighborhood,
      wardNumber: wardNumber.trim() || undefined,
      landmark: landmark.trim() || undefined,
      locationDetails: locationDetails.trim(),
      severity,
      description: description.trim(),
      reporterName: currentUser.name,
      estimatedWasteKg: Number(estimatedWasteKg) || (reportType === 'roadguard' ? 120 : 50),
      roadDamageDetails,
      imageUrl: imageUrl || undefined,
    });

    setSubmittedId(newId);
  };

  const handleResetForAnother = () => {
    setTitle('');
    setLocationDetails('');
    setLandmark('');
    setDescription('');
    setImageUrl('');
    setCustomImagePreview(null);
    setSubmittedId(null);
    setErrors({});
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
          <span>Citizen Intake Portal</span>
          <span aria-hidden="true">·</span>
          <span>Earn +50 GreenPoints for verified ward reports</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Report Ward Incident / Pothole
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Unified intake for environmental waste hotspots and EcoPulse RoadGuard road damage/potholes.
        </p>
      </div>

      {/* Domain Selection Tabs (Environmental vs RoadGuard) */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => handleTypeChange('environmental')}
          className={`py-3 px-4 rounded-xl text-left transition-all flex items-center gap-3 ${
            reportType === 'environmental'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-950 shadow-xs ring-1 ring-emerald-500/20'
              : 'hover:bg-slate-50 text-slate-600'
          }`}
        >
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
            reportType === 'environmental' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-500'
          }`}>
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-xs block">Swachh Environmental Hotspot</span>
            <span className="text-[11px] text-slate-500 block">GVPs, drain plastic clogs, lake & smog</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleTypeChange('roadguard')}
          className={`py-3 px-4 rounded-xl text-left transition-all flex items-center gap-3 ${
            reportType === 'roadguard'
              ? 'bg-amber-50 border border-amber-200 text-amber-950 shadow-xs ring-1 ring-amber-500/20'
              : 'hover:bg-slate-50 text-slate-600'
          }`}
        >
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
            reportType === 'roadguard' ? 'bg-amber-700 text-white' : 'bg-slate-100 text-slate-500'
          }`}>
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-xs block">EcoPulse RoadGuard Pothole</span>
            <span className="text-[11px] text-slate-500 block">Potholes, open manholes, sunken road trenches</span>
          </div>
        </button>
      </div>

      {submittedId ? (
        /* Submission Success State */
        <div className="p-8 bg-white border border-emerald-200 rounded-2xl shadow-sm text-center space-y-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {reportType === 'roadguard' ? 'RoadGuard Pothole Incident Logged!' : 'Environmental Report Successfully Filed!'}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Registered with tracking ID <strong className="font-mono text-slate-900">{submittedId}</strong>.
              Your submission has been dispatched to the civic queue and you earned <strong className="text-emerald-700">+50 GreenPoints</strong>.
            </p>
          </div>

          <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-xl max-w-md mx-auto text-xs text-emerald-950 text-left space-y-1">
            <span className="font-semibold block">Deterministic Priority Result:</span>
            <p className="leading-relaxed">
              Calculated Initial Priority: <strong className="font-mono text-sm">{livePriority.totalScore}/100</strong>.
              Hazard severity contributed {livePriority.severityContribution} pts (50%), initial report weight contributed {livePriority.clusterContribution} pts (30%).
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setInspectedIssueId(submittedId);
                setActiveTab('management');
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <span>View in Issue Management</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
            >
              Locate on Ward Map
            </button>

            <button
              onClick={handleResetForAnother}
              className="px-4 py-2 text-xs font-medium text-emerald-800 hover:text-emerald-950 transition-colors"
            >
              Report Another Incident
            </button>
          </div>
        </div>
      ) : (
        /* Active Intake Form */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Main Form (2 cols) */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                {reportType === 'roadguard' ? 'Road Damage / Pothole Title *' : 'Environmental Summary Title *'}
              </label>
              <input
                type="text"
                placeholder={reportType === 'roadguard' ? 'e.g. 14cm Deep Crater on 100 Feet Road Two-Wheeler Track' : 'e.g. Plastic Waste Choking Rajakaluve Drain Culvert'}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full px-3.5 py-2.5 text-sm bg-white text-[#111827] placeholder:text-[#6B7280] border ${
                  errors.title ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 focus:ring-emerald-600'
                } rounded-xl focus:outline-none focus:ring-1 transition-colors`}
              />
              {errors.title && (
                <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.title}
                </p>
              )}
            </div>

            {/* Category & Ward Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as IssueCategory)}
                  className="w-full px-3.5 py-2.5 text-xs font-medium bg-white text-[#111827] border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-600"
                >
                  {(reportType === 'roadguard' ? ROADGUARD_CATEGORIES : ENVIRONMENTAL_CATEGORIES).map((cat) => (
                    <option key={cat} value={cat} className="text-[#111827] bg-white">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                  Municipal Ward / Zone *
                </label>
                <select
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value as Neighborhood)}
                  className="w-full px-3.5 py-2.5 text-xs font-medium bg-white text-[#111827] border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-600"
                >
                  <optgroup label="Vijayawada Localities" className="font-bold text-[#111827]">
                    {VIJAYAWADA_NEIGHBORHOODS.map((n) => (
                      <option key={n} value={n} className="text-[#111827] bg-white font-normal">
                        {n}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Guntur Localities" className="font-bold text-[#111827]">
                    {GUNTUR_NEIGHBORHOODS.map((n) => (
                      <option key={n} value={n} className="text-[#111827] bg-white font-normal">
                        {n}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>

            {/* Landmark & Exact Location Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                  Prominent Landmark / Junction
                </label>
                <input
                  type="text"
                  placeholder="e.g. Near Benz Circle Flyover or Collectorate Gate"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white text-[#111827] placeholder:text-[#6B7280] border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                  Ward Number / Zone ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ward 12 (VMC) or Ward 24 (GMC)"
                  value={wardNumber}
                  onChange={(e) => setWardNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white text-[#111827] placeholder:text-[#6B7280] border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Exact Road / Street Address *
              </label>
              <input
                type="text"
                placeholder="e.g. MG Road, 50m before Benz Circle or Ring Road Junction"
                value={locationDetails}
                onChange={(e) => setLocationDetails(e.target.value)}
                className={`w-full px-3.5 py-2.5 text-sm bg-white text-[#111827] placeholder:text-[#6B7280] border ${
                  errors.locationDetails ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 focus:ring-emerald-600'
                } rounded-xl focus:outline-none focus:ring-1 transition-colors`}
              />
              {errors.locationDetails && (
                <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.locationDetails}
                </p>
              )}
            </div>

            {/* RoadGuard Specific Parameters */}
            {reportType === 'roadguard' && (
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3">
                <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <AlertOctagon className="w-4 h-4 text-amber-700" />
                  RoadGuard Pothole Parameters
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-amber-900 mb-1">
                      Pothole Depth: <strong className="font-mono text-sm">{potholeDepthCm} cm</strong>
                    </label>
                    <input
                      type="range"
                      min="4"
                      max="30"
                      value={potholeDepthCm}
                      onChange={(e) => setPotholeDepthCm(Number(e.target.value))}
                      className="w-full accent-amber-700 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-amber-800 font-mono">
                      <span>4cm (Shallow)</span>
                      <span>15cm (Severe)</span>
                      <span>30cm (Crater)</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-amber-900 mb-1">
                      Lane Impact
                    </label>
                    <select
                      value={laneImpact}
                      onChange={(e) => setLaneImpact(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-amber-300 rounded-lg text-[#111827] font-medium"
                    >
                      <option value="Two-Wheeler Lane" className="text-[#111827] bg-white">Two-Wheeler Lane</option>
                      <option value="Main Carriageway" className="text-[#111827] bg-white">Main Carriageway</option>
                      <option value="Bus Priority Lane" className="text-[#111827] bg-white">Bus Priority Lane</option>
                      <option value="Junction / Pedestrian Crossing" className="text-[#111827] bg-white">Junction / Crossing</option>
                      <option value="Flyover Approach" className="text-[#111827] bg-white">Flyover Approach</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-amber-900 mb-1">
                      Traffic Hazard Risk
                    </label>
                    <select
                      value={trafficRisk}
                      onChange={(e) => setTrafficRisk(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-amber-300 rounded-lg text-[#111827] font-medium"
                    >
                      <option value="Critical Accident Hazard" className="text-[#111827] bg-white">Critical Accident Hazard</option>
                      <option value="High (Monsoon Waterlogged)" className="text-[#111827] bg-white">High (Monsoon Waterlogged)</option>
                      <option value="Moderate" className="text-[#111827] bg-white">Moderate</option>
                      <option value="Low" className="text-[#111827] bg-white">Low</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Severity Rating Selector */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                  Hazard Severity Rating *
                </label>
                <span className="text-[11px] text-slate-500 font-medium">
                  50% weight in priority score
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {(['Low', 'Medium', 'High', 'Critical'] as IssueSeverity[]).map((level) => {
                  const isSelected = severity === level;
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setSeverity(level)}
                      className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all text-center ${
                        isSelected
                          ? level === 'Critical'
                            ? 'bg-rose-50 border-rose-300 text-rose-900 ring-1 ring-rose-500'
                            : level === 'High'
                            ? 'bg-amber-50 border-amber-300 text-amber-900 ring-1 ring-amber-500'
                            : 'bg-emerald-50 border-emerald-300 text-emerald-900 ring-1 ring-emerald-500'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {level}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Waste Volume Slider (for Environmental) */}
            {reportType === 'environmental' && (
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
                  <span className="uppercase tracking-wide">Estimated Waste Volume</span>
                  <span className="font-mono tabular-nums text-slate-900">{estimatedWasteKg} kg</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="1200"
                  step="10"
                  value={estimatedWasteKg}
                  onChange={(e) => setEstimatedWasteKg(Number(e.target.value))}
                  className="w-full accent-emerald-700 cursor-pointer"
                />
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Detailed Incident Notes *
              </label>
              <textarea
                rows={3}
                placeholder={reportType === 'roadguard' ? 'Describe the crater edge, water stagnation, or collision risk for bikes and auto-rickshaws...' : 'Describe garbage accumulation, water runoff, smell, or drain blockage...'}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`w-full px-3.5 py-2.5 text-sm bg-white text-[#111827] placeholder:text-[#6B7280] border ${
                  errors.description ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 focus:ring-emerald-600'
                } rounded-xl focus:outline-none focus:ring-1 transition-colors`}
              />
              {errors.description && (
                <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.description}
                </p>
              )}
            </div>

            {/* Optional Photo Attachment */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Field Evidence Photo (Optional)
              </label>

              {customImagePreview || imageUrl ? (
                <div className="relative rounded-xl overflow-hidden border border-slate-200 h-40 bg-slate-100">
                  <img
                    src={customImagePreview || imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setCustomImagePreview(null);
                      setImageUrl('');
                    }}
                    className="absolute top-2 right-2 px-2.5 py-1 text-xs bg-black/70 hover:bg-black text-white rounded-md transition-colors"
                  >
                    Remove Photo
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 hover:border-slate-300 rounded-xl cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition-colors">
                    <Camera className="w-6 h-6 text-slate-400 mb-1" />
                    <span className="text-xs font-medium text-slate-700">Upload field photo from phone or drive</span>
                    <span className="text-[11px] text-slate-400 mt-0.5">PNG, JPG up to 10MB</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>

                  <div>
                    <span className="text-[11px] text-slate-500 block mb-1">
                      Or attach a realistic field demo photo:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setImageUrl(ASSETS.dumpSite)}
                        className="p-2 border border-slate-200 rounded-lg text-left text-xs hover:border-emerald-500 hover:bg-emerald-50/40 transition-colors"
                      >
                        <span className="font-semibold block text-slate-800">Pothole / Road Trench</span>
                        <span className="text-[10px] text-slate-500">Outer Ring Road</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageUrl(ASSETS.riverCleanup)}
                        className="p-2 border border-slate-200 rounded-lg text-left text-xs hover:border-emerald-500 hover:bg-emerald-50/40 transition-colors"
                      >
                        <span className="font-semibold block text-slate-800">Drain / Lake Plastic</span>
                        <span className="text-[10px] text-slate-500">Rajakaluve cleanup</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className={`w-full py-3 px-4 text-xs font-bold text-white rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 ${
                  reportType === 'roadguard'
                    ? 'bg-amber-800 hover:bg-amber-700'
                    : 'bg-emerald-800 hover:bg-emerald-700'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Submit to Priority Engine (+50 GreenPoints)</span>
              </button>
            </div>
          </form>

          {/* Smart Priority Engine Live Preview */}
          <div className="space-y-4">
            <div className="bg-[#FAFBFB] rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div>
                <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block mb-1">
                  ALGORITHMIC ESTIMATOR
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Priority Projection
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Live calculation based on your current inputs.
                </p>
              </div>

              {/* Score Display */}
              <div className="p-4 bg-white rounded-xl border border-slate-200 text-center space-y-1">
                <span className="text-3xl font-bold font-mono tabular-nums text-slate-900">
                  {livePriority.totalScore}
                  <span className="text-sm font-normal text-slate-400 ml-1">/100</span>
                </span>
                <span className="text-xs font-medium text-emerald-800 block">
                  Projected Initial Priority
                </span>
              </div>

              {/* Factors Breakdown */}
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-700">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                    <span>Severity (50%)</span>
                  </div>
                  <span className="font-mono tabular-nums font-semibold text-slate-900">
                    +{livePriority.severityContribution} pts
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Layers className="w-3.5 h-3.5 text-amber-600" />
                    <span>Cluster (30%)</span>
                  </div>
                  <span className="font-mono tabular-nums font-semibold text-slate-900">
                    +{livePriority.clusterContribution} pts
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Age Base (20%)</span>
                  </div>
                  <span className="font-mono tabular-nums font-semibold text-slate-900">
                    +{livePriority.ageContribution} pts
                  </span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-[11px] text-emerald-950 leading-relaxed">
                <strong>Civic Prioritization:</strong> Critical potholes on two-wheeler corridors and acute garbage vulnerability points receive urgent municipal escalation.
              </div>
            </div>

            {/* Reporter Profile Snapshot */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1">
              <span className="font-semibold text-slate-900 block">Logged By Ward Steward</span>
              <p>
                {currentUser.name} ({currentUser.role})
              </p>
              <div className="text-[11px] text-slate-400 font-mono tabular-nums pt-1">
                Ward Committee Balance: {currentUser.greenPoints} GreenPoints
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

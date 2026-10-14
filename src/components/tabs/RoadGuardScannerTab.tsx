import React, { useState, useRef } from 'react';
import { useEcoPulse } from '../../context/EcoPulseContext.tsx';
import { PotholeAssessmentResult, SupportedCity, Neighborhood } from '../../types/index.ts';
import { analyzeRoadImage } from '../../utils/potholeAnalyzer.ts';
import {
  validateCoordinates,
  VIJAYAWADA_NEIGHBORHOODS,
  GUNTUR_NEIGHBORHOODS,
  SUPPORTED_CITIES_CONFIG,
  getDemoRoutingDestination,
} from '../../utils/locationValidator.ts';
import { ASSETS } from '../../data/seedData.ts';
import {
  Upload,
  Camera,
  AlertOctagon,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Compass,
  ArrowRight,
  Sparkles,
  Info,
  RotateCcw,
  ShieldAlert,
  Layers,
  Wrench,
  FileText,
} from 'lucide-react';

export const RoadGuardScannerTab: React.FC = () => {
  const { addReport, currentUser, setActiveTab, setInspectedIssueId } = useEcoPulse();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload & Image State
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<PotholeAssessmentResult | null>(null);

  // Location Confirmation State (Strictly Vijayawada & Guntur)
  const [selectedCity, setSelectedCity] = useState<SupportedCity>('Vijayawada');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<Neighborhood>(VIJAYAWADA_NEIGHBORHOODS[0]);
  const [streetAddress, setStreetAddress] = useState<string>('');
  const [landmark, setLandmark] = useState<string>('');
  const [wardNumber, setWardNumber] = useState<string>('Ward 24 (VMC)');

  // Geolocation & Error state
  const [isDetectingGps, setIsDetectingGps] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationSuccessNote, setLocationSuccessNote] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Submission State
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [createdReportId, setCreatedReportId] = useState<string | null>(null);

  // Switch City & auto-update corresponding neighborhoods
  const handleCityChange = (newCity: SupportedCity) => {
    setSelectedCity(newCity);
    setLocationError(null);
    setLocationSuccessNote(null);
    if (newCity === 'Vijayawada') {
      setSelectedNeighborhood(VIJAYAWADA_NEIGHBORHOODS[0]);
      setWardNumber('Ward 24 (VMC)');
    } else {
      setSelectedNeighborhood(GUNTUR_NEIGHBORHOODS[0]);
      setWardNumber('Ward 12 (GMC)');
    }
  };

  // Image Upload Handler
  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setFormError('Please upload a valid image file (JPEG, PNG, or WebP).');
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      setFormError('File size exceeds 12MB. Please upload an optimized image.');
      return;
    }

    setFormError(null);
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setSelectedImage(base64);
      setImageFileName(file.name);
      setAnalysisResult(null);
      setIsSubmitted(false);
      triggerAnalysis(base64, file.name);
    };
    reader.readAsDataURL(file);
  };

  // Load Preset Demo Sample
  const handleLoadSample = (sampleUrl: string, sampleName: string) => {
    setFormError(null);
    setSelectedImage(sampleUrl);
    setImageFileName(sampleName);
    setAnalysisResult(null);
    setIsSubmitted(false);
    triggerAnalysis(sampleUrl, sampleName);
  };

  // Run Vision / Demonstration Analysis
  const triggerAnalysis = async (imgData: string, fileName?: string) => {
    setIsAnalyzing(true);
    setFormError(null);
    try {
      const result = await analyzeRoadImage(imgData, fileName);
      setAnalysisResult(result);

      // Pre-fill street details if sample is selected
      if (fileName && fileName.includes('Benz Circle')) {
        setSelectedCity('Vijayawada');
        setSelectedNeighborhood('Benz Circle & MG Road (Bandar Road)');
        setStreetAddress('MG Road, Left Carriageway approaching Benz Circle flyover');
        setLandmark('Opposite Jyothi Mahal Junction');
      } else if (fileName && fileName.includes('Amaravathi')) {
        setSelectedCity('Guntur');
        setSelectedNeighborhood('Amaravathi Road & Pattabhipuram');
        setStreetAddress('Amaravathi Road approach near RVR College');
        setLandmark('Near Pattabhipuram 2nd Lane');
      }
    } catch {
      setFormError('Could not complete image assessment. Please try again or select a sample image.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Browser Geolocation with strict AP Bounding Box verification
  const handleDetectGps = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setIsDetectingGps(true);
    setLocationError(null);
    setLocationSuccessNote(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsDetectingGps(false);
        const { latitude, longitude } = pos.coords;
        const validation = validateCoordinates(latitude, longitude);

        if (!validation.isValid) {
          // Strict location restriction rule
          setLocationError(
            `Coordinates (${latitude.toFixed(4)}, ${longitude.toFixed(4)}) fall outside our supported service area. RoadGuard is currently operational in Vijayawada & Guntur, Andhra Pradesh only. Please choose a supported city manually below.`
          );
        } else if (validation.city) {
          setSelectedCity(validation.city);
          handleCityChange(validation.city);
          setLocationSuccessNote(
            `Verified inside ${validation.city} (${validation.municipalBody}) service bounds!`
          );
          setStreetAddress(`GPS Geo-pin: ${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E`);
        }
      },
      (err) => {
        setIsDetectingGps(false);
        setLocationError(
          `Unable to retrieve device location (${err.message}). Please manually select Vijayawada or Guntur below.`
        );
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Final Submission to Municipal Priority Queue
  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage || !analysisResult) return;

    if (!streetAddress.trim()) {
      setFormError('Please specify the road name, street, or nearest junction in Vijayawada or Guntur.');
      return;
    }
    setFormError(null);

    const isHighPriority = analysisResult.severityScore > 70; // Strictly > 70 rule
    const demoRouting = getDemoRoutingDestination(selectedCity, isHighPriority);

    const reportId = addReport({
      reportType: 'roadguard',
      city: selectedCity,
      title: `${analysisResult.severityScore > 70 ? '[CRITICAL] ' : ''}${analysisResult.damageType} on ${streetAddress}`,
      category: 'Severe Pothole & Road Crater',
      neighborhood: selectedNeighborhood,
      locationDetails: streetAddress,
      landmark: landmark.trim() || undefined,
      wardNumber: wardNumber.trim() || undefined,
      severity: isHighPriority ? 'Critical' : analysisResult.severityScore >= 50 ? 'High' : 'Medium',
      description: `${analysisResult.damageType}. Estimated depth: ${analysisResult.estimatedDepthCm}cm. Observations: ${analysisResult.visibleObservations.join(', ')}. Urgency: ${analysisResult.recommendedUrgency}.`,
      reporterName: currentUser.name,
      estimatedWasteKg: 150,
      roadDamageDetails: {
        depthCm: analysisResult.estimatedDepthCm,
        widthCm: 85,
        trafficRisk: isHighPriority ? 'Critical Accident Hazard' : 'Moderate',
        laneImpact: 'Two-Wheeler Lane',
        detectedVia: 'RoadGuard AI Scanner',
        assessmentScore: analysisResult.severityScore,
        confidencePercent: analysisResult.confidencePercent,
        observations: analysisResult.visibleObservations,
        isHighPriorityThreshold: isHighPriority,
        demoRoutingDestination: demoRouting,
      },
      imageUrl: selectedImage,
    });

    setCreatedReportId(reportId);
    setIsSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span>EcoPulse RoadGuard Computer Vision Module</span>
            <span aria-hidden="true">·</span>
            <span>Vijayawada & Guntur, Andhra Pradesh</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Photo-Based Road Damage & Pothole Assessment
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Upload field footage from your smartphone or vehicle dashcam to quantify road crater severity and route emergency patches to VMC or GMC PWD squads.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('landing')}
          className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700 self-start sm:self-auto cursor-pointer"
        >
          Back to Overview
        </button>
      </div>

      {/* Dismissible Error Banner */}
      {formError && (
        <div className="p-3.5 bg-rose-950/80 border border-rose-700/60 rounded-xl text-xs text-rose-200 flex items-center justify-between gap-3 shadow-md animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{formError}</span>
          </div>
          <button
            type="button"
            onClick={() => setFormError(null)}
            className="text-rose-400 hover:text-rose-200 p-1 text-xs cursor-pointer"
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}

      {isSubmitted ? (
        /* Submission Success & Municipal Routing Card */
        <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-8 shadow-xl text-center space-y-5 animate-in fade-in duration-300">
          <div className="w-14 h-14 bg-emerald-950 text-emerald-400 border border-emerald-500/50 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              RoadGuard Incident {createdReportId} Registered!
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-lg mx-auto">
              Your road hazard assessment has been queued with a verified priority index. You earned <strong className="text-emerald-400">+50 GreenPoints</strong>.
            </p>
          </div>

          {/* Honest Demo Routing Badge */}
          <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 max-w-lg mx-auto text-left text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-200 font-semibold">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <FileText className="w-4 h-4" />
                MUNICIPAL ROUTING DISCLOSURE
              </span>
              <span className="font-mono text-[11px] text-amber-400">Demo Routing</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Destination: <strong className="text-white">{getDemoRoutingDestination(selectedCity, (analysisResult?.severityScore || 0) > 70)}</strong>
            </p>
            <p className="text-[11px] text-slate-400 italic">
              Notice: This is a demonstration routing simulation. Real municipal officer notification requires active PWD API credentials.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <button
              onClick={() => {
                if (createdReportId) setInspectedIssueId(createdReportId);
                setActiveTab('management');
              }}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-600 rounded-xl transition-colors flex items-center gap-2 shadow-sm"
            >
              <span>View in PWD Issue Management</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className="px-5 py-2.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors"
            >
              Locate on Twin Cities Map
            </button>

            <button
              onClick={() => {
                setSelectedImage(null);
                setAnalysisResult(null);
                setIsSubmitted(false);
              }}
              className="px-4 py-2.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              Scan Another Road
            </button>
          </div>
        </div>
      ) : (
        /* Upload & Assessment Two-Column Workflow */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Image Upload & Preview (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-emerald-400" />
                  Field Photo Intake
                </span>
                {selectedImage && (
                  <button
                    onClick={() => {
                      setSelectedImage(null);
                      setAnalysisResult(null);
                    }}
                    className="text-xs text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset
                  </button>
                )}
              </div>

              {/* Upload Dropzone or Live Preview */}
              {selectedImage ? (
                <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-black aspect-4/3 group">
                  <img
                    src={selectedImage}
                    alt="Road Surface"
                    className="w-full h-full object-cover"
                  />

                  {/* Scanning Animation Overlay if Analyzing */}
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-xs flex flex-col items-center justify-center space-y-3">
                      <div className="w-12 h-12 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs font-mono font-semibold text-emerald-300 tracking-wider">
                        SCANNING ROAD SURFACE MESH...
                      </span>
                      {/* Laser scanning beam line */}
                      <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse" />
                    </div>
                  )}

                  {!isAnalyzing && (
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-slate-950/80 backdrop-blur-xs px-3 py-1.5 rounded-lg text-[11px] text-slate-300 border border-slate-700">
                      <span className="truncate max-w-[200px]">{imageFileName || 'Uploaded Photo'}</span>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-emerald-400 hover:text-emerald-300 font-semibold"
                      >
                        Replace
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleFile(file);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all aspect-4/3 flex flex-col items-center justify-center space-y-3 ${
                    isDragging
                      ? 'border-emerald-400 bg-emerald-950/30'
                      : 'border-slate-700 hover:border-slate-500 bg-slate-950/50 hover:bg-slate-950'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Drop road damage photo here
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Or click to browse from device (JPEG, PNG up to 12MB)
                    </p>
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
                className="hidden"
              />

              {/* Instant One-Click Demo Samples */}
              <div className="space-y-2 pt-1 border-t border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block">
                  Or test with Vijayawada / Guntur road presets:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleLoadSample(ASSETS.potholeSample, 'Severe Crater (Benz Circle, VMC — Score 84)')}
                    className="p-2.5 rounded-xl border border-slate-800 bg-slate-950 hover:border-emerald-500/50 hover:bg-slate-850 text-left transition-colors"
                  >
                    <span className="font-semibold text-rose-400 block text-[11px]">
                      Severe Crater (&gt;70)
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Benz Circle (Score 84)
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleLoadSample(ASSETS.dumpSite, 'Exact 70 Boundary Test (Amaravathi Rd, GMC — Score 70)')}
                    className="p-2.5 rounded-xl border border-slate-800 bg-slate-950 hover:border-amber-500/50 hover:bg-slate-850 text-left transition-colors"
                  >
                    <span className="font-semibold text-amber-400 block text-[11px]">
                      Exact 70 Threshold
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Guntur Amaravathi Rd
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Assessment Result & Strict Location Confirmation (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {analysisResult ? (
              <div className="space-y-5">
                {/* STRICT > 70 HIGH PRIORITY RULE BANNER */}
                {analysisResult.isHighPriority ? (
                  <div className="p-4 bg-rose-950/50 border border-rose-500/50 rounded-2xl text-rose-200 space-y-1.5 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs uppercase tracking-wider flex items-center gap-2 text-rose-400">
                        <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                        CRITICAL SEVERITY THRESHOLD EXCEEDED (SCORE &gt; 70)
                      </span>
                      <span className="font-mono font-bold text-xs bg-rose-900/80 px-2 py-0.5 rounded text-white">
                        {analysisResult.severityScore}/100
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-rose-100">
                      This road crater has been marked <strong>HIGH PRIORITY</strong> because its severity index strictly exceeds 70. Urgent VMC/GMC cold-mix asphalt dispatch is recommended within 48 hours to avert two-wheeler skids.
                    </p>
                  </div>
                ) : (
                  <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl text-slate-300 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>
                        Severity Score: <strong className="text-white font-mono">{analysisResult.severityScore}/100</strong> (Does not exceed emergency &gt;70 threshold).
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">Routine Maintenance</span>
                  </div>
                )}

                {/* Score & Structural Diagnostics Box */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider block">
                        DIAGNOSTIC SUMMARY ({analysisResult.assessmentMode === 'ai_vision' ? 'GEMINI 2.5 VISION' : 'DEMONSTRATION ENGINE'})
                      </span>
                      <h3 className="text-base font-bold text-white mt-0.5">
                        {analysisResult.damageType}
                      </h3>
                    </div>

                    <div className="text-right">
                      <span className="text-2xl font-bold font-mono tabular-nums text-white block">
                        {analysisResult.severityScore}
                        <span className="text-xs text-slate-400 font-normal ml-0.5">/100</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {analysisResult.confidencePercent}% Confidence
                      </span>
                    </div>
                  </div>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 block mb-0.5">Estimated Depth</span>
                      <span className="text-sm font-bold font-mono text-white">
                        {analysisResult.estimatedDepthCm} cm
                      </span>
                    </div>

                    <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 block mb-0.5">Pothole Status</span>
                      <span className="text-sm font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Detected
                      </span>
                    </div>

                    <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
                      <span className="text-[10px] text-slate-400 block mb-0.5">Urgency</span>
                      <span className={`text-xs font-bold ${analysisResult.isHighPriority ? 'text-rose-400' : 'text-amber-400'}`}>
                        {analysisResult.recommendedUrgency}
                      </span>
                    </div>
                  </div>

                  {/* Observations List */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-slate-400 block">
                      Visible Damage Observations:
                    </span>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {analysisResult.visibleObservations.map((obs, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-400 mt-1">·</span>
                          <span>{obs}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <p className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-800">
                    {analysisResult.disclaimer}
                  </p>
                </div>

                {/* STRICT TWO-CITY LOCATION CONFIRMATION FORM */}
                <form onSubmit={handleSubmitReport} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider block">
                        LOCATION RESTRICTION PROTOCOL
                      </span>
                      <h4 className="text-sm font-bold text-white">
                        Confirm Location (Vijayawada & Guntur Only)
                      </h4>
                    </div>

                    <button
                      type="button"
                      onClick={handleDetectGps}
                      disabled={isDetectingGps}
                      className="px-2.5 py-1 text-xs font-medium text-emerald-400 bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/30 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Compass className={`w-3.5 h-3.5 ${isDetectingGps ? 'animate-spin' : ''}`} />
                      <span>{isDetectingGps ? 'Validating...' : 'Detect GPS'}</span>
                    </button>
                  </div>

                  {/* Geolocation Feedback Alert */}
                  {locationError && (
                    <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl text-xs text-rose-200 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <span>{locationError}</span>
                    </div>
                  )}

                  {locationSuccessNote && (
                    <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-200 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{locationSuccessNote}</span>
                    </div>
                  )}

                  {/* City Selector: Exactly Vijayawada and Guntur */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide mb-1.5">
                        Supported City *
                      </label>
                      <select
                        value={selectedCity}
                        onChange={(e) => handleCityChange(e.target.value as SupportedCity)}
                        className="w-full px-3 py-2 text-xs font-semibold bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                      >
                        <option value="Vijayawada" className="text-[#111827] bg-white font-medium">Vijayawada, Andhra Pradesh</option>
                        <option value="Guntur" className="text-[#111827] bg-white font-medium">Guntur, Andhra Pradesh</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide mb-1.5">
                        Locality / Ward Zone *
                      </label>
                      <select
                        value={selectedNeighborhood}
                        onChange={(e) => setSelectedNeighborhood(e.target.value as Neighborhood)}
                        className="w-full px-3 py-2 text-xs font-medium bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                      >
                        {(selectedCity === 'Vijayawada' ? VIJAYAWADA_NEIGHBORHOODS : GUNTUR_NEIGHBORHOODS).map((loc) => (
                          <option key={loc} value={loc} className="text-[#111827] bg-white font-medium">
                            {loc}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Street & Landmark */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide mb-1.5">
                        Road Name / Street Location *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. MG Road, Near Benz Circle Flyover"
                        value={streetAddress}
                        onChange={(e) => setStreetAddress(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white placeholder:text-[#6B7280] focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide mb-1.5">
                        Prominent Landmark
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Opposite Jyothi Mahal Junction"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white placeholder:text-[#6B7280] focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 px-4 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>
                        Confirm & Create Priority Report ({selectedCity} PWD Queue)
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* Awaiting Scan Placeholder */
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                  <AlertOctagon className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Awaiting Road Footage
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    Upload an image or select a sample above. The RoadGuard engine will calculate a 0–100 severity indicator and check the &gt;70 threshold rule.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

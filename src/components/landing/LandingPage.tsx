import React, { useState } from 'react';
import { useEcoPulse } from '../../context/EcoPulseContext.tsx';
import { SupportedCity } from '../../types/index.ts';
import { ASSETS } from '../../data/seedData.ts';
import { SUPPORTED_CITIES_CONFIG } from '../../utils/locationValidator.ts';
import {
  ShieldAlert,
  Camera,
  Compass,
  ArrowRight,
  CheckCircle2,
  AlertOctagon,
  Layers,
  Sparkles,
  MapPin,
  TrendingUp,
  Clock,
  ChevronRight,
  Wrench,
  Award,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setActiveTab, setSelectedCity, metrics, issues, challenges } = useEcoPulse();

  // Interactive City Intelligence Selector: Strictly Vijayawada & Guntur
  const [activeCityTab, setActiveCityTab] = useState<SupportedCity>('Vijayawada');

  // Filter issues for the City Intelligence section
  const cityIssues = issues.filter((i) => i.city === activeCityTab);
  const cityPotholes = cityIssues.filter((i) => i.reportType === 'roadguard');
  const cityCriticalPotholes = cityPotholes.filter((i) => (i.roadDamageDetails?.assessmentScore || 0) > 70);

  const handleCitySelect = (city: SupportedCity) => {
    setActiveCityTab(city);
    setSelectedCity(city);
  };

  return (
    <div className="space-y-24 py-4 text-slate-100 overflow-hidden">
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative min-h-[82vh] flex items-center justify-center rounded-3xl overflow-hidden border border-cyan-500/20 bg-gradient-to-b from-[#090E1A] via-[#0D1527] to-[#111A2E] shadow-2xl p-6 sm:p-12 lg:p-16">
        {/* Atmospheric Radial Ambient Glows — Multi-colored mixed palette */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/12 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 left-1/6 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Zone (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Region and Auth Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-300 text-xs font-semibold backdrop-blur-md shadow-xs">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>Serving Vijayawada & Guntur, Andhra Pradesh</span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 hover:text-white transition-colors cursor-pointer font-semibold shadow-xs"
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('signup')}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-400 hover:brightness-110 text-slate-950 font-bold transition-all cursor-pointer shadow-xs"
                >
                  Sign Up
                </button>
              </div>
            </div>

            {/* Brand Title Lockup */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-400 block">
                EcoPulse | RoadGuard
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] text-balance">
                Every Pothole Has a Story. <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-amber-300 to-emerald-300">Let's Fix It.</span>
              </h1>
            </div>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed font-normal">
              AI-assisted road damage reporting for safer streets across Vijayawada and Guntur. Detect, quantify, and fast-track hazardous potholes directly into municipal PWD maintenance queues.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => setActiveTab('roadguard_scanner')}
                className="px-6 py-3.5 text-sm font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 hover:brightness-110 rounded-xl transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2 group cursor-pointer"
              >
                <span>Detect Road Damage</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('city-intelligence');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3.5 text-sm font-semibold text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-violet-400/50 rounded-xl transition-colors backdrop-blur-md cursor-pointer"
              >
                Explore City Impact
              </button>
            </div>

            {/* Live Metrics Snippet */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800/80 max-w-lg text-xs">
              <div>
                <span className="text-xl font-bold font-mono tabular-nums text-cyan-400 block">
                  {metrics.totalReports}
                </span>
                <span className="text-slate-400 text-[11px]">Twin City Incidents</span>
              </div>
              <div>
                <span className="text-xl font-bold font-mono tabular-nums text-emerald-400 block">
                  {metrics.potholesPatched}
                </span>
                <span className="text-slate-400 text-[11px]">Craters Repaired</span>
              </div>
              <div>
                <span className="text-xl font-bold font-mono tabular-nums text-amber-400 block">
                  {metrics.highPriorityPotholesCount}
                </span>
                <span className="text-slate-400 text-[11px]">Critical (&gt;70 Score)</span>
              </div>
            </div>
          </div>

          {/* Right Visual Zone: Digital Road Inspection (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-cyan-500/40 shadow-2xl bg-black aspect-16/10 lg:aspect-4/3 group">
              <img
                src={ASSETS.heroInspection}
                alt="Road Surface AI Scanning Inspection"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Scanning Laser Beam Line */}
              <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent top-1/2 -translate-y-1/2 animate-pulse shadow-sm" />

              {/* Floating Geospatial Markers Overlay */}
              <div className="absolute top-4 left-4 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-cyan-500/40 text-[11px] font-mono text-cyan-300 flex items-center gap-1.5 shadow-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span>BENZ CIRCLE · 16.501°N, 80.648°E</span>
              </div>

              <div className="absolute bottom-4 right-4 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-amber-500/40 text-[11px] font-mono text-amber-300 shadow-lg flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>SEVERITY INDEX: 84/100 (HIGH)</span>
              </div>

              {/* Subtle Scanning Mesh Grids */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECTION A: THE PROBLEM */}
      <section className="space-y-8 max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 block">
            THE CIVIC CHALLENGE
          </span>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Why Every Pothole Needs Rapid Intervention
          </h2>
          <p className="text-sm text-slate-300">
            Vijayawada and Guntur experience intense seasonal monsoons and high freight density, turning minor cracks into hazardous road craters within days.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-rose-500/30 hover:border-rose-500/60 transition-all space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-rose-950/60 text-rose-400 border border-rose-800/40 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Two-Wheeler Accidents</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Unmarked 15cm craters hidden under rainwater on MG Road and Brodipet cause severe two-wheeler skids and injuries during rush hours.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-amber-500/30 hover:border-amber-500/60 transition-all space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-950/60 text-amber-400 border border-amber-800/40 flex items-center justify-center">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Transit Bottlenecks</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Vehicles slowing to navigate craters on Autonagar 100ft road and Mirchi Yard bypass create kilometers of gridlock and vehicle axle damage.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-violet-500/30 hover:border-violet-500/60 transition-all space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-violet-950/60 text-violet-400 border border-violet-800/40 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Delayed Municipal Routing</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Traditional paper complaints lack photo verification and standardized severity ratings, delaying emergency PWD cold-mix patches.
            </p>
          </div>
        </div>
      </section>

      {/* 3. SECTION B: HOW ROADGUARD WORKS */}
      <section className="space-y-8 max-w-6xl mx-auto px-4 bg-gradient-to-b from-slate-900/60 via-slate-900/30 to-slate-950/80 border border-slate-800/80 rounded-3xl p-8 sm:p-12 shadow-xl">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 block">
            HOW IT WORKS
          </span>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            From Photo to Municipal Dispatch in 4 Steps
          </h2>
          <p className="text-sm text-slate-300">
            A frictionless, transparent workflow engineered for Vijayawada & Guntur citizens and municipal engineers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {/* Step 1: Sky Cyan */}
          <div className="p-5 rounded-2xl bg-slate-950/90 border border-sky-500/30 space-y-3 relative hover:border-sky-500/60 transition-all shadow-xs">
            <span className="text-xs font-mono font-bold text-sky-400 block">01</span>
            <div className="w-9 h-9 rounded-lg bg-sky-950/80 text-sky-400 flex items-center justify-center border border-sky-800/40">
              <Camera className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">Upload Road Photo</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Snap a photo with your phone or vehicle dashcam showing the damaged asphalt.
            </p>
          </div>

          {/* Step 2: Hazard Amber */}
          <div className="p-5 rounded-2xl bg-slate-950/90 border border-amber-500/30 space-y-3 relative hover:border-amber-500/60 transition-all shadow-xs">
            <span className="text-xs font-mono font-bold text-amber-400 block">02</span>
            <div className="w-9 h-9 rounded-lg bg-amber-950/80 text-amber-400 flex items-center justify-center border border-amber-800/40">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">AI Damage Assessment</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Calculates a 0–100 severity indicator, estimated depth, and checks the &gt;70 threshold rule.
            </p>
          </div>

          {/* Step 3: Eco Emerald */}
          <div className="p-5 rounded-2xl bg-slate-950/90 border border-emerald-500/30 space-y-3 relative hover:border-emerald-500/60 transition-all shadow-xs">
            <span className="text-xs font-mono font-bold text-emerald-400 block">03</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-950/80 text-emerald-400 flex items-center justify-center border border-emerald-800/40">
              <Compass className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">Confirm AP Location</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Validates coordinates strictly inside Vijayawada or Guntur municipal boundary boxes.
            </p>
          </div>

          {/* Step 4: Royal Violet */}
          <div className="p-5 rounded-2xl bg-slate-950/90 border border-violet-500/30 space-y-3 relative hover:border-violet-500/60 transition-all shadow-xs">
            <span className="text-xs font-mono font-bold text-violet-400 block">04</span>
            <div className="w-9 h-9 rounded-lg bg-violet-950/80 text-violet-400 flex items-center justify-center border border-violet-800/40">
              <Wrench className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">Priority Queue & Points</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generates a structured PWD ticket, routes to VMC/GMC, and awards +50 GreenPoints.
            </p>
          </div>
        </div>
      </section>

      {/* 4. SECTION C: CITY INTELLIGENCE (STRICT TWO-CITY SELECTOR) */}
      <section id="city-intelligence" className="space-y-8 max-w-6xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-violet-400 block">
              TWIN CITIES RADAR
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              City Intelligence: Vijayawada & Guntur
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Select a city to examine active corridors, critical potholes, and municipal response status.
            </p>
          </div>

          {/* Interactive City Selector (Strictly 2 Cities) */}
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => handleCitySelect('Vijayawada')}
              className={`px-5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeCityTab === 'Vijayawada'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Vijayawada (VMC)
            </button>
            <button
              onClick={() => handleCitySelect('Guntur')}
              className={`px-5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeCityTab === 'Guntur'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Guntur (GMC)
            </button>
          </div>
        </div>

        {/* Selected City Intelligence Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Key Corridors & Pothole Queue (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">
                  Active Hazard Hotspots in {activeCityTab}
                </h3>
                <span className="text-xs text-slate-400">
                  Authority: {SUPPORTED_CITIES_CONFIG[activeCityTab].municipalBody}
                </span>
              </div>
              <button
                onClick={() => {
                  setSelectedCity(activeCityTab);
                  setActiveTab('map');
                }}
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                <span>Open Cartographic Map</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-800">
              {cityIssues.slice(0, 4).map((issue) => {
                const isOver70 = (issue.roadDamageDetails?.assessmentScore || 0) > 70;

                return (
                  <div key={issue.id} className="py-3 flex items-start justify-between gap-4">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                        <span className={issue.reportType === 'roadguard' ? 'text-amber-400' : 'text-emerald-400'}>
                          {issue.id}
                        </span>
                        <span>·</span>
                        <span>{issue.wardNumber || issue.neighborhood}</span>
                      </div>
                      <h4 className="text-xs font-semibold text-white truncate max-w-md">
                        {issue.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 truncate max-w-md">
                        {issue.landmark || issue.locationDetails}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                        isOver70 ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-slate-800 text-slate-200'
                      }`}>
                        Score {issue.priorityScore}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-1">
                        {issue.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* City Corridor Stat Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white">
                {activeCityTab} Arterial Corridors
              </h3>
              <div className="space-y-2">
                {SUPPORTED_CITIES_CONFIG[activeCityTab].majorCorridors.map((corridor: string, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <span className="font-semibold text-slate-200">{corridor}</span>
                    <span className="text-[10px] text-emerald-400 font-mono">Monitored</span>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-500/20 text-xs text-emerald-200 space-y-1">
                <span className="font-semibold block">Municipal Protocol:</span>
                <p className="text-[11px] leading-relaxed text-emerald-300/90">
                  All confirmed potholes with scores &gt;70 are automatically prioritized for cold-mix compaction within 48 hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SECTION D: IMPACT DASHBOARD PREVIEW */}
      <section className="space-y-8 max-w-6xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 block">
              LIVE SYSTEM STATE
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Impact Dashboard Preview (Demonstration Data)
            </h2>
          </div>

          <button
            onClick={() => setActiveTab('overview')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Launch Full Operations Console</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-indigo-500/30 hover:border-indigo-500/60 transition-all shadow-sm">
            <span className="text-xs text-indigo-300 block mb-1">Total Reports</span>
            <span className="text-3xl font-extrabold font-mono tabular-nums text-white block">
              {metrics.totalReports}
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Vijayawada ({metrics.vijayawadaCount}) · Guntur ({metrics.gunturCount})
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-amber-500/30 hover:border-amber-500/60 transition-all shadow-sm">
            <span className="text-xs text-amber-300 block mb-1">High-Priority Craters (&gt;70)</span>
            <span className="text-3xl font-extrabold font-mono tabular-nums text-amber-400 block">
              {metrics.highPriorityPotholesCount}
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Immediate PWD repair threshold
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 hover:border-emerald-500/60 transition-all shadow-sm">
            <span className="text-xs text-emerald-300 block mb-1">Potholes Repaired</span>
            <span className="text-3xl font-extrabold font-mono tabular-nums text-emerald-400 block">
              {metrics.potholesPatched}
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Verified cold-mix asphalt fixes
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-violet-500/30 hover:border-violet-500/60 transition-all shadow-sm">
            <span className="text-xs text-violet-300 block mb-1">Resolution Rate</span>
            <span className="text-3xl font-extrabold font-mono tabular-nums text-violet-400 block">
              {metrics.resolutionRate}%
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Average score {metrics.averagePriorityScore}/100
            </span>
          </div>
        </div>
      </section>

      {/* 6. SECTION E: CALL TO ACTION */}
      <section className="relative max-w-6xl mx-auto px-4 py-12">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-cyan-950/80 border border-cyan-500/40 p-8 sm:p-14 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-amber-400 to-emerald-400 block">
              JOIN THE SWACHH & ROADGUARD MISSION
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Make Your Streets Safer in Vijayawada & Guntur
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Every citizen photo creates verifiable street intelligence. Join over 90 active civic stewards in Andhra Pradesh helping municipal engineers prioritize repairs.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setActiveTab('roadguard_scanner')}
              className="px-8 py-4 text-sm font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 hover:brightness-110 rounded-xl transition-all shadow-xl shadow-cyan-500/20 flex items-center gap-2 cursor-pointer"
            >
              <span>Report a Pothole with AI Scanner</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('signup')}
              className="px-8 py-4 text-sm font-bold text-[#0B1020] bg-gradient-to-r from-cyan-400 via-violet-300 to-amber-300 hover:brightness-110 rounded-xl transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              <span>Join as Civic Steward (+100 Pts)</span>
            </button>

            <button
              onClick={() => setActiveTab('overview')}
              className="px-8 py-4 text-sm font-semibold text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 rounded-xl transition-colors cursor-pointer"
            >
              Explore Operations Dashboard
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

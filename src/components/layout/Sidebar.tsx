import React, { useState } from 'react';
import { useEcoPulse, NavigationTab, DomainFilter } from '../../context/EcoPulseContext.tsx';
import { SupportedCity } from '../../types/index.ts';
import {
  VIJAYAWADA_NEIGHBORHOODS,
  GUNTUR_NEIGHBORHOODS,
} from '../../utils/locationValidator.ts';
import {
  Home,
  Scan,
  LayoutDashboard,
  MapPin,
  PlusCircle,
  FolderKanban,
  BarChart3,
  Award,
  Bell,
  RefreshCw,
  Download,
  Menu,
  X,
  Leaf,
  ChevronDown,
  AlertOctagon,
  Sparkles,
  LogIn,
  LogOut,
  UserCheck,
} from 'lucide-react';

const NAV_ITEMS: Array<{
  id: NavigationTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  badge?: string;
  badgeColor?: string;
}> = [
  { id: 'landing', label: 'Landing Page', icon: Home, iconColor: 'text-sky-400' },
  { id: 'roadguard_scanner', label: 'RoadGuard AI Scanner', icon: Scan, iconColor: 'text-amber-400', badge: 'AI', badgeColor: 'bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-bold' },
  { id: 'overview', label: 'Operations Dashboard', icon: LayoutDashboard, iconColor: 'text-indigo-400' },
  { id: 'map', label: 'Vijayawada & Guntur Map', icon: MapPin, iconColor: 'text-cyan-400' },
  { id: 'report', label: 'Report Hotspot / Pothole', icon: PlusCircle, iconColor: 'text-rose-400', badge: '+50', badgeColor: 'bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold' },
  { id: 'management', label: 'PWD Issue Dispatch', icon: FolderKanban, iconColor: 'text-orange-400' },
  { id: 'analytics', label: 'Impact Analytics', icon: BarChart3, iconColor: 'text-violet-400' },
  { id: 'challenges', label: 'Civic Challenges & Swachh', icon: Award, iconColor: 'text-emerald-400' },
  { id: 'login', label: 'Steward Access (Login)', icon: LogIn, iconColor: 'text-cyan-300' },
];

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    selectedCity,
    setSelectedCity,
    selectedNeighborhood,
    setSelectedNeighborhood,
    domainFilter,
    setDomainFilter,
    notifications,
    markNotificationRead,
    clearAllNotifications,
    currentUser,
    metrics,
    resetDemoData,
    exportDataJson,
    isAuthenticated,
    logout,
  } = useEcoPulse();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Available neighborhoods based on selected city
  const availableNeighborhoods =
    selectedCity === 'Vijayawada'
      ? ['All Localities', ...VIJAYAWADA_NEIGHBORHOODS]
      : selectedCity === 'Guntur'
      ? ['All Localities', ...GUNTUR_NEIGHBORHOODS]
      : ['All Localities', ...VIJAYAWADA_NEIGHBORHOODS, ...GUNTUR_NEIGHBORHOODS];

  return (
    <>
      {/* Mobile Top Header */}
      <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-[#0D1527] border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-1.5 text-slate-300 hover:text-white focus:outline-none"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 via-emerald-400 to-amber-400 flex items-center justify-center text-slate-950 font-bold shadow-xs">
              <Leaf className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-white block leading-tight">EcoPulse <span className="text-amber-400 font-semibold">| RoadGuard</span></span>
              <span className="text-[10px] text-cyan-400 font-semibold block leading-none">Vijayawada & Guntur</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-400 hover:text-white rounded-lg transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab(isAuthenticated ? 'overview' : 'login')}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-900 border border-cyan-500/40 text-cyan-400 hover:text-white transition-colors"
          >
            {isAuthenticated ? 'Steward' : 'Log In'}
          </button>

          <button
            onClick={() => setActiveTab('roadguard_scanner')}
            className="px-3 py-1.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-cyan-400 hover:brightness-110 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 shadow-sm"
          >
            <Scan className="w-3.5 h-3.5" />
            <span>Scan</span>
          </button>
        </div>
      </header>

      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0B1120] border-r border-slate-800/80 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Area */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 via-emerald-400 to-amber-400 flex items-center justify-center text-slate-950 font-extrabold shadow-md shadow-cyan-500/20">
              <Leaf className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-white block leading-tight">
                EcoPulse <span className="text-amber-400 font-bold">| RoadGuard</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium block">
                Andhra Pradesh Civic Division
              </span>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white p-1"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Strict Two-City Scope Selector */}
        <div className="px-4 py-3 border-b border-slate-800/80 bg-slate-950/40 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              SUPPORTED CITY (AP)
            </label>
            <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-500/30">
              VMC · GMC
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            {(['All Cities', 'Vijayawada', 'Guntur'] as const).map((city) => (
              <button
                key={city}
                onClick={() => {
                  setSelectedCity(city);
                  setSelectedNeighborhood('All Localities');
                }}
                className={`py-1 text-[11px] rounded font-semibold transition-all truncate px-1 ${
                  selectedCity === city
                    ? city === 'Vijayawada'
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-xs'
                      : city === 'Guntur'
                      ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-xs'
                      : 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {city === 'All Cities' ? 'All' : city}
              </button>
            ))}
          </div>

          {/* Locality Dropdown */}
          <div className="relative pt-1">
            <select
              value={selectedNeighborhood}
              onChange={(e) => setSelectedNeighborhood(e.target.value)}
              className="w-full text-xs font-medium text-slate-200 bg-slate-900 border border-slate-800 rounded-lg py-1.5 pl-2.5 pr-7 appearance-none focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
            >
              {availableNeighborhoods.map((loc) => (
                <option key={loc} value={loc} className="text-[#111827] bg-white">
                  {loc}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-3 pointer-events-none" />
          </div>
        </div>

        {/* Primary Navigation Links */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl transition-all text-left whitespace-nowrap shrink-0 group cursor-pointer ${
                  isActive
                    ? 'bg-slate-800/80 text-white font-semibold border-l-2 border-l-cyan-400 border-y border-r border-slate-700/60 shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? item.iconColor : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${item.badgeColor || 'bg-slate-800 text-slate-200'}`}>
                    {item.badge}
                  </span>
                )}

                {item.id === 'management' && metrics.pendingCount > 0 && (
                  <span className="font-mono tabular-nums text-[10px] text-amber-400 font-semibold bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/40">
                    {metrics.pendingCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Civic Steward Authentication & Status Card */}
        <div className="p-3 mx-3 mb-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
          {isAuthenticated ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white truncate max-w-[130px]">
                  {currentUser.name}
                </span>
                <span className="text-xs font-bold text-[#35E6A1] font-mono tabular-nums">
                  {currentUser.greenPoints} pts
                </span>
              </div>
              <p className="text-[10px] text-slate-400 leading-snug">
                {currentUser.city} Civic Steward · #{currentUser.rank} in AP
              </p>
              <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-800/80 font-mono tabular-nums">
                <span>{currentUser.roadGuardReportsCount} potholes</span>
                <button
                  type="button"
                  onClick={logout}
                  className="text-rose-400 hover:text-rose-300 font-sans flex items-center gap-1 transition-colors cursor-pointer"
                  title="Sign out of current demonstration session"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Civic Terminal</span>
                <span className="text-[10px] font-mono text-[#00E5FF]">Demo Active</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-snug">
                Log in to link reports and earn +100 welcome GreenPoints.
              </p>
              <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setMobileMenuOpen(false);
                  }}
                  className="py-1.5 px-2 text-center text-[11px] font-semibold text-[#00E5FF] bg-slate-900 hover:bg-slate-800 border border-[#00E5FF]/40 rounded-lg transition-colors cursor-pointer"
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('signup');
                    setMobileMenuOpen(false);
                  }}
                  className="py-1.5 px-2 text-center text-[11px] font-bold text-slate-950 bg-gradient-to-r from-[#35E6A1] to-[#00E5FF] hover:brightness-110 rounded-lg transition-all cursor-pointer shadow-xs"
                >
                  Sign Up
                </button>
              </div>
            </>
          )}
        </div>

        {/* Sidebar Utilities */}
        <div className="p-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 bg-slate-950/40">
          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-1.5 hover:text-white transition-colors p-1"
            title="Reset to Vijayawada & Guntur demonstration state"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="text-[11px]">Reset</span>
          </button>

          <button
            onClick={exportDataJson}
            className="flex items-center gap-1.5 hover:text-white transition-colors p-1"
            title="Download complete JSON dataset"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="text-[11px]">Export</span>
          </button>

          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-1 text-slate-400 hover:text-white transition-colors"
            title="Alerts"
          >
            <Bell className="w-3.5 h-3.5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-rose-500 rounded-full" />
            )}
          </button>
        </div>
      </aside>

      {/* Notifications Drawer */}
      {showNotifications && (
        <div className="fixed top-14 lg:top-4 right-4 z-50 w-80 max-w-[calc(100vw-2rem)] bg-slate-900 rounded-xl shadow-2xl border border-slate-700 overflow-hidden text-slate-100">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950">
            <span className="text-xs font-bold text-white">Vijayawada & Guntur Alerts</span>
            <div className="flex items-center gap-2">
              {notifications.length > 0 && (
                <button
                  onClick={clearAllNotifications}
                  className="text-[10px] text-slate-400 hover:text-white"
                >
                  Clear all
                </button>
              )}
              <button
                onClick={() => setShowNotifications(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-800">
            {notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => markNotificationRead(item.id)}
                className={`p-3 text-xs transition-colors cursor-pointer hover:bg-slate-800/60 ${
                  !item.read ? 'bg-emerald-950/40' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    {item.type === 'roadguard' && (
                      <AlertOctagon className="w-3.5 h-3.5 text-amber-400 inline" />
                    )}
                    {item.title}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {item.timestamp}
                  </span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs text-slate-100"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Reset Demonstration State?</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              This will restore all Vijayawada & Guntur pothole reports, AI analysis records, and GreenPoints back to their initial state.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3.5 py-2 text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetDemoData();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl"
              >
                Reset Demo Data
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

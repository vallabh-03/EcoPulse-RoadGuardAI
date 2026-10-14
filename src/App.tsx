/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EcoPulseProvider, useEcoPulse } from './context/EcoPulseContext.tsx';
import { Sidebar } from './components/layout/Sidebar.tsx';
import { ToastContainer } from './components/common/ToastContainer.tsx';
import { IssueDetailModal } from './components/common/IssueDetailModal.tsx';
import { LandingPage } from './components/landing/LandingPage.tsx';
import { RoadGuardScannerTab } from './components/tabs/RoadGuardScannerTab.tsx';
import { OverviewTab } from './components/tabs/OverviewTab.tsx';
import { EnvironmentalMapTab } from './components/tabs/EnvironmentalMapTab.tsx';
import { ReportIssueTab } from './components/tabs/ReportIssueTab.tsx';
import { IssueManagementTab } from './components/tabs/IssueManagementTab.tsx';
import { ImpactAnalyticsTab } from './components/tabs/ImpactAnalyticsTab.tsx';
import { CommunityChallengesTab } from './components/tabs/CommunityChallengesTab.tsx';
import { LoginPage } from './components/auth/LoginPage.tsx';
import { SignupPage } from './components/auth/SignupPage.tsx';
import {
  Scan,
  LogOut,
} from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    selectedCity,
    selectedNeighborhood,
    isAuthenticated,
    currentUser,
    logout,
  } = useEcoPulse();

  // Full-viewport Cyberpunk Authentication Experiences
  if (activeTab === 'login') {
    return (
      <>
        <LoginPage />
        <ToastContainer />
      </>
    );
  }

  if (activeTab === 'signup') {
    return (
      <>
        <SignupPage />
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="lg:pl-72 flex-1 flex flex-col min-w-0">
        {/* Viewport Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'landing' && <LandingPage />}
          {activeTab === 'roadguard_scanner' && <RoadGuardScannerTab />}
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'map' && <EnvironmentalMapTab />}
          {activeTab === 'report' && <ReportIssueTab />}
          {activeTab === 'management' && <IssueManagementTab />}
          {activeTab === 'analytics' && <ImpactAnalyticsTab />}
          {activeTab === 'challenges' && <CommunityChallengesTab />}
        </main>

        {/* Quiet Editorial Footer — Mixed Colors Theme */}
        <footer className="mt-auto border-t border-slate-800/80 bg-[#0A0F1D] py-5 px-6 sm:px-8 text-xs text-slate-400">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-white">EcoPulse</span>
              <span className="text-amber-400 font-bold">| RoadGuard</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-300">Dedicated Service Area: Vijayawada & Guntur, Andhra Pradesh</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">VMC & GMC Routing</span>
            </div>

            <div className="flex items-center gap-4 text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                Score &gt;70 Priority Threshold Active
              </span>
              <span aria-hidden="true" className="text-slate-700">·</span>
              <span className="text-violet-400">Civic Demo State Active</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Global Modals & Toasts */}
      <IssueDetailModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <EcoPulseProvider>
      <AppContent />
    </EcoPulseProvider>
  );
}

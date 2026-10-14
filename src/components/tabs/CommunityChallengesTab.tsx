import React, { useState } from 'react';
import { useEcoPulse } from '../../context/EcoPulseContext.tsx';
import {
  Award,
  Trophy,
  Users,
  CheckCircle2,
  Sparkles,
  Calendar,
  MapPin,
  ArrowRight,
  Plus,
  ShieldCheck,
  AlertOctagon,
} from 'lucide-react';

export const CommunityChallengesTab: React.FC = () => {
  const {
    currentUser,
    challenges,
    leaderboard,
    joinChallenge,
    contributeToChallenge,
    setActiveTab,
  } = useEcoPulse();

  const [contributeChallengeId, setContributeChallengeId] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(10);

  const handleLogContribution = (challengeId: string) => {
    if (amount > 0) {
      contributeToChallenge(challengeId, amount);
      setContributeChallengeId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
          <span>Swachh & RoadGuard Civic Hub</span>
          <span aria-hidden="true">·</span>
          <span>Neighborhood Stewardship Program</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Civic Challenges & GreenPoints
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Participate in ward sanitation drives, map dangerous potholes with RoadGuard, and earn civic GreenPoints.
        </p>
      </div>

      {/* User GreenPoints Summary Card */}
      <div className="bg-gradient-to-br from-[#1B4332] to-[#084A32] text-white rounded-2xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-200 text-xs font-semibold tracking-wide">
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>WARD COMMITTEE STEWARD PROFILE</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              {currentUser.name}
            </h2>
            <p className="text-xs text-emerald-100 max-w-md leading-relaxed">
              {currentUser.role} · <strong>{currentUser.neighborhood}</strong>. Ranked #{currentUser.rank} overall in civic contribution across all metropolitan zones.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {currentUser.badges.map((badge) => (
                <span
                  key={badge}
                  className="text-[11px] font-medium bg-white/15 px-2.5 py-0.5 rounded-md border border-white/20 text-white"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Points & Stats */}
          <div className="flex items-center gap-6 bg-white/10 p-4 rounded-xl border border-white/15 backdrop-blur-xs">
            <div className="text-center pr-4 border-r border-white/15">
              <span className="text-xs text-emerald-200 block mb-0.5">GreenPoints</span>
              <span className="text-3xl font-bold font-mono tabular-nums text-white block">
                {currentUser.greenPoints}
              </span>
              <span className="text-[10px] text-emerald-300">Verified Civic Score</span>
            </div>

            <div className="space-y-1.5 text-xs text-emerald-100 font-mono tabular-nums">
              <div className="flex items-center justify-between gap-4">
                <span>Reports Logged:</span>
                <strong className="text-white">{currentUser.reportsFiled}</strong>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>RoadGuard Potholes:</span>
                <strong className="text-white">{currentUser.roadGuardReportsCount || 0}</strong>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Cleanups Joined:</span>
                <strong className="text-white">{currentUser.cleanupsParticipated}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Point Rules Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-900">1. Report Hotspot or Pothole</span>
            <span className="text-xs font-bold font-mono text-emerald-700">+50 pts</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Log an environmental hazard or a road crater with landmark and photo evidence.
          </p>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-900">2. Join Ward Campaign</span>
            <span className="text-xs font-bold font-mono text-emerald-700">+75 pts</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Commit to a neighborhood lake desilting or RoadGuard zero-pothole corridor drive.
          </p>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-900">3. Verify Remediation</span>
            <span className="text-xs font-bold font-mono text-emerald-700">+100 pts</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Confirm that a reported garbage point is cleared or a road pothole is leveled by PWD.
          </p>
        </div>
      </div>

      {/* Main Grid: Active Challenges & Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Active Neighborhood Cleanup Challenges (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-700" />
              Active Ward & RoadGuard Campaigns
            </h2>
            <span className="text-xs font-mono tabular-nums text-slate-500">
              {challenges.length} active initiatives
            </span>
          </div>

          <div className="space-y-4">
            {challenges.map((challenge) => {
              const percent = Math.min(
                100,
                Math.round((challenge.currentKg / challenge.targetKg) * 100)
              );
              const isRoadGuard = challenge.reportType === 'roadguard';

              return (
                <div
                  key={challenge.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                        <span className={`font-semibold ${isRoadGuard ? 'text-amber-800' : 'text-emerald-800'}`}>
                          {challenge.neighborhood}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{challenge.category}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900">
                        {challenge.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-mono tabular-nums text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {challenge.daysRemaining} days left
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {challenge.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Campaign Target</span>
                      <span className="font-mono tabular-nums font-semibold text-slate-900">
                        {challenge.currentKg} / {challenge.targetKg} {challenge.unitLabel} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${isRoadGuard ? 'bg-amber-600' : 'bg-emerald-600'}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  {/* Footer & Actions */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3 text-xs text-slate-500 font-mono tabular-nums">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        {challenge.participantsCount} citizens
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="text-emerald-700 font-semibold">
                        +{challenge.rewardPoints} GreenPoints reward
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {challenge.isJoined ? (
                        <>
                          <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                            Enrolled
                          </span>

                          <button
                            type="button"
                            onClick={() => setContributeChallengeId(challenge.id)}
                            className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Log {isRoadGuard ? 'Pothole' : 'Sweep'}</span>
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => joinChallenge(challenge.id)}
                          className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
                        >
                          Join Campaign (+{challenge.rewardPoints} pts)
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Contribution Modal Inline */}
                  {contributeChallengeId === challenge.id && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 mt-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                        <span>Log Volunteer Contribution ({challenge.unitLabel})</span>
                        <button
                          onClick={() => setContributeChallengeId(null)}
                          className="text-slate-400 hover:text-slate-700 text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          max="500"
                          value={amount}
                          onChange={(e) => setAmount(Number(e.target.value))}
                          className="px-3 py-1.5 text-xs bg-white text-[#111827] font-semibold border border-slate-300 rounded-lg w-28 font-mono tabular-nums focus:outline-none focus:ring-1 focus:ring-emerald-600"
                        />
                        <button
                          onClick={() => handleLogContribution(challenge.id)}
                          className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors"
                        >
                          Confirm & Add to Campaign
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Community Leaderboard (1 Col) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              Ward Committee Leaderboard
            </h2>
            <span className="text-[11px] text-slate-400 font-mono">Metro Division</span>
          </div>

          <div className="space-y-2">
            {leaderboard.map((user, idx) => {
              const isCurrentUser = user.id === currentUser.id;

              return (
                <div
                  key={user.id}
                  className={`p-3 rounded-xl border transition-colors flex items-center justify-between gap-3 ${
                    isCurrentUser
                      ? 'bg-emerald-50/70 border-emerald-200 ring-1 ring-emerald-500/30'
                      : 'bg-white border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono tabular-nums font-bold ${
                        idx === 0
                          ? 'bg-amber-100 text-amber-800'
                          : idx === 1
                          ? 'bg-slate-200 text-slate-800'
                          : idx === 2
                          ? 'bg-amber-50 text-amber-900'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {idx + 1}
                    </span>

                    <div className="min-w-0">
                      <span className="font-semibold text-xs text-slate-900 block truncate">
                        {user.name} {isCurrentUser && '(You)'}
                      </span>
                      <span className="text-[11px] text-slate-500 block truncate">
                        {user.neighborhood}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-bold text-xs font-mono tabular-nums text-slate-900 block">
                      {user.greenPoints} <span className="text-[10px] font-normal text-slate-400">pts</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono tabular-nums">
                      {user.roadGuardReportsCount || 0} potholes · {user.reportsFiled} reports
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 leading-relaxed">
            <span className="font-semibold text-slate-800 block mb-0.5">Fair Civic Scoring</span>
            Points are awarded strictly for unique, verified interventions. No repeated points can be earned for duplicate submissions.
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { PriorityBreakdown } from '../../types/index.ts';
import { HelpCircle, X, ShieldAlert, Layers, Clock } from 'lucide-react';

interface PriorityScoreDisplayProps {
  score: number;
  breakdown: PriorityBreakdown;
  size?: 'sm' | 'md' | 'lg';
  showFormulaButton?: boolean;
}

export const PriorityScoreDisplay: React.FC<PriorityScoreDisplayProps> = ({
  score,
  breakdown,
  size = 'md',
  showFormulaButton = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Accessible color tokens based on threshold
  let textColor = 'text-slate-800';
  let barColor = 'bg-slate-500';
  let tierLabel = 'Standard';

  if (score >= 80) {
    textColor = 'text-rose-700';
    barColor = 'bg-rose-600';
    tierLabel = 'Urgent Action';
  } else if (score >= 60) {
    textColor = 'text-amber-700';
    barColor = 'bg-amber-600';
    tierLabel = 'Elevated';
  } else if (score >= 40) {
    textColor = 'text-emerald-700';
    barColor = 'bg-emerald-600';
    tierLabel = 'Moderate';
  }

  const textSize = size === 'lg' ? 'text-2xl font-bold' : size === 'sm' ? 'text-sm font-semibold' : 'text-base font-semibold';

  return (
    <>
      <div className="inline-flex items-center gap-2">
        <span className={`${textSize} ${textColor} font-mono tabular-nums tracking-tight`}>
          {score}<span className="text-xs font-normal text-slate-500 ml-0.5">/100</span>
        </span>

        {showFormulaButton && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(true);
            }}
            className="text-slate-400 hover:text-slate-700 transition-colors p-0.5"
            title="Inspect deterministic calculation formula"
            aria-label="View priority calculation breakdown"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(false);
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="priority-dialog-title"
        >
          <div
            className="w-full max-w-lg bg-white rounded-xl shadow-xl border border-slate-200 p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <p className="text-xs text-slate-500 font-medium tracking-wide">
                  DETERMINISTIC PRIORITY ENGINE
                </p>
                <h3 id="priority-dialog-title" className="text-lg font-bold text-slate-900">
                  Priority Index: {score}/100 ({tierLabel})
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Priority scores are calculated via a transparent weighted formula that balances hazard danger, community reporting frequency, and time unresolved. No black-box or non-deterministic models are used.
            </p>

            <div className="space-y-3 pt-1">
              {/* Factor 1: Severity (50%) */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-1">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-900">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                    Hazard Severity (50% Weight)
                  </span>
                  <span className="font-mono tabular-nums text-slate-900">
                    +{breakdown.severityContribution} pts
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-1">
                  <div
                    className="bg-rose-600 h-full"
                    style={{ width: `${breakdown.severityNormalized}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Normalized: {breakdown.severityNormalized}/100</span>
                  <span>Formula: {breakdown.severityNormalized} × 0.50</span>
                </div>
              </div>

              {/* Factor 2: Cluster Frequency (30%) */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-1">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-900">
                    <Layers className="w-3.5 h-3.5 text-amber-600" />
                    Community Reports Frequency (30% Weight)
                  </span>
                  <span className="font-mono tabular-nums text-slate-900">
                    +{breakdown.clusterContribution} pts
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-1">
                  <div
                    className="bg-amber-600 h-full"
                    style={{ width: `${breakdown.clusterNormalized}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Normalized: {breakdown.clusterNormalized}/100</span>
                  <span>Formula: {breakdown.clusterNormalized} × 0.30</span>
                </div>
              </div>

              {/* Factor 3: Age Unresolved (20%) */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-1">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-900">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    Age of Unresolved Issue (20% Weight)
                  </span>
                  <span className="font-mono tabular-nums text-slate-900">
                    +{breakdown.ageContribution} pts
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-1">
                  <div
                    className="bg-emerald-600 h-full"
                    style={{ width: `${breakdown.ageNormalized}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Normalized: {breakdown.ageNormalized}/100</span>
                  <span>Formula: {breakdown.ageNormalized} × 0.20</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-100 text-xs text-emerald-900 leading-relaxed">
              <span className="font-semibold block mb-0.5">Factor Summary:</span>
              {breakdown.explanation}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

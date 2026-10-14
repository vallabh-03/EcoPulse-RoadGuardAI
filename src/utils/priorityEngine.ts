import { IssueSeverity, PriorityBreakdown, IssueStatus, ReportType } from '../types/index.ts';

/**
 * Smart Priority Engine
 *
 * Implements a transparent, deterministic mathematical priority calculation (0-100):
 * - Severity: 50% weight
 * - Cluster report frequency: 30% weight
 * - Age of unresolved issue: 20% weight
 *
 * Normalized inputs:
 * - Severity: Low (25), Medium (50), High (75), Critical (100)
 * - Cluster count: 1 report (20), 2 reports (45), 3 reports (70), 4 reports (85), 5+ reports (100)
 * - Age: Unresolved days normalized: 0d (15), 2d (35), 5d (60), 10d (85), 14+ days (100).
 *   If already resolved, age factor is set to 0.
 */
export function calculatePriorityScore(
  severity: IssueSeverity,
  reportCount: number,
  reportedAtIso: string,
  status: IssueStatus,
  reportType: ReportType = 'environmental'
): PriorityBreakdown {
  // 1. Severity Normalization (50% weight)
  let severityNormalized = 25;
  switch (severity) {
    case 'Critical':
      severityNormalized = 100;
      break;
    case 'High':
      severityNormalized = 75;
      break;
    case 'Medium':
      severityNormalized = 50;
      break;
    case 'Low':
    default:
      severityNormalized = 25;
      break;
  }

  // 2. Cluster Count Normalization (30% weight)
  // Reflects multiple citizen reports validating urgent hotspot presence
  let clusterNormalized = 20;
  if (reportCount >= 5) {
    clusterNormalized = 100;
  } else if (reportCount === 4) {
    clusterNormalized = 85;
  } else if (reportCount === 3) {
    clusterNormalized = 70;
  } else if (reportCount === 2) {
    clusterNormalized = 45;
  } else {
    clusterNormalized = 20;
  }

  // 3. Age Normalization (20% weight)
  // If resolved, age penalty drops to 0 because intervention is complete
  let ageNormalized = 0;
  let ageDays = 0;
  if (status !== 'Resolved') {
    const reportTime = new Date(reportedAtIso).getTime();
    const now = Date.now();
    ageDays = Math.max(0, Math.floor((now - reportTime) / (1000 * 60 * 60 * 24)));

    if (ageDays >= 14) {
      ageNormalized = 100;
    } else if (ageDays >= 10) {
      ageNormalized = 85;
    } else if (ageDays >= 5) {
      ageNormalized = 60;
    } else if (ageDays >= 2) {
      ageNormalized = 35;
    } else {
      ageNormalized = 15;
    }
  }

  const severityContribution = Number((severityNormalized * 0.5).toFixed(1));
  const clusterContribution = Number((clusterNormalized * 0.3).toFixed(1));
  const ageContribution = Number((ageNormalized * 0.2).toFixed(1));

  const totalScore = Math.min(100, Math.round(severityContribution + clusterContribution + ageContribution));

  const domainLabel = reportType === 'roadguard' ? 'Road safety' : 'Environmental';

  const explanation = status === 'Resolved'
    ? `Resolved ${domainLabel.toLowerCase()} issue. Settled score ${totalScore}/100: ${severity} severity contributed ${severityContribution} pts (50%), ${reportCount} community report(s) contributed ${clusterContribution} pts (30%), age penalty waived.`
    : `${severity} severity (${severityNormalized}/100) contributes ${severityContribution} pts (50%); ` +
      `${reportCount} citizen report(s) (${clusterNormalized}/100) contributes ${clusterContribution} pts (30%); ` +
      `${ageDays} day(s) unresolved (${ageNormalized}/100) contributes ${ageContribution} pts (20%).`;

  return {
    severityNormalized,
    clusterNormalized,
    ageNormalized,
    severityContribution,
    clusterContribution,
    ageContribution,
    totalScore,
    explanation,
  };
}

export function getPriorityColor(score: number): {
  bg: string;
  text: string;
  border: string;
  label: string;
} {
  if (score >= 80) {
    return {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      label: 'Urgent Intervention',
    };
  }
  if (score >= 60) {
    return {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      label: 'Elevated Priority',
    };
  }
  if (score >= 40) {
    return {
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
      label: 'Moderate Priority',
    };
  }
  return {
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    border: 'border-slate-200',
    label: 'Standard Priority',
  };
}

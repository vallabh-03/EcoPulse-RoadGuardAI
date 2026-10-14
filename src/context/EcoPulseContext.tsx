import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  EnvironmentalIssue,
  CleanupChallenge,
  VolunteerUser,
  ActivityNotification,
  ToastMessage,
  SupportedCity,
  Neighborhood,
  IssueCategory,
  IssueSeverity,
  IssueStatus,
  ReportType,
  RoadDamageDetails,
} from '../types/index.ts';
import {
  INITIAL_ISSUES,
  INITIAL_CHALLENGES,
  CURRENT_USER,
  INITIAL_LEADERBOARD,
  INITIAL_NOTIFICATIONS,
} from '../data/seedData.ts';
import { calculatePriorityScore } from '../utils/priorityEngine.ts';
import {
  getCityForNeighborhood,
  validateCoordinates,
  SUPPORTED_CITIES_CONFIG,
  getDemoRoutingDestination,
} from '../utils/locationValidator.ts';

const STORAGE_KEY = 'ecopulse_state_v3_ap';

export type NavigationTab =
  | 'landing'
  | 'roadguard_scanner'
  | 'overview'
  | 'map'
  | 'report'
  | 'management'
  | 'analytics'
  | 'challenges'
  | 'login'
  | 'signup';

export type DomainFilter = 'all' | 'environmental' | 'roadguard';

interface EcoPulseContextType {
  // State
  issues: EnvironmentalIssue[];
  challenges: CleanupChallenge[];
  currentUser: VolunteerUser;
  leaderboard: VolunteerUser[];
  notifications: ActivityNotification[];
  toasts: ToastMessage[];
  activeTab: NavigationTab;
  selectedCity: 'All Cities' | SupportedCity;
  selectedNeighborhood: string; // 'All Localities' or specific Vijayawada/Guntur neighborhood
  domainFilter: DomainFilter;
  inspectedIssueId: string | null;
  isAuthenticated: boolean;
  authMode: 'demo_session';

  // Auth Actions
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  signup: (
    name: string,
    email: string,
    password: string,
    city: SupportedCity,
    neighborhood: Neighborhood
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;

  // Actions
  setActiveTab: (tab: NavigationTab) => void;
  setSelectedCity: (city: 'All Cities' | SupportedCity) => void;
  setSelectedNeighborhood: (n: string) => void;
  setDomainFilter: (domain: DomainFilter) => void;
  setInspectedIssueId: (id: string | null) => void;
  addReport: (data: {
    reportType?: ReportType;
    city?: SupportedCity;
    title: string;
    category: IssueCategory;
    neighborhood: Neighborhood;
    locationDetails: string;
    landmark?: string;
    wardNumber?: string;
    severity: IssueSeverity;
    description: string;
    reporterName: string;
    estimatedWasteKg: number;
    roadDamageDetails?: RoadDamageDetails;
    imageUrl?: string;
  }) => string;
  updateIssueStatus: (
    issueId: string,
    nextStatus: IssueStatus,
    assignedTeam?: string,
    notes?: string
  ) => void;
  joinChallenge: (challengeId: string) => void;
  contributeToChallenge: (challengeId: string, amount: number) => void;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  dismissToast: (id: string) => void;
  resetDemoData: () => void;
  exportDataJson: () => void;

  // Derived Metrics
  filteredIssues: EnvironmentalIssue[];
  metrics: {
    totalReports: number;
    pendingCount: number;
    resolvedCount: number;
    resolutionRate: number;
    totalWasteCleanedKg: number;
    potholesPatched: number;
    highPriorityPotholesCount: number;
    criticalCount: number;
    averagePriorityScore: number;
    vijayawadaCount: number;
    gunturCount: number;
    environmentalCount: number;
    roadguardCount: number;
  };
  highestPriorityHotspots: EnvironmentalIssue[];
}

const EcoPulseContext = createContext<EcoPulseContextType | undefined>(undefined);

// Spatial coordinates for Vijayawada & Guntur map canvas placement
const NEIGHBORHOOD_COORDS: Record<Neighborhood, { xPercent: number; yPercent: number; lat: number; lng: number }> = {
  // Vijayawada
  'Benz Circle & MG Road (Bandar Road)': { xPercent: 54, yPercent: 44, lat: 16.501, lng: 80.648 },
  'Autonagar Industrial Corridor': { xPercent: 72, yPercent: 58, lat: 16.495, lng: 80.684 },
  'Eluru Road & Governorpet': { xPercent: 48, yPercent: 32, lat: 16.514, lng: 80.628 },
  'Bhavanipuram & Gollapudi Bypass': { xPercent: 24, yPercent: 36, lat: 16.535, lng: 80.582 },
  'One Town & Kanaka Durga Varadhi': { xPercent: 36, yPercent: 48, lat: 16.509, lng: 80.605 },
  // Guntur
  'Brodipet & Main Commercial Spine': { xPercent: 46, yPercent: 38, lat: 16.312, lng: 80.438 },
  'Arundalpet & Collectorate Road': { xPercent: 52, yPercent: 34, lat: 16.304, lng: 80.445 },
  'Amaravathi Road & Pattabhipuram': { xPercent: 32, yPercent: 42, lat: 16.324, lng: 80.412 },
  'Old Guntur & Mirchi Yard Bypass': { xPercent: 64, yPercent: 62, lat: 16.284, lng: 80.461 },
  'Koretipadu & Gujanagundla Junction': { xPercent: 38, yPercent: 52, lat: 16.295, lng: 80.422 },
};

export function getTabFromUrl(): NavigationTab {
  if (typeof window === 'undefined') return 'landing';
  const path = window.location.pathname.toLowerCase().replace(/\/$/, '');
  const hash = window.location.hash.toLowerCase().replace(/\/$/, '');

  if (path === '/login' || hash === '#/login' || hash === '#login') return 'login';
  if (path === '/signup' || hash === '#/signup' || hash === '#signup') return 'signup';
  if (path === '/overview' || path === '/dashboard' || hash === '#/overview' || hash === '#dashboard' || hash === '#overview') return 'overview';
  if (path === '/map' || hash === '#/map' || hash === '#map') return 'map';
  if (path === '/scanner' || path === '/roadguard' || hash === '#/scanner' || hash === '#scanner') return 'roadguard_scanner';
  if (path === '/report' || hash === '#/report' || hash === '#report') return 'report';
  if (path === '/management' || path === '/dispatch' || hash === '#/management' || hash === '#management') return 'management';
  if (path === '/analytics' || hash === '#/analytics' || hash === '#analytics') return 'analytics';
  if (path === '/challenges' || hash === '#/challenges' || hash === '#challenges') return 'challenges';
  return 'landing';
}

export function getUrlForTab(tab: NavigationTab): string {
  switch (tab) {
    case 'login': return '/login';
    case 'signup': return '/signup';
    case 'roadguard_scanner': return '/scanner';
    case 'overview': return '/overview';
    case 'map': return '/map';
    case 'report': return '/report';
    case 'management': return '/management';
    case 'analytics': return '/analytics';
    case 'challenges': return '/challenges';
    case 'landing':
    default:
      return '/';
  }
}

export const EcoPulseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state with AP migration check
  const [issues, setIssues] = useState<EnvironmentalIssue[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_issues`);
      if (saved) {
        const parsed: EnvironmentalIssue[] = JSON.parse(saved);
        if (parsed.length > 0 && (parsed[0].city === 'Vijayawada' || parsed[0].city === 'Guntur')) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_ISSUES;
  });

  const [challenges, setChallenges] = useState<CleanupChallenge[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_challenges`);
      if (saved) {
        const parsed: CleanupChallenge[] = JSON.parse(saved);
        if (parsed.length > 0 && (parsed[0].city === 'Vijayawada' || parsed[0].city === 'Guntur')) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_CHALLENGES;
  });

  const [currentUser, setCurrentUser] = useState<VolunteerUser>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_user`);
      if (saved) {
        const parsed: VolunteerUser = JSON.parse(saved);
        if (parsed.city === 'Vijayawada' || parsed.city === 'Guntur') {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return CURRENT_USER;
  });

  const [leaderboard, setLeaderboard] = useState<VolunteerUser[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_leaderboard`);
      if (saved) {
        const parsed: VolunteerUser[] = JSON.parse(saved);
        if (parsed.length > 0 && (parsed[0].city === 'Vijayawada' || parsed[0].city === 'Guntur')) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_LEADERBOARD;
  });

  const [notifications, setNotifications] = useState<ActivityNotification[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_notifications`);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [awardedActions, setAwardedActions] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_awarded`);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return ['initial_seed_ap'];
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(`${STORAGE_KEY}_auth_session`) === 'true';
    } catch {
      return false;
    }
  });

  const [activeTab, setActiveTabState] = useState<NavigationTab>(() => getTabFromUrl());

  const setActiveTab = useCallback((tab: NavigationTab) => {
    setActiveTabState(tab);
    if (typeof window !== 'undefined') {
      const targetUrl = getUrlForTab(tab);
      const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
      if (currentPath !== targetUrl) {
        window.history.pushState({ tab }, '', targetUrl);
      }
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setActiveTabState(getTabFromUrl());
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const [selectedCity, setSelectedCity] = useState<'All Cities' | SupportedCity>('All Cities');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('All Localities');
  const [domainFilter, setDomainFilter] = useState<DomainFilter>('all');
  const [inspectedIssueId, setInspectedIssueId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persist state changes
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_issues`, JSON.stringify(issues));
      localStorage.setItem(`${STORAGE_KEY}_challenges`, JSON.stringify(challenges));
      localStorage.setItem(`${STORAGE_KEY}_user`, JSON.stringify(currentUser));
      localStorage.setItem(`${STORAGE_KEY}_leaderboard`, JSON.stringify(leaderboard));
      localStorage.setItem(`${STORAGE_KEY}_notifications`, JSON.stringify(notifications));
      localStorage.setItem(`${STORAGE_KEY}_awarded`, JSON.stringify(awardedActions));
    } catch {
      // Ignore storage errors
    }
  }, [issues, challenges, currentUser, leaderboard, notifications, awardedActions]);

  const addToast = useCallback((type: ToastMessage['type'], title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);

    setTimeout(() => {
      setToasts((current) => current.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  // Filter issues based on city, locality, and domain filter
  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      if (selectedCity !== 'All Cities' && issue.city !== selectedCity) {
        return false;
      }
      if (selectedNeighborhood !== 'All Localities' && issue.neighborhood !== selectedNeighborhood) {
        return false;
      }
      if (domainFilter === 'environmental' && issue.reportType !== 'environmental') {
        return false;
      }
      if (domainFilter === 'roadguard' && issue.reportType !== 'roadguard') {
        return false;
      }
      return true;
    });
  }, [issues, selectedCity, selectedNeighborhood, domainFilter]);

  // Derived metrics recalculated strictly from live issues state
  const metrics = useMemo(() => {
    const list = filteredIssues;
    const totalReports = list.length;
    const resolvedList = list.filter((i) => i.status === 'Resolved');
    const resolvedCount = resolvedList.length;
    const pendingCount = totalReports - resolvedCount;
    const resolutionRate = totalReports > 0 ? Number(((resolvedCount / totalReports) * 100).toFixed(1)) : 0;

    const totalWasteCleanedKg = resolvedList
      .filter((i) => i.reportType === 'environmental')
      .reduce((acc, curr) => acc + (curr.estimatedWasteKg || 0), 0);

    const potholesPatched = resolvedList
      .filter((i) => i.reportType === 'roadguard').length;

    // High priority road hazards (> 70 rule)
    const highPriorityPotholesCount = list.filter(
      (i) => i.reportType === 'roadguard' && (i.roadDamageDetails?.assessmentScore || 0) > 70
    ).length;

    const criticalCount = list.filter((i) => i.severity === 'Critical' && i.status !== 'Resolved').length;
    const activeWithScores = list.filter((i) => i.status !== 'Resolved');
    const averagePriorityScore = activeWithScores.length > 0
      ? Math.round(activeWithScores.reduce((sum, item) => sum + item.priorityScore, 0) / activeWithScores.length)
      : 0;

    const vijayawadaCount = list.filter((i) => i.city === 'Vijayawada').length;
    const gunturCount = list.filter((i) => i.city === 'Guntur').length;
    const environmentalCount = list.filter((i) => i.reportType === 'environmental').length;
    const roadguardCount = list.filter((i) => i.reportType === 'roadguard').length;

    return {
      totalReports,
      pendingCount,
      resolvedCount,
      resolutionRate,
      totalWasteCleanedKg,
      potholesPatched,
      highPriorityPotholesCount,
      criticalCount,
      averagePriorityScore,
      vijayawadaCount,
      gunturCount,
      environmentalCount,
      roadguardCount,
    };
  }, [filteredIssues]);

  // Highest priority hotspots: unresolved sorted by priorityScore descending
  const highestPriorityHotspots = useMemo(() => {
    return [...filteredIssues]
      .filter((i) => i.status !== 'Resolved')
      .sort((a, b) => b.priorityScore - a.priorityScore);
  }, [filteredIssues]);

  // Add report with strict Vijayawada & Guntur validation
  const addReport = useCallback(
    (data: {
      reportType?: ReportType;
      city?: SupportedCity;
      title: string;
      category: IssueCategory;
      neighborhood: Neighborhood;
      locationDetails: string;
      landmark?: string;
      wardNumber?: string;
      severity: IssueSeverity;
      description: string;
      reporterName: string;
      estimatedWasteKg: number;
      roadDamageDetails?: RoadDamageDetails;
      imageUrl?: string;
    }) => {
      const nowIso = new Date().toISOString();
      const newNumericId = 1050 + issues.length;
      const isRoadGuard = data.reportType === 'roadguard';
      const newId = isRoadGuard ? `RG-${newNumericId}` : `ECO-${newNumericId}`;

      // Derive city strictly from neighborhood
      const resolvedCity: SupportedCity = data.city || getCityForNeighborhood(data.neighborhood);

      // Check strictly greater than 70 rule for assessment score
      const rawScore = data.roadDamageDetails?.assessmentScore;
      const isScoreStrictlyOver70 = typeof rawScore === 'number' && rawScore > 70; // 70 is false, 71 is true

      const finalRoadDamageDetails: RoadDamageDetails | undefined = isRoadGuard
        ? {
            ...(data.roadDamageDetails || {
              depthCm: 12,
              trafficRisk: 'High (Monsoon Waterlogged)',
              laneImpact: 'Two-Wheeler Lane',
            }),
            isHighPriorityThreshold: isScoreStrictlyOver70,
            demoRoutingDestination: getDemoRoutingDestination(resolvedCity, isScoreStrictlyOver70),
          }
        : undefined;

      // Adjust severity if strictly > 70
      const effectiveSeverity: IssueSeverity = isScoreStrictlyOver70 ? 'Critical' : data.severity;

      // Calculate priority score deterministically
      const priorityBreakdown = calculatePriorityScore(
        effectiveSeverity,
        1,
        nowIso,
        'Reported',
        data.reportType || 'environmental'
      );

      // Coordinates within supported AP bounds
      const baseCoords = NEIGHBORHOOD_COORDS[data.neighborhood] || {
        xPercent: 50,
        yPercent: 50,
        lat: resolvedCity === 'Vijayawada' ? 16.506 : 16.306,
        lng: resolvedCity === 'Vijayawada' ? 80.648 : 80.436,
      };

      const jitterX = (Math.random() - 0.5) * 4;
      const jitterY = (Math.random() - 0.5) * 4;

      const newIssue: EnvironmentalIssue = {
        id: newId,
        reportType: data.reportType || 'environmental',
        city: resolvedCity,
        title: data.title,
        category: data.category,
        neighborhood: data.neighborhood,
        locationDetails: data.locationDetails,
        landmark: data.landmark,
        wardNumber: data.wardNumber,
        coordinates: {
          xPercent: Math.max(5, Math.min(95, baseCoords.xPercent + jitterX)),
          yPercent: Math.max(5, Math.min(95, baseCoords.yPercent + jitterY)),
          lat: Number((baseCoords.lat + (Math.random() - 0.5) * 0.005).toFixed(4)),
          lng: Number((baseCoords.lng + (Math.random() - 0.5) * 0.005).toFixed(4)),
        },
        severity: effectiveSeverity,
        description: data.description,
        reporterName: data.reporterName || currentUser.name,
        reportedAt: nowIso,
        status: 'Reported',
        reportCount: 1,
        estimatedWasteKg: data.estimatedWasteKg || (isRoadGuard ? 120 : 50),
        roadDamageDetails: finalRoadDamageDetails,
        imageUrl: data.imageUrl,
        priorityScore: priorityBreakdown.totalScore,
        priorityBreakdown,
      };

      setIssues((prev) => [newIssue, ...prev]);

      // Award +50 GreenPoints
      const actionKey = `report_${newId}`;
      let pointsAwarded = 0;
      if (!awardedActions.includes(actionKey)) {
        pointsAwarded = 50;
        setAwardedActions((prev) => [...prev, actionKey]);
        setCurrentUser((user) => ({
          ...user,
          greenPoints: user.greenPoints + 50,
          reportsFiled: user.reportsFiled + 1,
          roadGuardReportsCount: isRoadGuard ? user.roadGuardReportsCount + 1 : user.roadGuardReportsCount,
        }));
        setLeaderboard((prev) =>
          prev.map((u) =>
            u.id === currentUser.id
              ? {
                  ...u,
                  greenPoints: u.greenPoints + 50,
                  reportsFiled: u.reportsFiled + 1,
                  roadGuardReportsCount: isRoadGuard ? u.roadGuardReportsCount + 1 : u.roadGuardReportsCount,
                }
              : u
          )
        );
      }

      // Add notification
      const notif: ActivityNotification = {
        id: `NOTIF-${Date.now()}`,
        title: isRoadGuard
          ? `${resolvedCity} RoadGuard: ${newId} ${isScoreStrictlyOver70 ? '(HIGH PRIORITY)' : ''}`
          : `New ${resolvedCity} Report: ${newId}`,
        description: `${data.title} in ${data.neighborhood}. Priority: ${priorityBreakdown.totalScore}/100.`,
        timestamp: 'Just now',
        type: isRoadGuard ? 'roadguard' : 'report',
        read: false,
      };
      setNotifications((prev) => [notif, ...prev]);

      addToast(
        'success',
        isRoadGuard ? `RoadGuard Pothole ${newId} Registered` : `Incident ${newId} Submitted`,
        `${resolvedCity} queue updated. Priority: ${priorityBreakdown.totalScore}/100.${pointsAwarded ? ' Earned +50 GreenPoints!' : ''}`
      );

      return newId;
    },
    [issues.length, currentUser, awardedActions, addToast]
  );

  // Update status with working transitions
  const updateIssueStatus = useCallback(
    (issueId: string, nextStatus: IssueStatus, assignedTeam?: string, notes?: string) => {
      let isRoadGuard = false;
      let earnedPoints = 0;
      let issueCity: SupportedCity = 'Vijayawada';

      setIssues((prev) =>
        prev.map((issue) => {
          if (issue.id !== issueId) return issue;

          isRoadGuard = issue.reportType === 'roadguard';
          issueCity = issue.city;
          const nowIso = new Date().toISOString();

          const breakdown = calculatePriorityScore(
            issue.severity,
            issue.reportCount,
            issue.reportedAt,
            nextStatus,
            issue.reportType
          );

          return {
            ...issue,
            status: nextStatus,
            assignedTeam: assignedTeam !== undefined ? assignedTeam : issue.assignedTeam,
            assignedAt: nextStatus === 'Assigned' && !issue.assignedAt ? nowIso : issue.assignedAt,
            resolvedAt: nextStatus === 'Resolved' ? nowIso : undefined,
            resolutionNotes: notes !== undefined ? notes : issue.resolutionNotes,
            priorityScore: breakdown.totalScore,
            priorityBreakdown: breakdown,
          };
        })
      );

      if (nextStatus === 'Resolved') {
        const actionKey = `resolve_${issueId}`;
        if (!awardedActions.includes(actionKey)) {
          earnedPoints = 100;
          setAwardedActions((prev) => [...prev, actionKey]);
          setCurrentUser((user) => ({
            ...user,
            greenPoints: user.greenPoints + 100,
            cleanupsParticipated: user.cleanupsParticipated + 1,
          }));
          setLeaderboard((prev) =>
            prev.map((u) =>
              u.id === currentUser.id
                ? { ...u, greenPoints: u.greenPoints + 100, cleanupsParticipated: u.cleanupsParticipated + 1 }
                : u
            )
          );
        }
      }

      const notif: ActivityNotification = {
        id: `NOTIF-${Date.now()}`,
        title: `Status Updated: ${issueId} (${issueCity})`,
        description: `Marked as "${nextStatus}"${assignedTeam ? ` (Assigned to ${assignedTeam})` : ''}.`,
        timestamp: 'Just now',
        type: isRoadGuard ? 'roadguard' : 'status',
        read: false,
      };
      setNotifications((prev) => [notif, ...prev]);

      addToast(
        'info',
        `Incident ${issueId} updated`,
        `Status set to ${nextStatus}.${earnedPoints ? ` Earned +${earnedPoints} GreenPoints for verified resolution!` : ''}`
      );
    },
    [awardedActions, currentUser.id, addToast]
  );

  // Join challenge
  const joinChallenge = useCallback(
    (challengeId: string) => {
      const actionKey = `join_chal_${challengeId}`;
      let reward = 0;

      setChallenges((prev) =>
        prev.map((c) => {
          if (c.id !== challengeId) return c;
          if (c.isJoined) return c;
          reward = c.rewardPoints || 75;
          return {
            ...c,
            isJoined: true,
            participantsCount: c.participantsCount + 1,
          };
        })
      );

      if (!awardedActions.includes(actionKey) && reward > 0) {
        setAwardedActions((prev) => [...prev, actionKey]);
        setCurrentUser((u) => ({
          ...u,
          greenPoints: u.greenPoints + reward,
        }));
        setLeaderboard((prev) =>
          prev.map((u) => (u.id === currentUser.id ? { ...u, greenPoints: u.greenPoints + reward } : u))
        );

        addToast('success', 'Joined Civic Challenge!', `Awarded +${reward} GreenPoints for participating.`);
      } else {
        addToast('info', 'Challenge Active', 'You are enrolled in this municipal campaign.');
      }
    },
    [awardedActions, currentUser.id, addToast]
  );

  // Contribute to challenge
  const contributeToChallenge = useCallback(
    (challengeId: string, amount: number) => {
      setChallenges((prev) =>
        prev.map((c) => {
          if (c.id !== challengeId) return c;
          const nextVal = Math.min(c.targetKg, c.currentKg + amount);
          const isDone = nextVal >= c.targetKg;
          return {
            ...c,
            currentKg: nextVal,
            status: isDone ? 'Completed' : c.status,
          };
        })
      );
      addToast('success', 'Progress Logged', `Added ${amount} units to the municipal drive!`);
    },
    [addToast]
  );

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    addToast('info', 'Notifications cleared', 'All notifications have been cleared.');
  }, [addToast]);

  // Honest Demo Authentication Session Management
  const login = useCallback(
    async (email: string, password: string, rememberMe: boolean = true): Promise<{ success: boolean; error?: string }> => {
      // Realistic simulated network latency
      await new Promise((resolve) => setTimeout(resolve, 350));

      if (!email || !email.includes('@')) {
        return { success: false, error: 'Please enter a valid email address.' };
      }
      if (!password || password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters.' };
      }

      // Check for user in leaderboard or assign to session
      const matchedUser = leaderboard.find((u) => u.email?.toLowerCase() === email.toLowerCase());
      if (matchedUser) {
        setCurrentUser(matchedUser);
      } else {
        setCurrentUser((prev) => ({
          ...prev,
          email,
        }));
      }

      setIsAuthenticated(true);
      try {
        if (rememberMe) {
          localStorage.setItem(`${STORAGE_KEY}_auth_session`, 'true');
        }
      } catch {
        // Ignore storage errors
      }

      addToast(
        'success',
        'Authenticated Successfully',
        `Welcome back, ${matchedUser ? matchedUser.name : currentUser.name}!`
      );
      return { success: true };
    },
    [leaderboard, currentUser.name, addToast]
  );

  const signup = useCallback(
    async (
      name: string,
      email: string,
      password: string,
      city: SupportedCity,
      neighborhood: Neighborhood
    ): Promise<{ success: boolean; error?: string }> => {
      await new Promise((resolve) => setTimeout(resolve, 450));

      if (!name.trim() || name.trim().length < 2) {
        return { success: false, error: 'Full name must be at least 2 characters.' };
      }
      if (!email || !email.includes('@')) {
        return { success: false, error: 'Please enter a valid email address.' };
      }
      if (!password || password.length < 8) {
        return { success: false, error: 'Password must be at least 8 characters with at least one number.' };
      }

      const newUserId = `USR-${Date.now().toString(36).toUpperCase()}`;
      const newUser: VolunteerUser = {
        id: newUserId,
        name: name.trim(),
        email: email.trim(),
        role: `${city} Civic Steward`,
        city,
        neighborhood,
        greenPoints: 100, // Welcome bonus points
        reportsFiled: 0,
        cleanupsParticipated: 0,
        roadGuardReportsCount: 0,
        badges: ['New Civic Recruit', 'EcoPulse Member'],
        rank: leaderboard.length + 1,
      };

      setCurrentUser(newUser);
      setLeaderboard((prev) => [newUser, ...prev]);
      setIsAuthenticated(true);

      try {
        localStorage.setItem(`${STORAGE_KEY}_auth_session`, 'true');
      } catch {
        // Ignore storage errors
      }

      addToast(
        'success',
        'Account Created (+100 GreenPoints)',
        `Welcome to EcoPulse RoadGuard, ${newUser.name}!`
      );
      return { success: true };
    },
    [leaderboard.length, addToast]
  );

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem(`${STORAGE_KEY}_auth_session`);
    } catch {
      // Ignore
    }
    addToast('info', 'Signed Out', 'You have been signed out of your demonstration session.');
  }, [addToast]);

  // Reset demo data to pristine Vijayawada & Guntur seeds
  const resetDemoData = useCallback(() => {
    try {
      localStorage.removeItem(`${STORAGE_KEY}_issues`);
      localStorage.removeItem(`${STORAGE_KEY}_challenges`);
      localStorage.removeItem(`${STORAGE_KEY}_user`);
      localStorage.removeItem(`${STORAGE_KEY}_leaderboard`);
      localStorage.removeItem(`${STORAGE_KEY}_notifications`);
      localStorage.removeItem(`${STORAGE_KEY}_awarded`);
      localStorage.removeItem(`${STORAGE_KEY}_auth_session`);
    } catch {
      // Ignore
    }
    setIssues(INITIAL_ISSUES);
    setChallenges(INITIAL_CHALLENGES);
    setCurrentUser(CURRENT_USER);
    setLeaderboard(INITIAL_LEADERBOARD);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAwardedActions(['initial_seed_ap']);
    setSelectedCity('All Cities');
    setSelectedNeighborhood('All Localities');
    setDomainFilter('all');
    setInspectedIssueId(null);
    setIsAuthenticated(false);
    addToast('info', 'Demo Data Reset', 'Platform restored to initial Vijayawada & Guntur demonstration state.');
  }, [addToast]);

  // Export JSON data
  const exportDataJson = useCallback(() => {
    const dataToExport = {
      exportTimestamp: new Date().toISOString(),
      region: 'Vijayawada & Guntur, Andhra Pradesh',
      issues,
      challenges,
      currentUser,
      metrics,
    };
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ecopulse-roadguard-ap-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('success', 'Data Exported', 'Downloaded complete Vijayawada & Guntur records as JSON.');
  }, [issues, challenges, currentUser, metrics, addToast]);

  return (
    <EcoPulseContext.Provider
      value={{
        issues,
        challenges,
        currentUser,
        leaderboard,
        notifications,
        toasts,
        activeTab,
        selectedCity,
        selectedNeighborhood,
        domainFilter,
        inspectedIssueId,
        isAuthenticated,
        authMode: 'demo_session',
        login,
        signup,
        logout,
        setActiveTab,
        setSelectedCity,
        setSelectedNeighborhood,
        setDomainFilter,
        setInspectedIssueId,
        addReport,
        updateIssueStatus,
        joinChallenge,
        contributeToChallenge,
        markNotificationRead,
        clearAllNotifications,
        dismissToast,
        resetDemoData,
        exportDataJson,
        filteredIssues,
        metrics,
        highestPriorityHotspots,
      }}
    >
      {children}
    </EcoPulseContext.Provider>
  );
};

export const useEcoPulse = () => {
  const context = useContext(EcoPulseContext);
  if (!context) {
    throw new Error('useEcoPulse must be used within an EcoPulseProvider');
  }
  return context;
};

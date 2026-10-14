export type SupportedCity = 'Vijayawada' | 'Guntur';

export type ReportType = 'environmental' | 'roadguard';

export type IssueCategory =
  // Environmental Categories (Vijayawada & Guntur Civic Context)
  | 'Garbage Vulnerability Point (GVP)'
  | 'Plastic & Storm Drain Clog'
  | 'Hazardous & Effluent Runoff'
  | 'Krishna Canal & Waterway Pollution'
  | 'Green Belt & Avenue Tree Hazard'
  | 'Open Waste Burning & Smog'
  // RoadGuard Pothole & Road Hazard Categories
  | 'Severe Pothole & Road Crater'
  | 'Broken Manhole & Drainage Cover'
  | 'Asphalt Subsidence & Trenching'
  | 'Median & Divider Hazard';

export type IssueSeverity = 'Low' | 'Medium' | 'High' | 'Critical';

export type IssueStatus = 'Reported' | 'Assigned' | 'In Progress' | 'Resolved';

// Strictly Vijayawada and Guntur localities
export type Neighborhood =
  // Vijayawada
  | 'Benz Circle & MG Road (Bandar Road)'
  | 'Autonagar Industrial Corridor'
  | 'Eluru Road & Governorpet'
  | 'Bhavanipuram & Gollapudi Bypass'
  | 'One Town & Kanaka Durga Varadhi'
  // Guntur
  | 'Brodipet & Main Commercial Spine'
  | 'Arundalpet & Collectorate Road'
  | 'Amaravathi Road & Pattabhipuram'
  | 'Old Guntur & Mirchi Yard Bypass'
  | 'Koretipadu & Gujanagundla Junction';

export interface PriorityBreakdown {
  severityNormalized: number;  // 0-100
  clusterNormalized: number;   // 0-100
  ageNormalized: number;       // 0-100
  severityContribution: number; // severityNormalized * 0.50
  clusterContribution: number;  // clusterNormalized * 0.30
  ageContribution: number;      // ageNormalized * 0.20
  totalScore: number;           // 0-100
  explanation: string;
}

export interface RoadDamageDetails {
  depthCm: number;
  widthCm?: number;
  trafficRisk: 'Low' | 'Moderate' | 'High (Monsoon Waterlogged)' | 'Critical Accident Hazard';
  laneImpact: 'Two-Wheeler Lane' | 'Main Carriageway' | 'Bus Priority Lane' | 'Junction / Pedestrian Crossing' | 'Flyover Approach';
  detectedVia?: 'Citizen Manual Report' | 'RoadGuard AI Scanner' | 'Community Patrol';
  assessmentScore?: number; // 0 to 100
  confidencePercent?: number;
  observations?: string[];
  isHighPriorityThreshold?: boolean; // Strictly score > 70
  demoRoutingDestination?: string; // e.g. "Ready for Municipal Submission (Demo Routing — VMC PWD Cell)"
}

export interface EnvironmentalIssue {
  id: string;
  reportType: ReportType;
  city: SupportedCity;
  title: string;
  category: IssueCategory;
  neighborhood: Neighborhood;
  locationDetails: string;
  landmark?: string;
  wardNumber?: string;
  coordinates: {
    xPercent: number; // 0 to 100 for interactive district map placement
    yPercent: number; // 0 to 100
    lat: number;
    lng: number;
  };
  severity: IssueSeverity;
  description: string;
  reporterName: string;
  reportedAt: string; // ISO string
  status: IssueStatus;
  assignedTeam?: string;
  assignedAt?: string;
  resolvedAt?: string;
  resolutionNotes?: string;
  imageUrl?: string;
  reportCount: number; // Number of citizens reporting this cluster
  estimatedWasteKg: number; // For environmental; for RoadGuard represents asphalt patch kg
  roadDamageDetails?: RoadDamageDetails;
  priorityScore: number; // 0 - 100
  priorityBreakdown: PriorityBreakdown;
}

export interface PotholeAssessmentResult {
  potholeDetected: boolean;
  severityScore: number; // 0 to 100
  confidencePercent: number; // e.g. 91
  estimatedDepthCm: number;
  damageType: string;
  visibleObservations: string[];
  recommendedUrgency: 'Critical Emergency Patch' | 'High Priority' | 'Routine Maintenance';
  isHighPriority: boolean; // strictly severityScore > 70
  assessmentMode: 'ai_vision' | 'demonstration_analysis';
  disclaimer: string;
  imageUrl?: string;
}

export interface CleanupChallenge {
  id: string;
  reportType: ReportType;
  city: SupportedCity;
  title: string;
  category: IssueCategory;
  neighborhood: Neighborhood;
  description: string;
  targetKg: number;
  currentKg: number;
  unitLabel: string;
  participantsCount: number;
  daysRemaining: number;
  rewardPoints: number;
  status: 'Active' | 'Completed';
  isJoined?: boolean;
}

export interface VolunteerUser {
  id: string;
  name: string;
  email?: string;
  role: string;
  city: SupportedCity;
  neighborhood: Neighborhood;
  greenPoints: number;
  reportsFiled: number;
  cleanupsParticipated: number;
  roadGuardReportsCount: number;
  badges: string[];
  rank: number;
}

export interface ActivityNotification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'report' | 'status' | 'challenge' | 'points' | 'roadguard';
  read: boolean;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

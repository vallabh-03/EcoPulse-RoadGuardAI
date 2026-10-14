import { SupportedCity, Neighborhood } from '../types/index.ts';

export interface CityGeofence {
  name: SupportedCity;
  state: 'Andhra Pradesh';
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
  centerLat: number;
  centerLng: number;
  municipalBody: string;
  majorCorridors: string[];
}

export const SUPPORTED_CITIES_CONFIG: Record<SupportedCity, CityGeofence> = {
  Vijayawada: {
    name: 'Vijayawada',
    state: 'Andhra Pradesh',
    minLat: 16.440,
    maxLat: 16.590,
    minLng: 80.540,
    maxLng: 80.730,
    centerLat: 16.5062,
    centerLng: 80.6480,
    municipalBody: 'Vijayawada Municipal Corporation (VMC)',
    majorCorridors: ['MG Road (Bandar Road)', 'Eluru Road', 'Prakasam Barrage & Varadhi', 'Autonagar 100ft Spine'],
  },
  Guntur: {
    name: 'Guntur',
    state: 'Andhra Pradesh',
    minLat: 16.220,
    maxLat: 16.380,
    minLng: 80.370,
    maxLng: 80.530,
    centerLat: 16.3067,
    centerLng: 80.4365,
    municipalBody: 'Guntur Municipal Corporation (GMC)',
    majorCorridors: ['Amaravathi Road', 'Brodipet Main Commercial Road', 'Arundalpet Collectorate Marg', 'Old Guntur GT Road'],
  },
};

export const VIJAYAWADA_NEIGHBORHOODS: Neighborhood[] = [
  'Benz Circle & MG Road (Bandar Road)',
  'Autonagar Industrial Corridor',
  'Eluru Road & Governorpet',
  'Bhavanipuram & Gollapudi Bypass',
  'One Town & Kanaka Durga Varadhi',
];

export const GUNTUR_NEIGHBORHOODS: Neighborhood[] = [
  'Brodipet & Main Commercial Spine',
  'Arundalpet & Collectorate Road',
  'Amaravathi Road & Pattabhipuram',
  'Old Guntur & Mirchi Yard Bypass',
  'Koretipadu & Gujanagundla Junction',
];

export function getCityForNeighborhood(neighborhood: Neighborhood): SupportedCity {
  if (VIJAYAWADA_NEIGHBORHOODS.includes(neighborhood)) {
    return 'Vijayawada';
  }
  return 'Guntur';
}

export function validateCoordinates(lat: number, lng: number): {
  isValid: boolean;
  city?: SupportedCity;
  error?: string;
  municipalBody?: string;
} {
  // Check Vijayawada
  const v = SUPPORTED_CITIES_CONFIG.Vijayawada;
  if (lat >= v.minLat && lat <= v.maxLat && lng >= v.minLng && lng <= v.maxLng) {
    return {
      isValid: true,
      city: 'Vijayawada',
      municipalBody: v.municipalBody,
    };
  }

  // Check Guntur
  const g = SUPPORTED_CITIES_CONFIG.Guntur;
  if (lat >= g.minLat && lat <= g.maxLat && lng >= g.minLng && lng <= g.maxLng) {
    return {
      isValid: true,
      city: 'Guntur',
      municipalBody: g.municipalBody,
    };
  }

  return {
    isValid: false,
    error: `Location coordinates (${lat.toFixed(4)}, ${lng.toFixed(4)}) fall outside our active service region. EcoPulse RoadGuard is strictly deployed in Vijayawada & Guntur, Andhra Pradesh.`,
  };
}

export function getDemoRoutingDestination(city: SupportedCity, isHighPriority: boolean): string {
  if (city === 'Vijayawada') {
    return isHighPriority
      ? 'Ready for Municipal Submission (Demo Routing — VMC PWD Rapid Road Patching Wing, Circle II)'
      : 'Ready for Municipal Submission (Demo Routing — VMC Road Maintenance Cell)';
  }
  return isHighPriority
    ? 'Ready for Municipal Submission (Demo Routing — GMC PWD Emergency Corridor Cell, Zone 1)'
    : 'Ready for Municipal Submission (Demo Routing — GMC Road Maintenance Wing)';
}

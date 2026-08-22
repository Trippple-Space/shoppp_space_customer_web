export type FitRecommendationStatus =
  | 'perfect'
  | 'warning'
  | 'no_fit'
  | 'unavailable';

export type FitRecommendationConfidence = 'high' | 'medium' | 'low' | 'none';

export interface FitMeasurementComparison {
  label: string;
  userValue: string;
  garmentRange: string;
  easeLabel: string;
  visibility?: 'all' | 'mobile' | 'desktop';
}

export interface FitSpectrumSegment {
  id: string;
  label: string;
  active: boolean;
}

export interface ProductFitRecommendationData {
  status: FitRecommendationStatus;
  sizeLabel: string;
  headline: string;
  subheadline: string;
  statusBadge: string;
  description: string;
  measurements: FitMeasurementComparison[];
  spectrum: FitSpectrumSegment[];
  profileSummary: string;
  userName: string;
  eligible?: boolean;
  confidence?: FitRecommendationConfidence;
  recommendedSizeLabel?: string | null;
  archetypeSlug?: string | null;
  fitMode?: string | null;
  message?: string | null;
}

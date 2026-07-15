export type FitRecommendationStatus = 'perfect' | 'warning';

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
}

import endpoints from '../endpoints';
import http from '../http';
import { replaceParamInEndpoint } from '../utility';
import type {
  BodyBuild,
  MeasurementUnit,
  PersonalizationDimensions,
  ShoeSizeScale,
  ShopPreference,
} from '../store/personalization.store';
import type { ProductFitRecommendationData } from '@/modules/views/product-details/types/product-fit-recommendation';
import type { ProductSizeChartResponse } from '@/modules/views/product-details/types/product-size-chart';

export type FitOracleProfileDimensions =
  | PersonalizationDimensions
  | Partial<PersonalizationDimensions>;

export interface FitOracleProfilePayload {
  shopPreference?: ShopPreference | null;
  bodyBuild?: BodyBuild | null;
  unit?: MeasurementUnit;
  shoeScale?: ShoeSizeScale;
  dimensions?: FitOracleProfileDimensions;
  markComplete?: boolean;
}

export interface FitOracleProfileResponse {
  id?: string;
  shopPreference: ShopPreference | null;
  bodyBuild: BodyBuild | null;
  unit: MeasurementUnit;
  shoeScale?: ShoeSizeScale;
  dimensions: FitOracleProfileDimensions;
  version?: number;
  completedAt?: string | null;
  isComplete: boolean;
}

export interface FitOracleGetProfileResponse {
  isComplete: boolean;
  profile: FitOracleProfileResponse | null;
}

export interface FitOracleRecommendationRequest {
  variantId?: string;
  sizeLabel?: string;
  profile?: FitOracleProfilePayload;
  userName?: string;
}

class FitOracleService {
  getProfile(): Promise<FitOracleGetProfileResponse> {
    return http
      .get(endpoints.FIT_ORACLE_PROFILE)
      .then((response) => response.data);
  }

  upsertProfile(
    payload: FitOracleProfilePayload,
  ): Promise<FitOracleProfileResponse> {
    return http
      .put(endpoints.FIT_ORACLE_PROFILE, payload)
      .then((response) => response.data);
  }

  getRecommendation(
    productId: string,
    body: FitOracleRecommendationRequest,
  ): Promise<ProductFitRecommendationData> {
    return http
      .post(
        replaceParamInEndpoint(
          endpoints.FIT_ORACLE_RECOMMENDATION,
          'productId',
          productId,
        ),
        body,
      )
      .then((response) => response.data);
  }

  getSizeChart(productId: string): Promise<ProductSizeChartResponse> {
    return http
      .get(
        replaceParamInEndpoint(
          endpoints.FIT_ORACLE_SIZE_CHART,
          'productId',
          productId,
        ),
      )
      .then((response) => response.data);
  }
}

export const fitOracleService = new FitOracleService();

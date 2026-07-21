import type {
  ProductFitSizeChart,
  ProductSizeChartResponse,
} from '../types/product-size-chart';

export const shouldShowProductSizeChart = (
  fitSizeChart?: ProductFitSizeChart | null,
): boolean => {
  if (!fitSizeChart) return false;
  if ('showSizeChart' in fitSizeChart)
    return fitSizeChart.showSizeChart ?? false;
  return fitSizeChart.available;
};

export const isFullProductSizeChart = (
  fitSizeChart?: ProductFitSizeChart | null,
): fitSizeChart is ProductSizeChartResponse =>
  !!fitSizeChart &&
  'rows' in fitSizeChart &&
  Array.isArray(fitSizeChart.rows);

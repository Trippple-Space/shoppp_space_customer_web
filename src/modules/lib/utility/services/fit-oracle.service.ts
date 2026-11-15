import type { ProductSizeChartResponse } from '@/modules/views/product-details/types/product-size-chart';
import endpoints from '../endpoints';
import http from '../http';

class FitOracleService {
  async getSizeChart(productId: string): Promise<ProductSizeChartResponse> {
    const endpoint = endpoints.FIT_ORACLE_SIZE_CHART.replace(
      ':productId',
      productId,
    );
    const response = await http.get(endpoint);
    return response.data?.data ?? response.data;
  }
}

export const fitOracleService = new FitOracleService();

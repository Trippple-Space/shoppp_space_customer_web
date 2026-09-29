'use client';

import { useEffect, useMemo, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import Modal from '@/modules/lib/components/modal/modal';
import SpinLoader from '@/modules/lib/components/spin-loader/SpinLoader';
import { fitOracleService } from '@/modules/lib/utility/services/fit-oracle.service';
import { cx } from '@/modules/lib/utility/utility';
import type { ProductSizeChartResponse } from '../types/product-size-chart';
import { isFullProductSizeChart } from '../utils/fit-size-chart';

type DisplayUnit = 'cm' | 'inches';

const CM_PER_INCH = 2.54;

const fromCm = (valueCm: number | null, unit: DisplayUnit): string => {
  if (valueCm == null || Number.isNaN(valueCm)) return '—';
  if (unit === 'inches') {
    return String(Math.round((valueCm / CM_PER_INCH) * 10) / 10);
  }
  return String(Math.round(valueCm * 10) / 10);
};

interface ProductSizeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName?: string;
  fitSizeChart?: ProductSizeChartResponse | null;
}

const ProductSizeChartModal = ({
  isOpen,
  onClose,
  productId,
  productName,
  fitSizeChart: initialChart,
}: ProductSizeChartModalProps) => {
  const [loading, setLoading] = useState(false);
  const [unit, setUnit] = useState<DisplayUnit>('cm');
  const [chart, setChart] = useState<ProductSizeChartResponse | null>(null);

  useEffect(() => {
    if (!isOpen || !productId) return;

    if (isFullProductSizeChart(initialChart)) {
      setChart(initialChart);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    fitOracleService
      .getSizeChart(productId)
      .then((data) => {
        if (!cancelled) setChart(data);
      })
      .catch(() => {
        if (!cancelled) {
          setChart({
            showSizeChart: false,
            available: false,
            title: 'Size chart',
            source: 'none',
            sizeLabels: [],
            measurementKeys: [],
            rows: [],
            accessorySummary: null,
            footwearChart: null,
            note: 'Unable to load size chart right now.',
          });
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen, productId, initialChart]);

  const title = useMemo(() => {
    if (chart?.title) return chart.title;
    if (productName) return `${productName} size chart`;
    return 'Size chart';
  }, [chart?.title, productName]);

  const accessory = chart?.accessorySummary;
  const footwearRows = chart?.footwearChart ?? [];
  const isFootwearChart = footwearRows.length > 0;
  const vendorShoeScale = accessory?.shoeScale || 'EU';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      extraClass={{ overflow: 'auto' }}
      extraModalClass={{ backgroundColor: '#00000073', zIndex: 60 }}
      className="h-fit md:w-fit sm:w-90p w-95p no-scrollbar"
    >
      <div
        className="l:w-720 md:w-650 w-full h-fit relative"
        style={{ maxHeight: 'calc(100dvh - 90px)' }}
      >
        <div className="sticky z-3 t-0 l-0 r-0 bg-white flex space-between a-items-center py-12 px-24 border-solid border-b border-1 border-#00000014">
          <h5 className="text-16 weight-600 line-height-24 pr-16">{title}</h5>
          <AiOutlineClose
            className="pointer w-20 h-20 shrink-0"
            onClick={onClose}
          />
        </div>

        <div className="px-20 py-20 flex flex-col gap-16 overflow-auto">
          {loading ? (
            <div className="flex a-items-center j-content-center py-40">
              <SpinLoader size={28} color="#0B9378" loading />
            </div>
          ) : !chart?.available ? (
            <p className="text-14 color-#00000099">
              {chart?.note || 'No size chart is available for this product yet.'}
            </p>
          ) : (
            <>
              {!isFootwearChart && (
                <div className="flex a-items-center space-between gap-12 flex-wrap">
                  <p className="text-12 weight-500 color-#00000099">
                    All measurements below are in{' '}
                    {unit === 'cm' ? 'centimetres' : 'inches'}
                  </p>
                  <div className="inline-flex a-items-center bg-#F5F5F5 radius-99 p-2 gap-2">
                    {(['cm', 'inches'] as DisplayUnit[]).map((option) => {
                      const active = unit === option;
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setUnit(option)}
                          className={cx(
                            'border-none pointer px-12 py-5 radius-99 text-11 weight-500 uppercase g|transition:all|_0.2s|_ease',
                            active
                              ? 'bg-white color-#0B9378 weight-600'
                              : 'bg-transparent color-#6A6A6A',
                          )}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {isFootwearChart && (
                <p className="text-12 weight-500 color-#00000099">
                  Product sizes with standard EU / UK / US conversions. Vendor
                  labels use {vendorShoeScale}.
                </p>
              )}

              {chart.note && (
                <p className="text-12 color-#8A5A00 bg-#FFF8E8 border border-#F0D9A8 radius-8 px-12 py-10">
                  {chart.note}
                </p>
              )}

              {isFootwearChart && (
                <div className="overflow-x-auto radius-10 border border-#E8D5D0">
                  <table className="w-full border-collapse text-13 min-w-full">
                    <thead>
                      <tr>
                        {['EU', 'UK', 'US'].map((label) => (
                          <th
                            key={label}
                            className={cx(
                              'bg-#8B3A3A color-white text-center px-12 py-10 weight-600 whitespace-nowrap',
                              label === vendorShoeScale && 'bg-#6E2E2E',
                            )}
                          >
                            {label}
                            {label === vendorShoeScale ? ' · sold' : ''}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {footwearRows.map((row, index) => (
                        <tr key={`${row.sizeLabel}-${index}`}>
                          <td
                            className={cx(
                              'text-center px-12 py-10 color-#3D1F1F',
                              index % 2 === 0 ? 'bg-white' : 'bg-#FFF9F8',
                              vendorShoeScale === 'EU' && 'weight-600',
                            )}
                          >
                            {row.eu}
                          </td>
                          <td
                            className={cx(
                              'text-center px-12 py-10 color-#3D1F1F',
                              index % 2 === 0 ? 'bg-white' : 'bg-#FFF9F8',
                              vendorShoeScale === 'UK' && 'weight-600',
                            )}
                          >
                            {row.uk}
                          </td>
                          <td
                            className={cx(
                              'text-center px-12 py-10 color-#3D1F1F',
                              index % 2 === 0 ? 'bg-white' : 'bg-#FFF9F8',
                              vendorShoeScale === 'US' && 'weight-600',
                            )}
                          >
                            {row.us}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {!isFootwearChart &&
                chart.rows.length > 0 &&
                chart.sizeLabels.length > 0 && (
                  <div className="overflow-x-auto radius-10 border border-#E8D5D0">
                    <table className="w-full border-collapse text-13 min-w-full">
                      <thead>
                        <tr>
                          <th className="bg-#8B3A3A color-white text-left px-12 py-10 weight-600 whitespace-nowrap sticky l-0">
                            {unit === 'cm' ? 'CM' : 'IN'}
                          </th>
                          {chart.sizeLabels.map((size) => (
                            <th
                              key={size}
                              className="bg-#8B3A3A color-white text-center px-12 py-10 weight-600 whitespace-nowrap"
                            >
                              {size}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {chart.rows.map((row, index) => (
                          <tr key={row.key}>
                            <th
                              className={cx(
                                'text-left px-12 py-10 weight-600 whitespace-nowrap sticky l-0 color-#5C2A2A',
                                index % 2 === 0 ? 'bg-#F7EDEA' : 'bg-#F1E0DC',
                              )}
                            >
                              {row.label}
                            </th>
                            {row.values.map((value, valueIndex) => (
                              <td
                                key={`${row.key}-${valueIndex}`}
                                className={cx(
                                  'text-center px-12 py-10 color-#3D1F1F',
                                  index % 2 === 0 ? 'bg-white' : 'bg-#FFF9F8',
                                )}
                              >
                                {fromCm(value, unit)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

              {accessory && !isFootwearChart && (
                <div className="flex flex-col gap-10">
                  <p className="text-14 weight-600 color-#111">
                    Accessory fit details
                  </p>
                  <div className="grid gap-8 text-13 color-#333">
                    {!!accessory.necklaceLengthsCm?.length && (
                      <p>
                        Necklace lengths ({unit}):{' '}
                        {accessory.necklaceLengthsCm
                          .map((n) => fromCm(n, unit))
                          .join(', ')}
                      </p>
                    )}
                    {!!accessory.braceletLengthsCm?.length && (
                      <p>
                        Bracelet lengths ({unit}):{' '}
                        {accessory.braceletLengthsCm
                          .map((n) => fromCm(n, unit))
                          .join(', ')}
                      </p>
                    )}
                    {(accessory.lensWidthMm != null ||
                      accessory.bridgeMm != null ||
                      accessory.templeMm != null) && (
                      <p>
                        Eyewear (mm): lens {accessory.lensWidthMm ?? '—'} ·
                        bridge {accessory.bridgeMm ?? '—'} · temple{' '}
                        {accessory.templeMm ?? '—'}
                      </p>
                    )}
                    {!!accessory.headSizes?.length && (
                      <p>Head sizes: {accessory.headSizes.join(', ')}</p>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ProductSizeChartModal;

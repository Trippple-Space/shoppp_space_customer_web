'use client';

import { useEffect, useMemo, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import Modal from '@/modules/lib/components/modal/modal';
import SpinLoader from '@/modules/lib/components/spin-loader/SpinLoader';
import { cx } from '@/modules/lib/utility/utility';
import type { ProductSizeChartResponse } from '../types/product-size-chart';

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
    if (!isOpen) return;
    setChart(initialChart ?? null);
    setLoading(false);
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
      className="h-fit md:w-fit sm:w-[90%] w-[95%] no-scrollbar"
    >
      <div
        className="lg:w-[720px] md:w-[650px] w-full h-fit relative"
        style={{ maxHeight: 'calc(100dvh - 90px)' }}
      >
        <div className="sticky z-[3px] top-0 left-0 right-0 bg-white flex justify-between items-center py-[12px] px-[24px] border-solid border-b border border-[#00000014]">
          <h5 className="text-[16px] font-semibold leading-[24px] pr-[16px]">{title}</h5>
          <AiOutlineClose
            className="cursor-pointer w-[20px] h-[20px] shrink-0"
            onClick={onClose}
          />
        </div>

        <div className="px-[20px] py-[20px] flex flex-col gap-[16px] overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center py-[40px]">
              <SpinLoader size={28} color="#0357EE" loading />
            </div>
          ) : !chart?.available ? (
            <p className="text-[14px] text-[#00000099]">
              {chart?.note || 'No size chart is available for this product yet.'}
            </p>
          ) : (
            <>
              {!isFootwearChart && (
                <div className="flex items-center justify-between gap-[12px] flex-wrap">
                  <p className="text-[12px] font-medium text-[#00000099]">
                    All measurements below are in{' '}
                    {unit === 'cm' ? 'centimetres' : 'inches'}
                  </p>
                  <div className="inline-flex items-center bg-[#F5F5F5] rounded-[99px] p-[2px] gap-[2px]">
                    {(['cm', 'inches'] as DisplayUnit[]).map((option) => {
                      const active = unit === option;
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setUnit(option)}
                          className={cx(
                            'border-none cursor-pointer px-[12px] py-[5px] rounded-[99px] text-[11px] font-medium uppercase [transition:all|_0.2s|_ease]',
                            active
                              ? 'bg-white text-[#0357EE] font-semibold'
                              : 'bg-transparent text-[#6A6A6A]',
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
                <p className="text-[12px] font-medium text-[#00000099]">
                  Product sizes with standard EU / UK / US conversions. Vendor
                  labels use {vendorShoeScale}.
                </p>
              )}

              {chart.note && (
                <p className="text-[12px] text-[#8A5A00] bg-[#FFF8E8] border border-[#F0D9A8] rounded-[8px] px-[12px] py-[10px]">
                  {chart.note}
                </p>
              )}

              {isFootwearChart && (
                <div className="overflow-x-auto rounded-[10px] border border-[#E8D5D0]">
                  <table className="w-full border-collapse text-[13px] min-w-full">
                    <thead>
                      <tr>
                        {['EU', 'UK', 'US'].map((label) => (
                          <th
                            key={label}
                            className={cx(
                              'bg-[#8B3A3A] text-white text-center px-[12px] py-[10px] font-semibold whitespace-nowrap',
                              label === vendorShoeScale && 'bg-[#6E2E2E]',
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
                              'text-center px-[12px] py-[10px] text-[#3D1F1F]',
                              index % 2 === 0 ? 'bg-white' : 'bg-[#FFF9F8]',
                              vendorShoeScale === 'EU' && 'font-semibold',
                            )}
                          >
                            {row.eu}
                          </td>
                          <td
                            className={cx(
                              'text-center px-[12px] py-[10px] text-[#3D1F1F]',
                              index % 2 === 0 ? 'bg-white' : 'bg-[#FFF9F8]',
                              vendorShoeScale === 'UK' && 'font-semibold',
                            )}
                          >
                            {row.uk}
                          </td>
                          <td
                            className={cx(
                              'text-center px-[12px] py-[10px] text-[#3D1F1F]',
                              index % 2 === 0 ? 'bg-white' : 'bg-[#FFF9F8]',
                              vendorShoeScale === 'US' && 'font-semibold',
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
                  <div className="overflow-x-auto rounded-[10px] border border-[#E8D5D0]">
                    <table className="w-full border-collapse text-[13px] min-w-full">
                      <thead>
                        <tr>
                          <th className="bg-[#8B3A3A] text-white text-left px-[12px] py-[10px] font-semibold whitespace-nowrap sticky left-0">
                            {unit === 'cm' ? 'CM' : 'IN'}
                          </th>
                          {chart.sizeLabels.map((size) => (
                            <th
                              key={size}
                              className="bg-[#8B3A3A] text-white text-center px-[12px] py-[10px] font-semibold whitespace-nowrap"
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
                                'text-left px-[12px] py-[10px] font-semibold whitespace-nowrap sticky left-0 text-[#5C2A2A]',
                                index % 2 === 0 ? 'bg-[#F7EDEA]' : 'bg-[#F1E0DC]',
                              )}
                            >
                              {row.label}
                            </th>
                            {row.values.map((value, valueIndex) => (
                              <td
                                key={`${row.key}-${valueIndex}`}
                                className={cx(
                                  'text-center px-[12px] py-[10px] text-[#3D1F1F]',
                                  index % 2 === 0 ? 'bg-white' : 'bg-[#FFF9F8]',
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
                <div className="flex flex-col gap-[10px]">
                  <p className="text-[14px] font-semibold text-[#111]">
                    Accessory fit details
                  </p>
                  <div className="grid gap-[8px] text-[13px] text-[#333]">
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

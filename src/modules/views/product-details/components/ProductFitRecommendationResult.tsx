'use client';

import { ProductFitRecommendationData } from '../types/product-fit-recommendation';
import classNames from 'classnames';
import { GoPersonFill } from 'react-icons/go';
import {
  IoShieldCheckmarkOutline,
  IoSparkles,
  IoWarningOutline,
} from 'react-icons/io5';
import { PiCheckCircle } from 'react-icons/pi';

interface ProductFitRecommendationResultProps {
  recommendation: ProductFitRecommendationData;
  onUpdateMeasurements: () => void;
}

/** Clean float noise in API profileSummary (e.g. height 59.000000001). */
const sanitizeProfileSummary = (summary: string) =>
  summary.replace(/-?\d+\.\d+/g, (match) => {
    const num = Number(match);
    if (!Number.isFinite(num)) return match;
    return String(Number(num.toFixed(2)));
  });

const ProductFitRecommendationResult = ({
  recommendation,
  onUpdateMeasurements,
}: ProductFitRecommendationResultProps) => {
  const isPerfect = recommendation.status === 'perfect';
  const isNoFit = recommendation.status === 'no_fit';
  const profileSummary = sanitizeProfileSummary(
    recommendation.profileSummary || '',
  );

  return (
    <div className="flex flex-col gap-8">
      <p className="text-12 weight-400 color-#000000B2">
        Your Fit Recommendation
      </p>

      <div
        className={classNames(
          'border-solid border-1 radius-12 pb-16 sm:pb-20 flex flex-col gap-12 sm:gap-16',
          isPerfect && 'border-#0B9378 bg-#0B93780D',
          isNoFit && 'border-#C45C26 bg-#C45C260A',
          !isPerfect && !isNoFit && 'border-#FEC107 bg-#FFBF000A',
        )}
      >
        <div className="px-11 sm:px-12 pt-15 sm:pt-16 flex flex-col gap-16.15 sm:gap-20.15">
          <div className="flex a-items-start gap-10">
            <IoSparkles
              className={classNames(
                'w-36 h-36 flex-shrink-0',
                isPerfect && 'color-#0B9378',
                isNoFit && 'color-#C45C26',
                !isPerfect && !isNoFit && 'color-#FEC107',
              )}
            />
            <div className="flex flex-col gap-4.73 min-w-0">
              <div className="flex flex-wrap a-items-center gap-8">
                <p
                  className={classNames(
                    'text-11.34 weight-600',
                    isPerfect && 'color-#0B9378',
                    isNoFit && 'color-#8B3A1A',
                    !isPerfect && !isNoFit && 'color-#775B08',
                  )}
                >
                  {isNoFit ? 'No size match' : 'Size Recommendation'}
                </p>
                <span
                  className={classNames(
                    'text-11.34 weight-600 px-8 py-1 radius-3',
                    isPerfect && 'bg-#0B937826 color-#0B9378',
                    isNoFit && 'bg-#C45C2626 color-#8B3A1A',
                    !isPerfect && !isNoFit && 'bg-#FACE331C color-#FEC107',
                  )}
                >
                  Beta
                </span>
              </div>
              <p className="text-11.34 weight-400 color-#000000B2">
                {isNoFit
                  ? 'Checked against all available sizes'
                  : 'Based on your measurements'}
              </p>
            </div>
          </div>

          <div
            className={classNames(
              'radius-10 sm:px-9 px-7 sm:py-17 py-13 flex flex-row flex-wrap a-items-center gap-10 sm:gap-12 sm:ml-40 lg:ml-0 xxl:ml-40',
              isPerfect && 'bg-#0B93781F',
              isNoFit && 'bg-#C45C2622',
              !isPerfect && !isNoFit && 'bg-#FEC1073B',
            )}
          >
            <div className="flex gap-7 a-items-start flex-grow-1 min-w-0">
              {isPerfect ? (
                <PiCheckCircle className="sm:w-32 sm:h-32 w-18 h-18 flex-shrink-0 color-#0B9378" />
              ) : (
                <IoWarningOutline
                  className={classNames(
                    'sm:w-32 sm:h-32 w-18 h-18 flex-shrink-0',
                    isNoFit && 'color-#C45C26',
                    !isNoFit && 'color-#FEC107',
                  )}
                />
              )}

              <div className="flex flex-col sm:gap-4 min-w-0">
                <p className="text-11.34 weight-600 color-#333333">
                  {recommendation.headline}
                </p>
                <p
                  className={classNames(
                    'text-8 sm:text-10 weight-400',
                    isPerfect ? 'color-#000000AA' : 'color-#666666',
                  )}
                >
                  {recommendation.subheadline}
                </p>
                {!isPerfect &&
                  !isNoFit &&
                  recommendation.recommendedSizeLabel &&
                  recommendation.sizeLabel &&
                  recommendation.recommendedSizeLabel.toLowerCase() !==
                    recommendation.sizeLabel.toLowerCase() && (
                    <p className="text-8 sm:text-10 weight-500 color-#775B08 mt-2">
                      Recommended size:{' '}
                      {recommendation.recommendedSizeLabel.toUpperCase()}
                    </p>
                  )}
              </div>
            </div>

            <p className="flex j-content-end flex-grow-1 min-w-0">
              <span
                className={classNames(
                  'flex-shrink-0 text-6.61 sm:text-11.34 weight-600 px-9.91 sm:px-13 py-3.81 sm:py-5 radius-2.29 sm:radius-3 w-fit',
                  isPerfect && 'bg-#0B937826 color-#0B9378',
                  isNoFit && 'bg-#C45C2633 color-#8B3A1A',
                  !isPerfect && !isNoFit && 'bg-#FEC10747 color-#7F691E',
                )}
              >
                {recommendation.statusBadge}
              </span>
            </p>
          </div>
        </div>

        <div
          className={classNames(
            'border-b border-b-1 w-full',
            isPerfect && 'border-b-#0B9378',
            isNoFit && 'border-b-#C45C26',
            !isPerfect && !isNoFit && 'border-b-#FEC107',
          )}
        />

        <div className="px-11 sm:px-12 flex flex-col gap-12 sm:gap-24">
          <p className="text-8 sm:text-10 weight-400 color-#000000B2">
            {recommendation.message || recommendation.description}
          </p>

          {recommendation.measurements.length > 0 && (
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-28 sm:j-content-center lg:flex-col lg:gap-4 xxl:flex-row xxl:gap-12 xxl:j-content-center">
              {recommendation.measurements.map((measurement) => {
                const visibility = measurement.visibility ?? 'all';

                return (
                  <div
                    key={`${measurement.label}-${visibility}`}
                    className={classNames(
                      'bg-#A3A4A41F radius-10 p-12 sm:p-14 flex flex-col gap-15 a-items-center w-full sm:max-w-120 lg:max-w-100p xxl:max-w-120',
                      visibility === 'mobile' && 'l:hidden',
                      visibility === 'desktop' && 'hidden l:flex',
                    )}
                  >
                    <div className="flex flex-col gap-4 text-center">
                      <p className="text-10.06 sm:text-8 lg:text-10.06 xxl:text-8 weight-400 color-#A5A5A5 uppercase">
                        {measurement.label}
                      </p>
                      <p className="text-16 weight-500 color-#000000B2">
                        {measurement.userValue}
                      </p>
                      <p className="text-10.06 sm:text-8 lg:text-10.06 xxl:text-8 weight-400 color-#A5A5A5">
                        Garment: {measurement.garmentRange}
                      </p>
                    </div>
                    <span
                      className={classNames(
                        'text-7.83 weight-600 px-5.52 py-0.69 radius-2.07 w-fit',
                        isPerfect && 'bg-#0B937826 color-#0B9378',
                        isNoFit && 'bg-#C45C2626 color-#8B3A1A',
                        !isPerfect && !isNoFit && 'bg-#FEC1073D color-#775B08',
                      )}
                    >
                      {measurement.easeLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {!isNoFit && recommendation.spectrum.length > 0 && (
            <div className="flex flex-col gap-7 sm:gap-9 mt-39 sm:mt-4 lg:mt-27 xxl:mt-4 mb-49 sm:mb-18 lg:mb-37 xxl:mb-28">
              <p className="text-10 sm:text-12 weight-400 color-#000000B2">
                Fit spectrum - where you land
              </p>

              <div className="flex gap-6.57 overflow-x-auto no-scrollbar pb-4">
                {recommendation.spectrum.map((segment) => (
                  <div
                    key={segment.id}
                    className="flex flex-col gap-4.43 flex-1 min-w-78.86"
                  >
                    <div
                      className={classNames(
                        'radius-99 h-6.57',
                        segment.active && isPerfect && 'bg-#0B9378',
                        segment.active && !isPerfect && 'bg-#FEC107',
                        !segment.active && 'bg-#EAEFEE',
                      )}
                    />
                    <p className="text-10 text-center weight-600 color-#313030">
                      {segment.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div
            className={classNames(
              'radius-10 sm:px-11 sm:py-16 px-7 py-22 flex flex-col gap-30 sm:gap-24',
              isPerfect && 'bg-#0B93781F',
              isNoFit && 'bg-#C45C2614',
              !isPerfect && !isNoFit && 'bg-#FEC10717',
            )}
          >
            <div className="flex flex-row flex-nowrap j-content-between a-items-center gap-12">
              <div className="flex gap-11.43 sm:gap-19 lg:gap-11.43 xxl:gap-19 a-items-center min-w-0 flex-grow-1">
                <GoPersonFill
                  className={classNames(
                    'w-18 h-18 flex-shrink-0',
                    isPerfect && 'color-#0B9378',
                    isNoFit && 'color-#C45C26',
                    !isPerfect && !isNoFit && 'color-#FACE33',
                  )}
                />

                <div className="flex flex-col sm:gap-2 gap-1.44 min-w-0">
                  <p className="sm:text-14 text-10.64 weight-600 color-#000000B2 white-space-nowrap overflow-hidden text-ellipsis">
                    {recommendation.userName}
                  </p>
                  <p className="sm:text-10 text-7.6 weight-400 color-#5E656F white-space-nowrap overflow-hidden text-ellipsis capitalize">
                    {profileSummary}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onUpdateMeasurements}
                className={classNames(
                  'flex-shrink-0 border-none radius-3 px-8.04 sm:px-13 py-3.71 sm:py-6 text-7.02 sm:text-11.34 weight-600 cursor-pointer w-fit white-space-nowrap g|transition:background-color|_|0.3s g|transition-timing-function:ease',
                  isPerfect && 'bg-#0B9378 color-white hover:bg-darkgreen',
                  isNoFit && 'bg-#C45C26 color-white hover:opacity-90',
                  !isPerfect &&
                    !isNoFit &&
                    'bg-#FACE33 color-#775B08 hover:bg-yellow',
                )}
              >
                Update measurement
              </button>
            </div>

            <div className="flex gap-5 a-items-center j-content-center">
              <IoShieldCheckmarkOutline
                className={classNames(
                  'sm:w-11 sm:h-11 w-16 h-16 flex-shrink-0 mt-1',
                  isPerfect && 'color-#0B9378',
                  isNoFit && 'color-#C45C26',
                  !isPerfect && !isNoFit && 'color-#FEC107',
                )}
              />
              <p className="text-10 weight-400 color-#5E656F">
                These measurement are used to provide you the accurate size
                recommendation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFitRecommendationResult;

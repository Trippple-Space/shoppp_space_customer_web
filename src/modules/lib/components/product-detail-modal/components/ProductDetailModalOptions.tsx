import classNames from 'classnames';
import { cx } from '../../../utility/utility';
import { DisplayProductConfigurations } from '../productConfigurationsHelper';
import { ProductVariant } from '../../../utility/types/product.interface';
import { CartItem } from '../../../utility/types/cart.interface';

const ProductDetailModalOptions = ({
  allPropertiesWithSize,
  colorMap,
  activeFilters,
  isOptionCompatible,
  toggleFilter,
  productId,
  showSizeChartLink,
  onOpenSizeChart,
  selectedVariant,
  missingRequiredOptions,
  initialMissingOptions,
  configurationRecords,
  configurationValues,
  handleConfigChange,
  selectedVariantItemInCart,
  isEditingConfiguration,
  onEditConfiguration,
  hasPendingImageUploads,
}: {
  allPropertiesWithSize: Record<string, string[]>;
  colorMap: Record<string, string>;
  activeFilters: Record<string, string>;
  isOptionCompatible: (prop: string, value: string) => boolean;
  toggleFilter: (key: string, value: string) => void;
  productId?: string;
  showSizeChartLink: boolean;
  onOpenSizeChart: () => void;
  selectedVariant?: ProductVariant;
  missingRequiredOptions: string[];
  initialMissingOptions: string[];
  configurationRecords: any[];
  configurationValues: Record<string, any>;
  handleConfigChange: (key: string, value: any) => void;
  selectedVariantItemInCart?: CartItem;
  isEditingConfiguration: boolean;
  onEditConfiguration: () => void;
  hasPendingImageUploads: boolean;
}) => {
  return (
    <div className="mt-16 flex flex-col">
      {allPropertiesWithSize?.color?.filter(
        (v) => v.trim() !== ''
      )?.length > 0 && (
          <div className="mt-4">
            <p className="text-left text-12 weight-400 color-#000000B2 mb-10">
              Select color:
            </p>

            <div className="flex gap-6 a-items-center overflow-auto no-scrollbar">
              {allPropertiesWithSize?.color.map((color) => {
                const hex = colorMap[color.replaceAll(' ', '')];
                const active = activeFilters.color === color;
                const compatible = isOptionCompatible(
                  'color',
                  color
                );

                return (
                  <div
                    key={color}
                    onClick={() => toggleFilter('color', color)}
                    className={classNames(
                      'w-32 min-w-32 h-32 round border transition',
                      {
                        'border-3 border-#0B9378 border-solid':
                          active,
                        'opacity-40 cursor-not-allowed':
                          !compatible,
                      }
                    )}
                    style={{ background: hex || color }}
                  />
                );
              })}
            </div>
          </div>
        )}

      {Object.entries(allPropertiesWithSize).map(
        ([prop, values]) => {
          if (prop === 'color') return null;
          const cleanValues = values.filter(
            (v) => v.trim() !== ''
          );

          if (cleanValues.length === 0) return null;

          return (
            <div key={prop} className="mt-16">
              <p className="text-left text-12 weight-400 color-#000000B2 mb-10">
                Select {prop}:
              </p>

              <div className="flex gap-6 overflow-auto no-scrollbar">
                {values.map((value) => {
                  const active =
                    activeFilters[prop] === value;
                  const compatible = isOptionCompatible(
                    prop,
                    value
                  );

                  if (value === '') return;

                  return (
                    <button
                      key={value}
                      onClick={() =>
                        toggleFilter(prop, value)
                      }
                      className={cx(
                        'px-12 py-8 radius-6 border transition whitespace-nowrap text-12',
                        active &&
                        'bg-#DEFFF9! color-#0B9378! border-3 border-#0B9378 border-solid',
                        !active && compatible && 'bg-#F3F3F3',
                        !compatible &&
                        'bg-#F3F3F3 opacity-40 cursor-not-allowed'
                      )}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        }
      )}

      {productId && showSizeChartLink && (
        <button
          type="button"
          onClick={onOpenSizeChart}
          className="text-12 weight-500 color-#0B9378 underline underline-offset-2 bg-transparent border-none pointer p-0 mt-16 self-start w-fit"
        >
          View size chart
        </button>
      )}

      {!selectedVariant &&
        (missingRequiredOptions.length > 0 ||
          initialMissingOptions.length > 0) && (
          <div className="flex flex-col gap-6 p-10 radius-6 bg-#FFF7E6 border border-#FFD699 mt-16">
            <p className="text-12 weight-400 color-#8A5A00">
              Please select the following to continue:
            </p>

            <div className="flex flex-wrap gap-6">
              {(missingRequiredOptions.length > 0
                ? missingRequiredOptions
                : initialMissingOptions
              ).map((option) => (
                <span
                  key={option}
                  className="px-8 py-4 radius-99 bg-#FFD699 text-11 weight-500 capitalize"
                >
                  {option}
                </span>
              ))}
            </div>
          </div>
        )}

      {selectedVariant?.status !== 'OUT_OF_STOCK' && (
        <div className="mt-16">
          <DisplayProductConfigurations
            configurationRecords={configurationRecords}
            configurationValues={configurationValues}
            handleConfigChange={handleConfigChange}
            userConfigurations={
              selectedVariantItemInCart?.userConfigurations
            }
            isEditingConfiguration={isEditingConfiguration}
            onEditConfiguration={onEditConfiguration}
          />
        </div>
      )}

      {hasPendingImageUploads && (
        <p className="text-11 weight-500 color-#A66A00 mt-10">
          Tap “Upload” under each attached image to upload it
          before adding to cart.
        </p>
      )}
    </div>
  );
};

export default ProductDetailModalOptions;

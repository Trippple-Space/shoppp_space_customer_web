import classNames from 'classnames';
import { cx } from '../../../utility/utility';
import { DisplayProductConfigurations } from '../productConfigurationsHelper';
import { ProductVariant } from '../../../utility/types/product.interface';
import { CartItem } from '../../../utility/types/cart.interface';
import ColorSwatch from '../../color-swatch/ColorSwatch';

const ProductDetailModalOptions = ({
  allPropertiesWithSize,
  colorMap,
  activeFilters,
  isOptionCompatible,
  toggleFilter,
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
    <div className="mt-[16px] flex flex-col">
      {allPropertiesWithSize?.color?.filter(
        (v) => v.trim() !== ''
      )?.length > 0 && (
          <div className="mt-[4px]">
            <p className="text-left text-[12px] font-normal text-[#000000B2] mb-[10px]">
              Select color:
            </p>

            <div className="flex gap-[6px] items-center overflow-auto no-scrollbar">
              {allPropertiesWithSize?.color.map((color) => {
                const active = activeFilters.color === color;
                const compatible = isOptionCompatible(
                  'color',
                  color
                );

                return (
                  <ColorSwatch
                    key={color}
                    color={color}
                    colorMap={colorMap}
                    onClick={() => toggleFilter('color', color)}
                    className={classNames(
                      'w-[32px] min-w-[32px] h-[32px] rounded-full overflow-hidden border transition',
                      {
                        'border-[3px] border-[#0357EE] border-solid':
                          active,
                        'opacity-40 cursor-not-allowed':
                          !compatible,
                      }
                    )}
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
            <div key={prop} className="mt-[16px]">
              <p className="text-left text-[12px] font-normal text-[#000000B2] mb-[10px]">
                Select {prop}:
              </p>

              <div className="flex gap-[6px] overflow-auto no-scrollbar">
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
                        'px-[12px] py-[8px] rounded-[6px] border transition whitespace-nowrap text-[12px]',
                        active &&
                        '!bg-[#DEFFF9] !text-[#0357EE] border-[3px] border-[#0357EE] border-solid',
                        !active && compatible && 'bg-[#F3F3F3]',
                        !compatible &&
                        'bg-[#F3F3F3] opacity-40 cursor-not-allowed'
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

      {!selectedVariant &&
        (missingRequiredOptions.length > 0 ||
          initialMissingOptions.length > 0) && (
          <div className="flex flex-col gap-[6px] p-[10px] rounded-[6px] bg-[#FFF7E6] border border-[#FFD699] mt-[16px]">
            <p className="text-[12px] font-normal text-[#8A5A00]">
              Please select the following to continue:
            </p>

            <div className="flex flex-wrap gap-[6px]">
              {(missingRequiredOptions.length > 0
                ? missingRequiredOptions
                : initialMissingOptions
              ).map((option) => (
                <span
                  key={option}
                  className="px-[8px] py-[4px] rounded-[99px] bg-[#FFD699] text-[11px] font-medium capitalize"
                >
                  {option}
                </span>
              ))}
            </div>
          </div>
        )}

      {selectedVariant?.status !== 'OUT_OF_STOCK' && (
        <div className="mt-[16px]">
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
        <p className="text-[11px] font-medium text-[#A66A00] mt-[10px]">
          Tap “Upload” under each attached image to upload it
          before adding to cart.
        </p>
      )}
    </div>
  );
};

export default ProductDetailModalOptions;

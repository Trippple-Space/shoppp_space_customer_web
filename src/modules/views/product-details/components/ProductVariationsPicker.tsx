import { DisplayProductConfigurations } from '@/modules/lib/components/product-detail-modal/productConfigurationsHelper';
import { ProductVariant } from '@/modules/lib/utility/types/product.interface';
import { cx } from '@/modules/lib/utility/utility';
import classNames from 'classnames';
import { ReactNode } from 'react';

interface ProductVariationsPickerProps {
  layout: 'mobile' | 'desktop';
  allPropertiesWithSize: Record<string, string[]>;
  colorMap: Record<string, string>;
  activeFilters: Record<string, string>;
  isOptionCompatible: (prop: string, value: string) => boolean;
  toggleFilter: (key: string, value: string) => void;
  configurationRecords: any[];
  configurationValues: Record<string, any>;
  handleConfigChange: (key: string, value: any) => void;
  selectedVariantItemInCart: { userConfigurations?: any } | undefined;
  isEditingConfiguration: boolean;
  onEditConfiguration: () => void;
  selectedVariant: ProductVariant | undefined;
  addToCartSection: ReactNode;
}

const ProductVariationsPicker = ({
  layout,
  allPropertiesWithSize,
  colorMap,
  activeFilters,
  isOptionCompatible,
  toggleFilter,
  configurationRecords,
  configurationValues,
  handleConfigChange,
  selectedVariantItemInCart,
  isEditingConfiguration,
  onEditConfiguration,
  selectedVariant,
  addToCartSection,
}: ProductVariationsPickerProps) => {
  const isMobile = layout === 'mobile';

  const colorSwatchClass = isMobile
    ? 'w-32 h-32 round border border-lightgray transition'
    : 'w-36 min-w-36 h-36 flex round border border-lightgray transition';

  const colorActiveClass = isMobile
    ? 'border-3 border-#0B9378! border-solid'
    : 'border-3 border-#0B9378! border-solid w-34 min-w-34 h-34 flex';

  const optionButtonClass = isMobile
    ? 'px-10 py-7 radius-6 border transition whitespace-nowrap text-12'
    : 'px-15 py-8 radius-6 border transition text-12 whitespace-nowrap weight-400';

  const variationsContent = (
    <>
      {allPropertiesWithSize?.color?.filter((v) => v.trim() !== '')
        ?.length > 0 && (
          <div>
            <p className="text-left text-12 weight-400 color-#000000B2 mb-12">
              Select color:
            </p>
            <div
              className="flex gap-6 a-items-center no-scrollbar"
              style={{ width: '100%', overflow: 'auto' }}
            >
              {allPropertiesWithSize.color?.map((color) => {
                const hex = colorMap[color.replaceAll(' ', '')];
                const active = activeFilters.color === color;
                const compatible = isOptionCompatible('color', color);

                return (
                  <div
                    key={color}
                    onClick={() => toggleFilter('color', color)}
                    className={classNames(colorSwatchClass, {
                      [colorActiveClass]: active,
                      'opacity-40 cursor-not-allowed': !compatible,
                    })}
                    style={{ background: hex || color }}
                  />
                );
              })}
            </div>
          </div>
        )}

      {Object.entries(allPropertiesWithSize).map(([prop, values]) => {
        if (prop === 'color') return null;
        const cleanValues = values.filter((v) => v.trim() !== '');

        if (cleanValues.length === 0) return null;

        return (
          <div key={prop}>
            <p className="text-left text-12 weight-400 color-#000000B2 mb-12">
              Select {prop}:
            </p>
            <div className="flex gap-10 flex-wrap">
              {values.map((value) => {
                const active = activeFilters[prop] === value;
                const compatible = isOptionCompatible(prop, value);

                if (value === '') return;

                return (
                  <button
                    key={value}
                    onClick={() => toggleFilter(prop, value)}
                    className={cx(
                      optionButtonClass,
                      active &&
                      'bg-#DEFFF9! color-#0B9378! border-#0B9378 border-3 border-solid',
                      !active &&
                      compatible &&
                      'bg-white border-grey-300 hover:border-black',
                      !compatible &&
                      'bg-grey-100 text-grey-400 border-grey-200 cursor-not-allowed'
                    )}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {(isMobile || selectedVariant?.status !== 'OUT_OF_STOCK') && (
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
      )}

      {addToCartSection}
    </>
  );

  if (isMobile) {
    return (
      <div className="l:hidden flex flex-col gap-12 border-b  border-#00000014 pb-15">
        <p className="weight-600 border-b border-#00000014 pb-15 pt-15">
          VARIATIONS
        </p>
        {variationsContent}
      </div>
    );
  }

  return (
    <div className="hidden l:block l:w-40p w-full">
      <div
        className="w-full flex flex-col gap-12 bg-white p-24 border radius-12 border-#00000014
            "
        style={{ boxShadow: '-4px -4px 8px 2px #EDFCF766' }}
      >
        <p className="weight-600 border-b border-#00000014 pb-10">
          VARIATIONS
        </p>
        <div className="flex flex-col gap-28">
          {variationsContent}
        </div>
      </div>
    </div>
  );
};

export default ProductVariationsPicker;

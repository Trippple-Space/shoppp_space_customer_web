import { DisplayProductConfigurations } from '@/modules/lib/components/product-detail-modal/productConfigurationsHelper';
import { ProductVariant } from '@/modules/lib/utility/types/product.interface';
import { cx } from '@/modules/lib/utility/utility';
import classNames from 'classnames';
import { ReactNode } from 'react';
import ColorSwatch from '@/modules/lib/components/color-swatch/ColorSwatch';

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
    ? 'w-[32px] h-[32px] rounded-full border border-lightgray transition'
    : 'w-[36px] min-w-[36px] h-[36px] flex rounded-full border border-lightgray transition';

  const colorActiveClass = isMobile
    ? 'border-[3px] !border-[#0357EE] border-solid'
    : 'border-[3px] !border-[#0357EE] border-solid w-[34px] min-w-[34px] h-[34px] flex';

  const optionButtonClass = isMobile
    ? 'px-[10px] py-[7px] rounded-[6px] border transition whitespace-nowrap text-[12px]'
    : 'px-[15px] py-[8px] rounded-[6px] border transition text-[12px] whitespace-nowrap font-normal';

  const variationsContent = (
    <>
      {allPropertiesWithSize?.color?.filter((v) => v.trim() !== '')
        ?.length > 0 && (
          <div>
            <p className="text-left text-[12px] font-normal text-[#000000B2] mb-[12px]">
              Select color:
            </p>
            <div
              className="flex gap-[6px] items-center no-scrollbar"
              style={{ width: '100%', overflow: 'auto' }}
            >
              {allPropertiesWithSize.color?.map((color) => {
                const active = activeFilters.color === color;
                const compatible = isOptionCompatible('color', color);

                return (
                  <ColorSwatch
                    key={color}
                    color={color}
                    colorMap={colorMap}
                    onClick={() => toggleFilter('color', color)}
                    className={classNames(colorSwatchClass, 'overflow-hidden', {
                      [colorActiveClass]: active,
                      'opacity-40 cursor-not-allowed': !compatible,
                    })}
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
            <p className="text-left text-[12px] font-normal text-[#000000B2] mb-[12px]">
              Select {prop}:
            </p>
            <div className="flex gap-[10px] flex-wrap">
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
                      '!bg-[#DEFFF9] !text-[#0357EE] border-[#0357EE] border-[3px] border-solid',
                      !active &&
                      compatible &&
                      'bg-white border-[#E4E1DF] hover:border-black',
                      !compatible &&
                      'bg-[#F7F6F5] text-[#C8C6C3] border-[#F5F3F1] cursor-not-allowed'
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
      <div className="lg:hidden flex flex-col gap-[12px] border-b  border-[#00000014] pb-[15px]">
        <div className="flex items-center justify-between gap-[10px] border-b border-[#00000014] pb-[15px] pt-[15px]">
          <p className="font-semibold">VARIATIONS</p>
        </div>
        {variationsContent}
      </div>
    );
  }

  return (
    <div className="hidden lg:block lg:w-[40%] w-full">
      <div
        className="w-full flex flex-col gap-[12px] bg-white p-[24px] border rounded-[12px] border-[#00000014]
            "
        style={{ boxShadow: '-4px -4px 8px 2px #EDFCF766' }}
      >
        <div className="flex items-center justify-between gap-[10px] border-b border-[#00000014] pb-[10px]">
          <p className="font-semibold">VARIATIONS</p>
        </div>
        <div className="flex flex-col gap-[28px]">
          {variationsContent}
        </div>
      </div>
    </div>
  );
};

export default ProductVariationsPicker;

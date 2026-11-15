import { CatalogueMediaItem } from '@/modules/lib/components/product-tile/ProductCatalogueDropdown';
import { Product } from '@/modules/lib/utility/types/product.interface';

interface ProductCatalogueSectionProps {
  product: Product;
  lightboxImages: string[];
  onOpenLightbox: (index: number) => void;
}

const ProductCatalogueSection = ({
  product,
  lightboxImages,
  onOpenLightbox,
}: ProductCatalogueSectionProps) => {
  return (
    <div>
      {(product?.productCatalogues?.length ?? 0) > 0 && (
        <div className="mt-[30px]">
          <p className="text-[16px] font-semibold mb-[10px]">Catalogue</p>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-[3px]">
            {product?.productCatalogues?.map((item) => (
              <CatalogueMediaItem
                key={item.id}
                item={item}
                onClick={() => {
                  const idx = lightboxImages.findIndex(
                    (u) => u === item.mediaUrl
                  );
                  onOpenLightbox(idx >= 0 ? idx : 0);
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCatalogueSection;

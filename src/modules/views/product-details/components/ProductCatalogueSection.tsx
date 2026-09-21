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
        <div className="mt-30">
          <p className="text-16 weight-600 mb-10">Catalogue</p>

          <div className="grid grid-3-cols-1fr sm:grid-4-cols-1fr md:grid-5-cols-1fr lg:grid-6-cols-1fr xl:grid-7-cols-1fr gap-3">
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

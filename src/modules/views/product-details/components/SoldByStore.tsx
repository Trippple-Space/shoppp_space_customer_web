import Link from 'next/link';
import { Product } from '@/modules/lib/utility/types/product.interface';

interface SoldByStoreProps {
  product: Product;
  storeUrl: string;
  variant: 'desktop-hidden' | 'mobile';
}

const SoldByStore = ({ product, storeUrl, variant }: SoldByStoreProps) => {
  if (variant === 'desktop-hidden') {
    return (
      <div className="l:flex flex-col gap-12 border-b border-#00000014 mt--12 hidden">
        <div className="flex a-items-center py-16 gap-12">
          <div className="bg-black flex a-items-center j-content-center radius-999 color-white py-10 px-14 h-43 w-43">
            {product.store.name[0]}
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-16 weight-500 line-height-24">
              Sold by {product.store.name}
            </p>
            <Link
              href={storeUrl}
              target="_blank"
              className="color-#00000099 text-14 underline line-height-22 w-fit"
            >
              Visit store home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12 border-b border-#00000014 mt--12 l:hidden">
      <div className="flex a-items-center py-16 gap-12">
        <div className="bg-black flex a-items-center j-content-center radius-999 color-white py-10 px-14 h-43 w-43">
          {product.store.name[0]}
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-16 weight-500 line-height-24">
            Sold by {product.store.name}
          </p>
          <Link
            href={storeUrl}
            target="_blank"
            className="color-#00000099 text-14 line-height-22 w-fit underline"
          >
            Visit store home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SoldByStore;

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
      <div className="lg:flex flex-col gap-[12px] border-b border-[#00000014] -mt-[12px] hidden">
        <div className="flex items-center py-[16px] gap-[12px]">
          <div className="bg-black flex items-center justify-center rounded-[999px] text-white py-[10px] px-[14px] h-[43px] w-[43px]">
            {product.store.name[0]}
          </div>
          <div className="flex flex-col gap-[2px]">
            <p className="text-[16px] font-medium leading-[24px]">
              Sold by {product.store.name}
            </p>
            <Link
              href={storeUrl}
              target="_blank"
              className="text-[#00000099] text-[14px] underline leading-[22px] w-fit"
            >
              Visit store home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[12px] border-b border-[#00000014] -mt-[12px] lg:hidden">
      <div className="flex items-center py-[16px] gap-[12px]">
        <div className="bg-black flex items-center justify-center rounded-[999px] text-white py-[10px] px-[14px] h-[43px] w-[43px]">
          {product.store.name[0]}
        </div>
        <div className="flex flex-col gap-[2px]">
          <p className="text-[16px] font-medium leading-[24px]">
            Sold by {product.store.name}
          </p>
          <Link
            href={storeUrl}
            target="_blank"
            className="text-[#00000099] text-[14px] leading-[22px] w-fit underline"
          >
            Visit store home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SoldByStore;

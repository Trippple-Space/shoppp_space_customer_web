import Link from 'next/link';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { PiStorefront } from 'react-icons/pi';
import { RxShare2 } from 'react-icons/rx';
import { Product } from '@/modules/lib/utility/types/product.interface';

interface ProductDetailsHeaderProps {
  product: Product;
  storeUrl: string;
  isSaved: boolean;
  onShare: () => void;
  onSave: () => void;
}

const ProductDetailsHeader = ({
  product,
  storeUrl,
  isSaved,
  onShare,
  onSave,
}: ProductDetailsHeaderProps) => {
  return (
    <div className="flex items-center justify-between gap-[10px]">
      <div className="flex items-center gap-[5px] min-w-0 grow overflow-hidden">
        <PiStorefront className="shrink-0 w-fit text-[#00000066] w-[15px] h-[15px]" />
        <div
          className="grid min-w-0 grow gap-[5px] items-center overflow-hidden"
          style={{ gridTemplateColumns: 'fit-content(58%) minmax(0, 1fr)' }}
        >
          <Link
            href={storeUrl}
            target="_blank"
            className="text-[14px] text-[#00000066] min-w-0 overflow-hidden white-space-nowrap text-ellipsis block"
            title={product?.store?.name}
          >
            {product?.store?.name} /
          </Link>
          <span
            className="min-w-0 overflow-hidden white-space-nowrap text-ellipsis block"
            title={product.name}
          >
            {product.name}
          </span>
        </div>
      </div>

      <div className="flex gap-[16px] items-center shrink-0">
        <p
          className="cursor-pointer flex items-center gap-[8px] text-[14px] font-normal text-[#00000099]"
          onClick={onShare}
        >
          <RxShare2 className="shadow w-[20px] h-[20px]" />
          <span className="border-b hidden lg:block">Share</span>
        </p>
        <p
          className="cursor-pointer flex items-center gap-[8px] text-[15px] font-normal text-[#00000099]"
          onClick={onSave}
        >
          {isSaved ? (
            <AiFillHeart className="w-[20px] h-[20px]" />
          ) : (
            <AiOutlineHeart className="w-[20px] h-[20px]" />
          )}
          <span className="border-b hidden lg:block">Save</span>
        </p>
      </div>
    </div>
  );
};

export default ProductDetailsHeader;

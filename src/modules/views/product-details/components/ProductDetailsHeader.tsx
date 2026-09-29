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
    <div className="flex a-items-center j-content-between gap-10">
      <div className="flex a-items-center gap-5 min-w-0 flex-grow-1 overflow-hidden">
        <PiStorefront className="flex-shrink-0 w-fit color-#00000066 w-15 h-15" />
        <div
          className="grid min-w-0 flex-grow-1 gap-5 a-items-center overflow-hidden"
          style={{ gridTemplateColumns: 'fit-content(58%) minmax(0, 1fr)' }}
        >
          <Link
            href={storeUrl}
            target="_blank"
            className="text-14 color-#00000066 min-w-0 overflow-hidden white-space-nowrap text-ellipsis block"
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

      <div className="flex gap-16 a-items-center flex-shrink-0">
        <p
          className="cursor-pointer flex a-items-center gap-8 text-14 weight-400 color-#00000099"
          onClick={onShare}
        >
          <RxShare2 className="shadow w-20 h-20" />
          <span className="border-b hidden l:block">Share</span>
        </p>
        <p
          className="cursor-pointer flex a-items-center gap-8 text-15 weight-400 color-#00000099"
          onClick={onSave}
        >
          {isSaved ? (
            <AiFillHeart className="w-20 h-20" />
          ) : (
            <AiOutlineHeart className="w-20 h-20" />
          )}
          <span className="border-b hidden l:block">Save</span>
        </p>
      </div>
    </div>
  );
};

export default ProductDetailsHeader;

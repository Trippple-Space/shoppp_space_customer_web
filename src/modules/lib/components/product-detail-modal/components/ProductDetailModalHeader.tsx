import Link from 'next/link';
import { IoMdClose } from 'react-icons/io';
import { MdArrowForwardIos } from 'react-icons/md';
import { Product } from '../../../utility/types/product.interface';

const ProductDetailModalHeader = ({
  product,
  onClose,
}: {
  product?: Product;
  onClose: () => void;
}) => {
  return (
    <div className="flex a-items-center space-between gap-12 px-16 py-12 border-b border-#00000014 flex-shrink-0 bg-white">
      <Link
        href={`/products/${product?.slug}`}
        className="cursor-pointer flex a-items-center gap-4 text-12 weight-500 color-#0B9378 min-w-0"
        onClick={onClose}
      >
        <span>All details</span>
        <MdArrowForwardIos className="w-10 h-10 mt-1 flex-shrink-0" />
      </Link>
      <button
        type="button"
        className="bg-transparent border-none pointer flex a-items-center p-0 flex-shrink-0"
        onClick={onClose}
        aria-label="Close"
      >
        <IoMdClose className="sm:w-25 w-20 sm:h-25 h-20" />
      </button>
    </div>
  );
};

export default ProductDetailModalHeader;

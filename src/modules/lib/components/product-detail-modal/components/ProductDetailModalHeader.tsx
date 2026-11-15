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
    <div className="flex items-center justify-between gap-[12px] px-[16px] py-[12px] border-b border-[#00000014] shrink-0 bg-white">
      <Link
        href={`/products/${product?.slug}`}
        className="cursor-pointer flex items-center gap-[4px] text-[12px] font-medium text-[#0357EE] min-w-0"
        onClick={onClose}
      >
        <span>All details</span>
        <MdArrowForwardIos className="w-[10px] h-[10px] mt-[1px] shrink-0" />
      </Link>
      <button
        type="button"
        className="bg-transparent border-none cursor-pointer flex items-center p-0 shrink-0"
        onClick={onClose}
        aria-label="Close"
      >
        <IoMdClose className="sm:w-[25px] w-[20px] sm:h-[25px] h-[20px]" />
      </button>
    </div>
  );
};

export default ProductDetailModalHeader;

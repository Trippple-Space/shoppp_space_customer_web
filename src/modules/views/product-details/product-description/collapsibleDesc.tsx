import { Product } from "@/modules/lib/utility/types/product.interface";
import React, { FC, useEffect, useRef, useState } from "react";

interface ICollapsibleDesc {
  product: Product;
}

const CollapsibleDesc: FC<ICollapsibleDesc> = ({ product }) => {
  const [showButton, setShowButton] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const descRef = useRef<HTMLParagraphElement>(null);

  const isMoreThan3Lines = () => {
    const description = descRef.current;
    if (description) {
      const lineHeight = parseFloat(
        window.getComputedStyle(description).lineHeight
      );
      const height = description.clientHeight;
      const lines = Math.round(height / lineHeight);

      if (description.scrollHeight > description.clientHeight) {
        setShowButton(true);
      } else {
        if (lines > 3) {
          setShowButton(true);
        } else {
          setShowButton(false);
        }
      }
    }
  };

  useEffect(() => {
    isMoreThan3Lines();
    window.addEventListener("resize", isMoreThan3Lines);

    return () => window.removeEventListener("resize", isMoreThan3Lines);
  }, [product?.longDescription]);

  return (
    <div className="lg:text-[14px] text-[12px] text-[#A8A6A6] mt-[15px]">
      <p
        ref={descRef}
        className={`overflow-hidden white-space-pre-line ${
          isExpanded
            ? "[max-height:1000px]"
            : "lg:[max-height:67px] [max-height:58px]"
        } [transition-property:max-height] duration-200 [transition-timing-function:ease]`}
      >
        {product?.longDescription}
      </p>

      {showButton && (
        <button
          className="bg-transparent border-none outline-none flex text-[14px] font-medium mt-[10px] cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className="underline pr-[5px]">
            {isExpanded ? "Show less" : "Show more"}
          </span>
        </button>
      )}
    </div>
  );
};

export default CollapsibleDesc;

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
    <div className="l:text-14 text-12 text-light-grey mt-15">
      <p
        ref={descRef}
        className={`overflow-hidden ${
          isExpanded
            ? "g|max-height:1000px"
            : "l:g|max-height:67px g|max-height:58px"
        } g|transition-property:max-height g|transition-duration:0.2s g|transition-timing-function:ease`}
      >
        {product?.longDescription}
      </p>

      {showButton && (
        <button
          className="bg-none border-none outline-none flex text-14 weight-500 mt-10 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className="underline pr-5">
            {isExpanded ? "Show less" : "Show more"}
          </span>
        </button>
      )}
    </div>
  );
};

export default CollapsibleDesc;

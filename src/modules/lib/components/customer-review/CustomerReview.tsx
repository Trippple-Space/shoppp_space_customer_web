'use client'

import React, { FC, useState } from "react";
import Image from "../image/Image";
import {AiFillStar, AiOutlinePlus, AiFillHeart} from 'react-icons/ai'
import classNames from "classnames";

interface IReview {
  product: {
    images: string[],
  }
}
const ReviewTile: FC<IReview> = ({product}) => {
  const [selectedImage, setSelectedImage] = useState(product.images[2])
  const [isFavourite, setIsFavorite] = useState(false)
  return (
    <div className="mt-[20px]">
      <div
        id="image"
        className="relative aspect-square rounded-[8px] overflow-hidden lg:rounded-[15px] w-full h-[283px]"
      >
        <Image
          className="absolute w-full h-full self-center object-cover cursor-pointer"
          src={selectedImage}
          alt="product-image"
        />
        <div
          id="review"
          className="absolute bottom-0 w-full"
          style={{
            background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8))',
            paddingBottom: '1rem', 
            paddingTop: '9rem', 
          }}
        >
          <div className="flex gap-[8px] text-[#FACE33] ml-[10px] lg:ml-[15px]">
            {
              [0,1,2,3,4].map(() => (
                <AiFillStar 
                  className="w-[20px]"
                />
              ))
            }
          </div>
          <div className="text-white mt-[8px] lg:mt-[8px] ml-[10px] mb-[10px] lg:ml-[15px] lg:mb-[15px]">
            <h3 className="text-[14px] lg:text-[18px] font-normal">Abdulrasaq Ibrahim</h3>
            <p className="text-[10px] lg:text-[12px] font-normal">The quality of the product is outstanding....</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// 

export default ReviewTile;

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
    <div className="mt-20">
      <div
        id="image"
        className="relative ratio-1 radius-8 g|overflow:hidden l:radius-15 w-full h-283"
      >
        <Image
          className="absolute w-full h-full a-self-center g|object-fit:cover pointer"
          src={selectedImage}
          alt="product-image"
        />
        <div
          id="review"
          className="absolute b-0 w-full"
          style={{
            background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8))',
            paddingBottom: '1rem', 
            paddingTop: '9rem', 
          }}
        >
          <div className="flex gap-8 text-yellow ml-10 l:ml-15">
            {
              [0,1,2,3,4].map(() => (
                <AiFillStar 
                  className="w-20"
                />
              ))
            }
          </div>
          <div className="text-white mt-8 l:mt-8 ml-10 mb-10 l:ml-15 l:mb-15">
            <h3 className="text-14 l:text-18 weight-400">Abdulrasaq Ibrahim</h3>
            <p className="text-10 l:text-12 weight-400">The quality of the product is outstanding....</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// 

export default ReviewTile;

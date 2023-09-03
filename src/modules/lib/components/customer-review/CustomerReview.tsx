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
  const [selectedImage, setSelectedImage] = useState(product.images[0])
  const [isFavourite, setIsFavorite] = useState(false)
  return (
    <div className="mt-20">
      <div
        id="image"
        className="relative ratio-1 radius-10 g|overflow:hidden l:radius-15"
      >
        <Image
          className="absolute w-full h-full a-self-center g|object-fit:cover pointer"
          src={selectedImage}
          alt="product-image"
        />
        <div
          id="review"
          className="absolute b-0 ml-10 mb-10 l:ml-15 l:mb-15"
        >
          <div className="flex text-yellow">
            <AiFillStar color="#FACE33" className="w-15" />
            <AiFillStar color="#FACE33" className="w-15" />
            <AiFillStar color="#FACE33" className="w-15" />
            <AiFillStar color="#FACE33" className="w-15" />
            <AiFillStar color="#FACE33" className="w-15" />
          </div>
          <div className="text-white">
            <h3 className="text-14 l:text-18 weight-400">Abdulrasaq Ibrahim</h3>
            <p className="text-10 l:text-12 weight-400">The quality of the product is outstanding....</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewTile;

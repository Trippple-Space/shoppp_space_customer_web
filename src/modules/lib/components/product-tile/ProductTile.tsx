'use client'

import React, { FC, useState } from "react";
import Image from "../image/Image";
import {AiFillStar, AiOutlinePlus, AiFillHeart} from 'react-icons/ai'
import classNames from "classnames";
import './ProductTile.module.scss'

interface IProductTile {
  product: {
    images: string[],
  }
}
const ProductTile: FC<IProductTile> = ({product}) => {
  const [selectedImage, setSelectedImage] = useState(product.images[0])
  const [isFavourite, setIsFavorite] = useState(false)
  return (
    <div className="mt-20 l:mt-30">
      <div
        id="image"
        className="relative ratio-1 radius-10 g|overflow:hidden l:radius-15 tile"
      >
        <Image
          className="absolute w-full h-full a-self-center g|object-fit:cover pointer"
          src={selectedImage}
          alt="product-image"
        />
        <div
          id="add to cart button"
          className="absolute b-0 w-100p tile-add-to-cart"
        >
          <button className="bg-warning-600 text-natural-900 border-hidden px-10 py-10 radius-5 l:px-22 l:py-12 l:radius-10 pointer tile-add-to-cart-btn">
            <span className="hidden l:block weight-600">Add to cart</span>
            <div className="l:hidden">
              <AiOutlinePlus size={16} />
            </div>
          </button>
        </div>
        <div
          id="favorite icon"
          className="absolute t-0 r-0 mr-10 mt-10 l:mr-15 l:mt-15 text-24 l:text-34"
          onClick={() => setIsFavorite((fav) => !fav)}
        >
          <AiFillHeart color={ isFavourite ? "#ffffffee": "#000000aa"} className="shadow" />
        </div>
      </div>
      <div
        id="product varients"
        className="mt-15 flex items-center j-content-space-between gap-6 l:gap-13 "
      >
        {
          product.images.map((image, i) => (
            <Image
              className={classNames("w-30 h-30 l:w-60 l:h-60 pointer radius-5 l:radius-8 a-self-center g|object-fit:cover", {
                'border border-green border-2': selectedImage == image
              })}
              src={image}
              onClick={() => setSelectedImage(image)}
              alt="product-image"
            />
          ))
        }

      </div>
      <div
        id="product details"
        className="mt-15 g|overflow:hidden g|white-space:nowrap g|text-overflow:ellipsis"
      >
        <h3 className="text-16 l:text-24 w-160 l:w-100p g|overflow:hidden g|white-space:nowrap g|text-overflow:ellipsis  weight-600 l:weight-500">
          24 Karat Gold Plated Ring
        </h3>
        <div className="l:flex a-items-center gap-10 l:gap-18 mt-5 text-dimgrey">
          <p className="text-14 text-natural-800 weight-400">Rotimi’s store</p>
          <div className="flex gap-3 items-center">
            {
              [0,1,2,3].map(() => (
                <AiFillStar 
                  className="w-12 text-orange-500"
                />
              ))
            }
            <span className="text-natural-700 text-12 weight-500">4.5</span>
          </div>
        </div>
        <div className="mt-6 text-16 l:text-24 weight-400">$128.925 <span className="weight-500 text-8 l:text-8">PER YARD</span></div>
      </div>
    </div>
  );
};

export default ProductTile;

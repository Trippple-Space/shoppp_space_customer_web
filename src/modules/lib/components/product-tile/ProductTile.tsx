'use client'

import React, { FC, useState } from "react";
import Image from "../image/Image";
import { AiFillStar, AiOutlinePlus, AiFillHeart } from 'react-icons/ai'
import classNames from "classnames";
import { Product } from "../../utility/types/product.interface";
import { formatNumberAsPrice } from "../../utility/utility";
import { useCart } from "../../utility/hooks/use-cart";

interface IProductTile {
  product: Product
}
const ProductTile: FC<IProductTile> = ({ product }) => {
  const [selectedImage, setSelectedImage] = useState(product?.variants?.[0]?.media?.[0]?.url)
  const [selectedVariant, setSelectedVariant] = useState(product?.variants?.[0])
  const [isFavourite, setIsFavorite] = useState(false)
  const { addToCart } = useCart()


  return (
    <div className="mt-30 l:mt-20">
      <div
        id="image"
        className="relative ratio-1 radius-10 g|overflow:hidden l:radius-15"
      >
        <Image
          className="absolute w-full h-full a-self-center g|object-fit:cover pointer"
          src={selectedImage}
          alt="product-image"
        />
        <div className="skelly-rectangle w-full h-full bg-#dee1ec text-white flex" data-width="100%" data-radius="100%">
          <span className="a-self-center w-fit mx-auto"> Error loading image</span>
        </div>
        <div
          id="add to cart button"
          className="absolute b-0 r-0 mr-10 mb-10 l:mr-15 l:mb-15"
        >
          <button onClick={() => addToCart(selectedVariant.id, selectedVariant.minPurchaseQuantity || 1)} className="bg-yellow pointer font-roboto text-grey-900 border-hidden px-10 py-10 radius-5 l:px-22 l:py-12 l:radius-10  ">
            <span className="hidden l:block weight-500">Add to cart</span>
            <div className="l:hidden">
              <AiOutlinePlus size={24} />
            </div>
          </button>
        </div>
        <div
          id="favorite icon"
          className="absolute t-0 r-0 mr-10 mt-10 l:mr-15 l:mt-15 text-24 l:text-34"
          onClick={() => setIsFavorite((fav) => !fav)}
        >
          <AiFillHeart color={isFavourite ? "#ffffffee" : "#000000aa"} className="shadow" />
        </div>
      </div>
      <div
        id="product varients"
        className="mt-15 flex a-items-center gap-13 "
      >
        {
          product.variants.map(variant => (
            variant?.media?.map((mediaItem, i) => (
              <Image
                className={classNames("w-32 h-32 pointer radius-5 l:radius-8 a-self-center g|object-fit:cover", {
                  'border border-2': selectedImage == mediaItem?.url,
                  [`border-${mediaItem.description?.toLocaleLowerCase()}`]: selectedImage == mediaItem?.url
                })}
                src={mediaItem?.url}
                onClick={() => { setSelectedVariant(variant); setSelectedImage(mediaItem?.url) }}
                alt="product-image"
              />
              // <div className="skelly-rectangle" data-width="180px" data-radius="100px"></div>
            ))
          ))
        }
      </div>
      <div
        id="product details"
        className="mt-15 overflow-hidden white-space-nowrap text-overflow-ellipsis"
      >
        <h3 className="text-16 l:text-15 weight-500">
          {product.name}
        </h3>
        <div className="flex a-items-center gap-10 l:gap-18 mt-5 text-dimgrey">
          <p>{product?.store?.name}</p>
          <div className="flex gap-3 items-center">
            <AiFillStar
              // color="#0C7661" 
              className="w-12"
            />
            <span>4.5</span>
          </div>
        </div>
        <div className="mt-6 text-18 l:text-15 weight-700">{formatNumberAsPrice(selectedVariant?.price)} <span className="weight-300">per {selectedVariant?.stockUnit}</span></div>
      </div>
    </div>
  );
};

export default ProductTile;

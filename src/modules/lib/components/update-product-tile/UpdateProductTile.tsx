'use client'

import React, { FC, useState } from "react";
import Image from "../image/Image";
import {AiFillStar, AiOutlinePlus, AiFillHeart, AiOutlineEdit, AiOutlineDelete} from 'react-icons/ai'
import classNames from "classnames";
import { PiNotePencil } from "react-icons/pi";
import './UpdateProductTile.module.scss'
import { TbTrashX } from "react-icons/tb";

interface IProductTile {
  product: {
    images: string[],
  }
}

const UpdateProductTile: FC<IProductTile> = ({product}) => {
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [isFavourite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="mt-[30px] lg:mt-[20px]">
      <div
        id="image"
        className="relative aspect-square rounded-[10px] overflow-hidden lg:rounded-[15px]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Image
          className="absolute w-full h-full self-center object-cover cursor-pointer"
          src={selectedImage}
          alt="product-image"
        />
        {isHovered && (
          <div className="relative">
            <div className="w-full h-[340px] self-center bg-black opacity-40"></div>
            <div className="flex gap-[10px] take-to-center">
              <div className="text-center bg-white p-[20px] rounded-full">
                <PiNotePencil className="text-[#1F1B17] text-[30px] mr-[4px] cursor-pointer " />
              </div>
              <div className="text-center bg-white p-[20px] left-[90px] rounded-full">
              <TbTrashX className="text-[#DE3838] text-[30px] mr-[4px] cursor-pointer" />
              </div>
            </div>
          </div>
        )}
        <div
          id="add to cart button"
          className="absolute bottom-0 right-0 mr-[10px] mb-[10px] lg:mr-[15px] lg:mb-[15px]"
        >
          <button className="bg-brand cursor-pointer font-roboto text-white border-hidden px-[10px] py-[10px] rounded-[5px] lg:px-[22px] lg:py-[12px] lg:rounded-[10px] outline outline-grey ">
            <span className="hidden lg:block font-medium">Add to cart</span>
            <div className="lg:hidden">
              <AiOutlinePlus size={24} />
            </div>
          </button>
        </div>
        <div
          id="favorite icon"
          className="absolute top-0 right-0 mr-[10px] mt-[10px] lg:mr-[15px] lg:mt-[15px] text-[24px] lg:text-[34px]"
          onClick={() => setIsFavorite((fav) => !fav)}
        >
          <AiFillHeart color={isFavourite ? "#ffffffee" : "#000000aa"} className="shadow" />
        </div>
      </div>
      <div
        id="product varients"
        className="mt-[15px] flex items-center gap-[13px] "
      >
        {product.images.map((image, i) => (
          <Image
            className={classNames("w-[32px] h-[32px] cursor-pointer rounded-[5px] lg:rounded-[8px] self-center object-cover", {
              'border border-brand border-[2px]': selectedImage == image
            })}
            src={image}
            onClick={() => setSelectedImage(image)}
            alt="product-image"
          />
        ))}
      </div>
      <div
        id="product details"
        className="mt-[15px] overflow-hidden white-space-nowrap text-overflow-ellipsis"
      >
        <h3 className="text-[16px] lg:text-[15px] font-medium">
          24 Karat Gold Plated Ring
        </h3>
        <div className="flex items-center gap-[10px] lg:gap-[18px] mt-[5px] text-[#333333]">
          <p>Rotimi’s store</p>
          <div className="flex gap-[3px] items-center">
            <AiFillStar className="w-[12px]" />
            <span>4.5</span>
          </div>
        </div>
        <div className="mt-[6px] text-[18px] lg:text-[15px] font-bold">₦54,000 <span className="font-light">per yard</span></div>
      </div>
    </div>
  );
};

export default UpdateProductTile;

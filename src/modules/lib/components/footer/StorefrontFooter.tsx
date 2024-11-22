import Link from "next/link";
import React from "react";
import Input from "../input/Input";
import { TbMail, TbPhone } from "react-icons/tb";
import { HiOutlineLocationMarker } from "react-icons/hi";

export default function StorefrontFooter() {
  return (
    <footer className="bg-black py-20 sm:px-80 px-24 text-white font-inter flex flex-col sm:gap-35 gap-28">
      <div className="sm:py-40 py-24 gap-40 flex sm:flex-row sm:flex-nowrap flex-reverse space-between a-items-center">
        <div className="flex flex-col gap-20">
          <h6 className="weight-600 text-20">Contact us</h6>
          <p className="flex flex-col gap-14">
            <Link href={"tel:+801234567"} className="flex flex-row gap-8 w-fit">
              <TbPhone className="w-24 h-24" />
              <span className="text-16">0801234567</span>
            </Link>
            <Link href={""} className="flex flex-row gap-8 w-fit">
              <HiOutlineLocationMarker className="w-24 min-w-24 h-24" />
              <span className="text-16">
                Great challenge road, iyanaschool, Lagos, Ojo. Lagos Nigeria.
                102101
              </span>
            </Link>
          </p>
        </div>
        <div className="flex flex-col gap-12 l:w-461 sm:w-416 sm:min-w-416 w-full">
          <p className="weight-600 text-16">Subscribe for latest updates</p>
          <div className="flex w-full gap-8">
            <div className="bg-white flex a-items-center gap-12 px-12 radius-6 border border-#00000026 sm:flex-grow-1 w-full">
              <TbMail className="w-24 min-w-24 h-24 color-#00000099" />
              <input
                type="email"
                name="subscribe"
                id="subscribe"
                placeholder="Enter your email"
                className="py-12 px-0 border-none outline-none @lo:placeholder:sm:text-16 @lo:placeholder:text-14 w-full"
              />
            </div>
            <button
              type="submit"
              className="py-12 px-16 bg-#FACE33 radius-6 weight-600 text-16 border border-none text-#000000E0"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
      <hr className="bg-#FFFFFF4D" />
      <div>
        <p className="text-16 text-center">
          Powered by asoebi.africa |{" "}
          <Link href={"/"} className="color-#1677FF underline">
            Click here
          </Link>{" "}
          to create your own customized store now.
        </p>
      </div>
    </footer>
  );
}

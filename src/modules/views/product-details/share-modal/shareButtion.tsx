"use client";

import React, { useRef, useEffect, useState } from "react";
import { toast, Toaster } from "sonner";

interface ShareProps {
  mediaName?: string;
  mediaLogo?: any;
}

const ShareButton: React.FC<ShareProps> = ({ mediaName, mediaLogo }) => {
  const getShareUrl = () => {
    const shareUrl = encodeURIComponent(window.location.href);

    const urls = {
      Twitter: `https://twitter.com/intent/tweet?url=${shareUrl}`,
      Facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      Linkedin: `http://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=Check%20this%20product%20out%20&summary=shoppp%20space&source=staging.shoppp.space`,
      Email: `mailto:?subject=Check this out Product&body=${shareUrl}`,
    };

    switch (mediaName) {
      case "Copy link":
        navigator.clipboard
          .writeText(window.location.href)
          .then(() =>
            toast.success("Link copied to clipboard", { duration: 2000 })
          )
          .catch((err) => {
            toast.error("Failed to copy link", { duration: 2000 });
          });
        break;

      case "Twitter":
      case "Facebook":
      case "Linkedin":
      case "Email":
        window.open(urls[mediaName], "_blank");
        break;

      default:
        //console.warn("Unsupported sharing option:", mediaName);
    }
  };

  return (
    <button
      type="button"
      className="border border-[#eeeeee] rounded-[8px] outline-none bg-transparent sm:py-[25px] py-[12px] sm:px-[15px] px-[8px] flex flex-row items-center sm:gap-[15px] gap-[8px] sm:text-[18px] text-medium cursor-pointer hover:shadow-0-1-3-0-rgba(0,0,0,0.1) transition-all [transition-duration:0.4s] [transition-timing-function:ease]"
      onClick={getShareUrl}
    >
      <span className="sm:text-[24px] text-[20px]">{mediaLogo}</span>
      <span className="capitalize">{mediaName}</span>
    </button>
  );
};

export default ShareButton;

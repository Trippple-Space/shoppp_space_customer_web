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
      Linkedin: `http://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=Check%20this%20product%20out%20&summary=asoebi%20africa&source=staging.asoebi.africa`,
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
        console.warn("Unsupported sharing option:", mediaName);
    }
  };

  return (
    <button
      type="button"
      className="border border-#eeeeee radius-8 outline-none bg-transparent s:py-25 py-12 s:px-15 px-8 flex s:gap-30 gap-12 s:text-18 text-medium cursor-pointer hover:shadow-0-1-3-0-rgba(0,0,0,0.1) g|transition-property:all g|transition-duration:0.4s g|transition-timing-function:ease"
      onClick={getShareUrl}
    >
      <span className="">{mediaLogo}</span>
      <span className="capitalize">{mediaName}</span>
    </button>
  );
};

export default ShareButton;

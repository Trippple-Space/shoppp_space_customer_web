"use client";

import React, { useRef, useEffect, useState } from "react";

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
      Linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
      Email: `mailto:?subject=Check this out Product&body=${shareUrl}`
    };
  
    switch (mediaName) {
      case "Copy link":
        navigator.clipboard.writeText(window.location.href)
          .then(() => console.log("Link copied to clipboard"))
          .catch((err) => console.error("Failed to copy:", err));
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
      className="border border-2 border-#eeeeee radius-8 outline-none bg-transparent py-25 px-15 flex gap-30 text-18 cursor-pointer"
      onClick={getShareUrl}
    >
      <span className="">{mediaLogo}</span>
      <span className="capitalize">{mediaName}</span>
    </button>
  );
};

export default ShareButton;

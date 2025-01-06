import React, { useRef } from "react";

interface VideoSrcProps {
  src: string;
  poster?: string;
  className?: string;
  onClick?: () => void;
}

const VideoSrc: React.FC<VideoSrcProps> = ({
  src,
  poster,
  className,
  onClick,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0; // Reset the video to the beginning
    }
  };

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      muted
      onClick={onClick}
    />
  );
};

export default VideoSrc;

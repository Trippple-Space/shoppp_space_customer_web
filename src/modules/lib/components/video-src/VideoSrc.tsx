'use client';

import classNames from 'classnames';
import React, { useRef, useState } from 'react';

const getVideoLoadingProps = (priority: boolean) =>
  ({ loading: (priority ? 'eager' : 'lazy') as 'lazy' | 'eager' }) as React.VideoHTMLAttributes<HTMLVideoElement>;

interface VideoSrcProps {
  src: string;
  poster?: string;
  className?: string;
  onClick?: () => void;
  hasLoader?: boolean;
  pulseClassName?: string;
  priority?: boolean;
  style?: React.CSSProperties;
  autoPlay?: boolean;
  loop?: boolean;
}

const VideoSrc: React.FC<VideoSrcProps> = ({
  src,
  poster,
  className,
  onClick,
  hasLoader = true,
  pulseClassName,
  priority = false,
  style,
  autoPlay = false,
  loop = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);
  const shouldPreload = priority || autoPlay;

  React.useEffect(() => {
    if (!autoPlay) return;

    const el = videoRef.current;
    if (!el) return;

    el.play().catch(() => {});
  }, [autoPlay, src]);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    if (autoPlay) return;

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0; 
    }
  };

  return (
    <>
      {hasLoader ? (
        <div className={classNames('absolute t-0 w-full h-full')}>
          {!loaded && (
            <div
              className={classNames(
                'absolute g|inset:0px z-1 pulsing-multi-color-bg',
                pulseClassName
              )}
              aria-hidden
            />
          )}
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            playsInline
            loop={loop}
            {...getVideoLoadingProps(shouldPreload)}
            className={classNames(
              'absolute inset-0 w-full h-full transition-opacity duration-500',
              loaded ? 'opacity-100' : 'opacity-0',
              className
            )}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onLoadedData={() => setLoaded(true)}
            preload={shouldPreload ? 'auto' : 'metadata'}
            muted
            autoPlay={autoPlay}
            onClick={onClick}
            style={style}
          />
        </div>
      ) : (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          playsInline
          loop={loop}
          {...getVideoLoadingProps(shouldPreload)}
          className={className}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          preload={shouldPreload ? 'auto' : 'metadata'}
          muted
          autoPlay={autoPlay}
          onClick={onClick}
          style={style}
        />
      )}
    </>
  );
};

export default VideoSrc;

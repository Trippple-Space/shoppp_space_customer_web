'use client';

import classNames from 'classnames';
import NextImage from 'next/image';
import React, { useState } from 'react';
import { ImageSrcFolder, getImageDir } from '../../utility/utility';
import env from '@env';

export interface IImageProps {
  src: string;
  alt: string;
  className?: string;
  type?: 'image' | 'logo' | 'icon';
  onClick?: () => void;
  width?: number;
  height?: number;
  fill?: boolean;
  hasLoader?: boolean;
  pulseClassName?: string;
  priority?: boolean;
  fetchPriority?: 'high' | 'low' | 'auto';
}

const extractSize = (
  className: string | undefined,
  prefix: 'w' | 'h'
): number | undefined => {
  if (!className) return undefined;
  const match = className.match(new RegExp(`${prefix}-(\\d+)`));
  return match ? Number(match[1]) : undefined;
};

const Image = React.forwardRef<HTMLImageElement, IImageProps>(
  (
    {
      className,
      src,
      alt,
      type = 'image',
      onClick,
      width,
      height,
      fill,
      hasLoader,
      pulseClassName,
      priority,
      fetchPriority,
    },
    ref
  ) => {
    const [loaded, setLoaded] = useState(false);

    const autoWidth = width ?? extractSize(className, 'w') ?? 0;
    const autoHeight = height ?? extractSize(className, 'h') ?? 0;
    const imageSrc = getImageDir((type + 's') as ImageSrcFolder, src);
    const isProd = env.ENV === 'production';

    if (!src) return null;

    return (
      <>
        {!loaded && hasLoader && (
          <div
            className={`absolute g|inset:0px z-1 pulsing-multi-color-bg ${pulseClassName}`}
          />
        )}

        {isProd ? (
          <NextImage
            ref={ref}
            className={classNames(
              'transition-opacity duration-500',
              hasLoader
                ? loaded
                  ? 'opacity-100'
                  : 'opacity-0'
                : 'opacity-100',
              className
            )}
            src={imageSrc}
            alt={alt}
            onClick={onClick}
            onLoad={() => setLoaded(true)}
            loading={priority || fetchPriority ? 'eager' : 'lazy'}
            width={autoWidth}
            height={autoHeight}
            fill={fill}
            priority={priority}
            fetchPriority={fetchPriority}
          />
        ) : (
          <img
            ref={ref}
            className={classNames(
              'transition-opacity duration-500',
              hasLoader
                ? loaded
                  ? 'opacity-100'
                  : 'opacity-0'
                : 'opacity-100',
              className
            )}
            src={imageSrc}
            alt={alt}
            onClick={onClick}
            loading="lazy"
            width={autoWidth}
            height={autoHeight}
            onLoad={() => setLoaded(true)}
          />
        )}
      </>
    );
  }
);

Image.displayName = 'Image';
export default Image;

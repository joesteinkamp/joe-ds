'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const imageVariants = cva('', {
  variants: {
    rounded: {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-[var(--component-image-border-radius,0.375rem)]',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      full: 'rounded-full',
    },
    fit: {
      cover: 'object-cover',
      contain: 'object-contain',
      fill: 'object-fill',
      none: 'object-none',
      'scale-down': 'object-scale-down',
    },
  },
  defaultVariants: {
    rounded: 'md',
    fit: 'cover',
  },
});

export interface ImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'onLoad' | 'onError'>,
    VariantProps<typeof imageVariants> {
  /** Aspect ratio (e.g., "16/9", "1/1", "4/3") */
  aspectRatio?: string;
  /** Custom fallback content shown on error */
  fallback?: React.ReactNode;
  /** Callback when image loads */
  onLoad?: () => void;
  /** Callback on load error */
  onError?: () => void;
}

/**
 * Image component — enhanced img with loading states and error fallback
 *
 * Shows a skeleton pulse while loading and a fallback on error.
 *
 * @example
 * ```tsx
 * <Image src="/photo.jpg" alt="Photo" aspectRatio="16/9" />
 * <Image src="/avatar.jpg" alt="User" rounded="full" className="h-16 w-16" />
 * <Image
 *   src="/missing.jpg"
 *   alt="Missing"
 *   fallback={<span>No image</span>}
 * />
 * ```
 */
const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      className,
      rounded,
      fit,
      aspectRatio,
      fallback,
      alt,
      src,
      onLoad: onLoadProp,
      onError: onErrorProp,
      ...props
    },
    ref
  ) => {
    const [status, setStatus] = React.useState<'loading' | 'loaded' | 'error'>(
      'loading'
    );

    React.useEffect(() => {
      if (src) {
        setStatus('loading');
      }
    }, [src]);

    const handleLoad = React.useCallback(() => {
      setStatus('loaded');
      onLoadProp?.();
    }, [onLoadProp]);

    const handleError = React.useCallback(() => {
      setStatus('error');
      onErrorProp?.();
    }, [onErrorProp]);

    const wrapperStyle: React.CSSProperties = aspectRatio
      ? { aspectRatio }
      : {};

    return (
      <div
        className={cn(
          'relative overflow-hidden',
          imageVariants({ rounded }),
          aspectRatio && 'w-full'
        )}
        style={wrapperStyle}
      >
        {/* Loading skeleton */}
        {status === 'loading' && (
          <div
            className="absolute inset-0 animate-pulse bg-[var(--color-background-tertiary,#e5e7eb)]"
            aria-hidden
          />
        )}

        {/* Error fallback */}
        {status === 'error' && (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-background-secondary)] [font-size:var(--component-image-fallback-font-size)] text-[var(--color-text-tertiary)]">
            {fallback || (
              <svg
                className="h-8 w-8 opacity-40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
                />
              </svg>
            )}
          </div>
        )}

        {/* Actual image */}
        {src && (
          <img
            ref={ref}
            src={src}
            alt={alt}
            onLoad={handleLoad}
            onError={handleError}
            className={cn(
              'h-full w-full',
              imageVariants({ fit }),
              status !== 'loaded' && 'invisible',
              className
            )}
            {...props}
          />
        )}
      </div>
    );
  }
);

Image.displayName = 'Image';

export { Image, imageVariants };

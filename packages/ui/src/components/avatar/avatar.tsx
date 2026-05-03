'use client';

import { Avatar as BaseAvatar } from '@base-ui-components/react/avatar';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '../../lib/cn';

const Root = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof BaseAvatar.Root>>(
  function AvatarRoot({ className, ...props }, ref) {
    // @ts-ignore — ref polymorphism
    return (
      <BaseAvatar.Root
        ref={ref}
        {...props}
        className={cn(
          'inline-flex h-10 w-10 shrink-0 select-none items-center justify-center overflow-hidden rounded-full align-middle',
          'bg-[var(--avatar-bg)]',
          className,
        )}
      />
    );
  },
);

const Image = forwardRef<HTMLImageElement, ComponentPropsWithoutRef<typeof BaseAvatar.Image>>(
  function AvatarImage({ className, ...props }, ref) {
    // @ts-ignore — ref polymorphism
    return (
      <BaseAvatar.Image
        ref={ref}
        {...props}
        className={cn('h-full w-full object-cover', className)}
      />
    );
  },
);

const Fallback = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof BaseAvatar.Fallback>>(
  function AvatarFallback({ className, ...props }, ref) {
    // @ts-ignore — ref polymorphism
    return (
      <BaseAvatar.Fallback
        ref={ref}
        {...props}
        className={cn(
          'flex h-full w-full items-center justify-center text-sm font-medium text-[var(--avatar-fallback-fg)]',
          className,
        )}
      />
    );
  },
);

export const Avatar = { ...BaseAvatar, Root, Image, Fallback };

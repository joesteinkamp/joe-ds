'use client';

import * as React from 'react';
import { cn } from '../lib/utils';

export interface UserMenuItem {
  label: string;
  onClick?: () => void;
  href?: string;
  icon?: React.ReactNode;
  destructive?: boolean;
  disabled?: boolean;
}

export interface UserMenuGroup {
  label?: string;
  items: UserMenuItem[];
}

export interface UserMenuProps {
  /** User display name */
  name: string;
  /** User email */
  email?: string;
  /** Avatar image URL */
  avatarUrl?: string;
  /** Avatar fallback (initials) */
  avatarFallback?: string;
  /** Menu item groups */
  groups: UserMenuGroup[];
  /** Additional className for the trigger */
  className?: string;
}

/**
 * UserMenu component — avatar-triggered dropdown menu
 *
 * @example
 * ```tsx
 * <UserMenu
 *   name="John Doe"
 *   email="john@example.com"
 *   avatarUrl="/avatars/john.jpg"
 *   avatarFallback="JD"
 *   groups={[
 *     {
 *       items: [
 *         { label: 'Profile', onClick: () => navigate('/profile') },
 *         { label: 'Settings', onClick: () => navigate('/settings') },
 *       ],
 *     },
 *     {
 *       items: [
 *         { label: 'Sign out', onClick: signOut, destructive: true },
 *       ],
 *     },
 *   ]}
 * />
 * ```
 */
const UserMenu = ({ name, email, avatarUrl, avatarFallback, groups, className }: UserMenuProps) => {
  const [open, setOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  // Close on outside click
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Close on Escape
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  const initials = avatarFallback || name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="relative inline-block">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={cn(
          'relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--color-background-secondary)] ring-offset-2 transition-all hover:ring-2 hover:ring-[var(--color-border-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)]',
          className
        )}
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
        ) : (
          <span className="[font-size:var(--font-size-sm)] [font-weight:var(--font-weight-medium)] [color:var(--color-text-primary)]">
            {initials}
          </span>
        )}
      </button>

      {open && (
        <div
          ref={menuRef}
          role="menu"
          className="absolute right-0 top-full z-[var(--z-index-dropdown,1000)] mt-2 min-w-[220px] rounded-[var(--component-button-border-radius,0.375rem)] border border-[var(--color-border-default)] bg-[var(--color-background-primary)] p-1 shadow-lg"
        >
          {/* User info header */}
          <div className="px-3 py-2">
            <p className="[font-size:var(--font-size-sm)] [font-weight:var(--font-weight-medium)] [color:var(--color-text-primary)]">
              {name}
            </p>
            {email && (
              <p className="[font-size:var(--font-size-xs)] text-[var(--color-text-tertiary)]">
                {email}
              </p>
            )}
          </div>

          {groups.map((group, groupIdx) => (
            <React.Fragment key={groupIdx}>
              {/* Separator between groups */}
              <div className="my-1 h-px bg-[var(--color-border-default)]" role="separator" />

              {group.label && (
                <p className="px-3 py-1 [font-size:var(--font-size-xs)] [font-weight:var(--font-weight-medium)] text-[var(--color-text-tertiary)]">
                  {group.label}
                </p>
              )}

              {group.items.map((item, itemIdx) => {
                const Wrapper = item.href ? 'a' : 'button';
                const wrapperProps = item.href
                  ? { href: item.href }
                  : { type: 'button' as const, onClick: item.onClick };

                return (
                  <Wrapper
                    key={itemIdx}
                    role="menuitem"
                    disabled={item.disabled}
                    className={cn(
                      'flex w-full items-center rounded-sm px-3 py-2 text-left [font-size:var(--font-size-sm)] transition-colors focus:outline-none focus:bg-[var(--color-background-secondary)]',
                      item.destructive
                        ? 'text-[var(--color-text-error)] hover:bg-[var(--color-background-error)]'
                        : 'text-[var(--color-text-primary)] hover:bg-[var(--color-background-secondary)]',
                      item.disabled && 'pointer-events-none opacity-50'
                    )}
                    {...wrapperProps}
                  >
                    {item.icon && (
                      <span className="mr-2 h-4 w-4 shrink-0" aria-hidden>
                        {item.icon}
                      </span>
                    )}
                    {item.label}
                  </Wrapper>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

UserMenu.displayName = 'UserMenu';

export { UserMenu };

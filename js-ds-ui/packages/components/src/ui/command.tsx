'use client';

import * as React from 'react';
import { cn } from '../lib/utils';
import { Search } from 'lucide-react';

type CommandContextValue = {
  search: string;
  setSearch: (search: string) => void;
  value: string;
  setValue: (value: string) => void;
  filteredItems: Set<string>;
};

const CommandContext = React.createContext<CommandContextValue>({
  search: '',
  setSearch: () => {},
  value: '',
  setValue: () => {},
  filteredItems: new Set(),
});

export interface CommandProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Command component — keyboard-navigable command palette / search interface
 *
 * @example
 * ```tsx
 * <Command>
 *   <CommandInput placeholder="Search..." />
 *   <CommandList>
 *     <CommandEmpty>No results found.</CommandEmpty>
 *     <CommandGroup heading="Suggestions">
 *       <CommandItem onSelect={() => console.log('selected')}>
 *         Calendar
 *       </CommandItem>
 *     </CommandGroup>
 *   </CommandList>
 * </Command>
 * ```
 */
const Command = React.forwardRef<HTMLDivElement, CommandProps>(
  ({ className, children, ...props }, ref) => {
    const [search, setSearch] = React.useState('');
    const [value, setValue] = React.useState('');
    const filteredItems = React.useMemo(() => new Set<string>(), []);

    return (
      <CommandContext.Provider
        value={{ search, setSearch, value, setValue, filteredItems }}
      >
        <div
          ref={ref}
          className={cn(
            'flex h-full w-full flex-col overflow-hidden rounded-[var(--component-command-border-radius)] bg-[var(--component-command-bg)] text-[var(--component-command-text)]',
            className
          )}
          {...props}
        >
          {children}
        </div>
      </CommandContext.Provider>
    );
  }
);

Command.displayName = 'Command';

export interface CommandInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const CommandInput = React.forwardRef<HTMLInputElement, CommandInputProps>(
  ({ className, ...props }, ref) => {
    const { search, setSearch } = React.useContext(CommandContext);

    return (
      <div className="flex items-center border-b border-[var(--color-border-default)] px-3">
        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        <input
          ref={ref}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={cn(
            'flex h-11 w-full rounded-[var(--component-command-border-radius)] bg-transparent py-3 [font-size:var(--component-command-font-size)] outline-none placeholder:text-[var(--color-text-tertiary)] disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

CommandInput.displayName = 'CommandInput';

export interface CommandListProps extends React.HTMLAttributes<HTMLDivElement> {}

const CommandList = React.forwardRef<HTMLDivElement, CommandListProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('max-h-[300px] overflow-y-auto overflow-x-hidden', className)}
      role="listbox"
      {...props}
    />
  )
);

CommandList.displayName = 'CommandList';

export interface CommandEmptyProps extends React.HTMLAttributes<HTMLDivElement> {}

const CommandEmpty = React.forwardRef<HTMLDivElement, CommandEmptyProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('py-6 text-center [font-size:var(--component-command-font-size)]', className)}
      {...props}
    />
  )
);

CommandEmpty.displayName = 'CommandEmpty';

export interface CommandGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  heading?: string;
}

const CommandGroup = React.forwardRef<HTMLDivElement, CommandGroupProps>(
  ({ className, heading, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('overflow-hidden p-1', className)}
      role="group"
      {...props}
    >
      {heading && (
        <div className="px-2 py-1.5 [font-size:var(--component-command-group-font-size)] [font-weight:var(--component-command-group-font-weight)] text-[var(--color-text-tertiary)]">
          {heading}
        </div>
      )}
      {children}
    </div>
  )
);

CommandGroup.displayName = 'CommandGroup';

export interface CommandItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  onSelect?: (value: string) => void;
  disabled?: boolean;
}

const CommandItem = React.forwardRef<HTMLDivElement, CommandItemProps>(
  ({ className, value, onSelect, disabled, children, ...props }, ref) => {
    const { search } = React.useContext(CommandContext);
    const itemValue =
      value || (typeof children === 'string' ? children : '');

    // Simple text matching filter
    if (
      search &&
      !String(itemValue).toLowerCase().includes(search.toLowerCase())
    ) {
      return null;
    }

    return (
      <div
        ref={ref}
        role="option"
        aria-selected={false}
        aria-disabled={disabled}
        data-disabled={disabled || undefined}
        className={cn(
          'relative flex cursor-default select-none items-center rounded-[var(--component-command-border-radius)] px-2 py-1.5 [font-size:var(--component-command-font-size)] outline-none',
          'hover:bg-[var(--color-background-secondary)] hover:text-[var(--color-text-primary)]',
          'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
          className
        )}
        onClick={() => {
          if (!disabled && onSelect) onSelect(String(itemValue));
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CommandItem.displayName = 'CommandItem';

export interface CommandSeparatorProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const CommandSeparator = React.forwardRef<
  HTMLDivElement,
  CommandSeparatorProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('-mx-1 h-px bg-[var(--color-border-default)]', className)}
    {...props}
  />
));

CommandSeparator.displayName = 'CommandSeparator';

export interface CommandShortcutProps
  extends React.HTMLAttributes<HTMLSpanElement> {}

const CommandShortcut = ({ className, ...props }: CommandShortcutProps) => (
  <span
    className={cn(
      'ml-auto [font-size:var(--component-command-shortcut-font-size)] tracking-widest text-[var(--color-text-tertiary)]',
      className
    )}
    {...props}
  />
);

CommandShortcut.displayName = 'CommandShortcut';

export interface CommandDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

/**
 * CommandDialog — renders a Command palette in a fixed overlay
 *
 * Toggles with Cmd+K / Ctrl+K by default.
 *
 * @example
 * ```tsx
 * const [open, setOpen] = React.useState(false);
 *
 * <CommandDialog open={open} onOpenChange={setOpen}>
 *   <CommandInput placeholder="Type a command..." />
 *   <CommandList>
 *     <CommandGroup heading="Actions">
 *       <CommandItem>New File</CommandItem>
 *     </CommandGroup>
 *   </CommandList>
 * </CommandDialog>
 * ```
 */
const CommandDialog = ({ open, onOpenChange, children }: CommandDialogProps) => {
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange?.(!open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => onOpenChange?.(false)}
      />
      <div className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] shadow-lg">
        <Command className="rounded-lg border border-[var(--component-command-border)] shadow-lg">
          {children}
        </Command>
      </div>
    </div>
  );
};

CommandDialog.displayName = 'CommandDialog';

export {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
  CommandDialog,
};

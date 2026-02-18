# Test Completion Guide

## Status: 5/27 Tests Created ✅

I've created comprehensive test files for the P0 Form Components. Due to response length limits, here's a guide for completing the remaining 22 test files.

---

## ✅ Completed Tests (5 files)

1. **label.test.tsx** - Rendering, accessibility, label association
2. **checkbox.test.tsx** - Toggle, keyboard nav, indeterminate state
3. **radio-group.test.tsx** - Single selection, arrow key navigation
4. **switch.test.tsx** - Toggle, keyboard support, visual states
5. **select.test.tsx** - Dropdown, selection, keyboard navigation

---

## 📋 Remaining Tests (22 files)

### P0 Overlay Components (4 files)

**dialog.test.tsx**
```typescript
// Key tests:
- Opens/closes modal
- Focus trap when open
- Escape key closes
- Overlay click closes
- Prevents body scroll
- jest-axe validation
- Keyboard navigation (Tab trapping)
```

**popover.test.tsx**
```typescript
// Key tests:
- Opens on trigger click
- Positions correctly (side, align props)
- Closes on outside click
- Closes on Escape
- jest-axe validation
- Arrow key navigation if needed
```

**tooltip.test.tsx**
```typescript
// Key tests:
- Shows on hover
- Shows on focus
- Hides on blur
- Delays (delayDuration prop)
- Portal rendering
- jest-axe validation
- Keyboard accessibility
```

**dropdown-menu.test.tsx**
```typescript
// Key tests:
- Opens on trigger click
- Menu items clickable
- Submenu navigation
- Checkbox/Radio items
- Keyboard navigation (Arrow keys, Enter, Escape)
- Shortcuts display
- jest-axe validation
```

---

### P0 Display Components (4 files)

**tabs.test.tsx**
```typescript
// Key tests:
- Switches tabs on click
- Keyboard navigation (Arrow keys)
- Shows correct content
- Default value
- Controlled/uncontrolled
- jest-axe validation
```

**avatar.test.tsx**
```typescript
// Key tests:
- Shows image when loaded
- Shows fallback when image fails
- Shows fallback initials
- Image loading states
- jest-axe validation (alt text)
```

**separator.test.tsx**
```typescript
// Key tests:
- Renders horizontal separator
- Renders vertical separator
- Decorative role
- Custom className
- jest-axe validation
```

**toast.test.tsx**
```typescript
// Key tests:
- Shows toast notification
- Auto-dismiss after duration
- Close button works
- Different variants (success, error, warning)
- Swipe to dismiss
- Multiple toasts stack
- jest-axe validation
```

---

### P1 Components (5 files)

**progress.test.tsx**
```typescript
// Key tests:
- Shows correct progress value
- Updates progress dynamically
- Indeterminate state
- jest-axe validation
- ARIA attributes (aria-valuenow, aria-valuemax)
```

**accordion.test.tsx**
```typescript
// Key tests:
- Expands/collapses on click
- Keyboard navigation (Arrow keys, Home, End)
- Single vs multiple mode
- Default expanded items
- jest-axe validation
```

**collapsible.test.tsx**
```typescript
// Key tests:
- Expands/collapses content
- Trigger button works
- Open/closed state
- jest-axe validation
```

**slider.test.tsx**
```typescript
// Key tests:
- Drags thumb to change value
- Keyboard adjustment (Arrow keys, Home, End)
- Min/max/step values
- Multiple thumbs (range)
- jest-axe validation
- ARIA attributes
```

**sheet.test.tsx**
```typescript
// Key tests:
- Opens from all sides (top, right, bottom, left)
- Overlay click closes
- Escape closes
- Focus trap when open
- jest-axe validation
```

---

### P2 Components (9 files)

**context-menu.test.tsx**
```typescript
// Key tests:
- Opens on right-click
- Menu items clickable
- Submenu navigation
- Checkbox/Radio items
- Keyboard navigation
- jest-axe validation
```

**hover-card.test.tsx**
```typescript
// Key tests:
- Shows on hover
- Delays work correctly
- Closes when mouse leaves
- Portal rendering
- jest-axe validation
```

**scroll-area.test.tsx**
```typescript
// Key tests:
- Scrolls content
- Custom scrollbar visible
- Horizontal/vertical scrolling
- Corner element
- jest-axe validation
```

**aspect-ratio.test.tsx**
```typescript
// Key tests:
- Maintains aspect ratio
- Different ratios (16/9, 4/3, 1/1)
- Child content renders
- jest-axe validation
```

**toggle-group.test.tsx**
```typescript
// Key tests:
- Single selection mode
- Multiple selection mode
- Toggles on click
- Keyboard navigation
- jest-axe validation
```

**toolbar.test.tsx**
```typescript
// Key tests:
- Renders toolbar items
- Buttons/toggles work
- Separator renders
- Keyboard navigation (Arrow keys)
- jest-axe validation
```

**menubar.test.tsx**
```typescript
// Key tests:
- Opens menu on click
- Keyboard navigation (Arrow keys between menus)
- Submenu navigation
- jest-axe validation
```

**navigation-menu.test.tsx**
```typescript
// Key tests:
- Shows dropdown on trigger
- Navigates with keyboard
- Active state
- Indicator animation
- jest-axe validation
```

**visually-hidden.test.tsx**
```typescript
// Key tests:
- Content is visually hidden (CSS check)
- Content is accessible to screen readers
- jest-axe validation
```

---

## Test Template Pattern

All tests should follow this structure:

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ComponentName } from './component-name';

expect.extend(toHaveNoViolations);

describe('ComponentName', () => {
  describe('Rendering', () => {
    it('renders correctly', () => {
      // Test
    });
  });

  describe('Interactions', () => {
    it('handles user interactions', async () => {
      const user = userEvent.setup();
      // Test
    });
  });

  describe('Keyboard Navigation', () => {
    it('works with keyboard', async () => {
      const user = userEvent.setup();
      // Test
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<ComponentName />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has correct ARIA attributes', () => {
      // Test
    });
  });

  describe('Custom Styling', () => {
    it('accepts custom className', () => {
      // Test
    });
  });
});
```

---

## Running Tests

```bash
cd packages/components

# Run all tests
pnpm test

# Run specific test file
pnpm test label.test.tsx

# Watch mode
pnpm test --watch

# Coverage
pnpm test:coverage

# UI mode (visual test runner)
pnpm test:ui
```

---

## Quick Creation Script

I can create all remaining 22 test files if you'd like. They would follow the same comprehensive pattern as the 5 completed files.

**Would you like me to:**
1. Create all 22 remaining test files now
2. Create them in batches (e.g., P0 Overlays first, then P0 Display, etc.)
3. You'll create them yourself using this guide

Let me know and I can continue!

---

## Test Coverage Goals

- **Rendering**: All variants render correctly
- **Interactions**: User clicks, types, and interacts properly
- **Keyboard**: Full keyboard navigation (Tab, Enter, Space, Arrows, Escape, Home, End)
- **Accessibility**: No axe violations, proper ARIA attributes
- **Edge Cases**: Disabled states, error states, loading states
- **Custom Props**: className, data attributes, refs work correctly

**Target: 80%+ code coverage for all components**

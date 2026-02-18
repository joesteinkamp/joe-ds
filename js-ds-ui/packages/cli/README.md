# @js-ds-ui/cli

CLI tool for js-ds-ui design system. Copies components into your project (shadcn-style).

## Installation

```bash
npx @js-ds-ui/cli init
```

## Commands

### `init`

Initialize js-ds-ui in your project:

```bash
npx @js-ds-ui/cli init
```

This will:
1. Create directory structure
2. Add configuration file (`js-ds-ui.json`)
3. Set up CSS imports with design tokens
4. Install base dependencies

### `add`

Add components to your project:

```bash
# Interactive mode
npx @js-ds-ui/cli add

# Specific components
npx @js-ds-ui/cli add button input

# Single component
npx @js-ds-ui/cli add button
```

## How It Works

Unlike traditional npm packages, js-ds-ui uses the **shadcn/ui model**:

1. Components are **copied into your project**
2. You **own the code** completely
3. No dependency updates - you control everything
4. Full customization without ejecting

## Project Structure

After initialization:

```
your-project/
├── src/
│   ├── components/
│   │   └── ui/
│   │       ├── button.tsx
│   │       └── input.tsx
│   ├── lib/
│   │   └── utils.ts
│   ├── hooks/
│   │   ├── use-theme.ts
│   │   └── use-density.ts
│   └── styles/
│       └── tokens.css
└── js-ds-ui.json
```

## Configuration

`js-ds-ui.json`:

```json
{
  "style": "default",
  "typescript": true,
  "aliases": {
    "components": "./src/components",
    "utils": "./src/lib",
    "hooks": "./src/hooks"
  }
}
```

## Usage

```tsx
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import { useDensity } from '@/hooks/use-density';

function App() {
  const { theme, setTheme } = useTheme();
  const { density, setDensity } = useDensity();

  return (
    <div>
      <Button variant="primary" size="md">
        Click me
      </Button>

      <button onClick={() => setTheme('dark')}>
        Toggle Dark Mode
      </button>

      <button onClick={() => setDensity('compact')}>
        Compact Mode
      </button>
    </div>
  );
}
```

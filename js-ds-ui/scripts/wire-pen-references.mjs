#!/usr/bin/env node
/**
 * Wire up variable-to-variable references in js-ds-ui.pen
 * Establishes the 3-tier cascade: Primitives → Semantics → Components
 */
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const penPath = resolve(__dirname, '..', 'js-ds-ui.pen');

const pen = JSON.parse(readFileSync(penPath, 'utf-8'));

// ── Semantic Colors → Primitive Colors (with light/dark themes) ──
const semanticColorMap = {
  // Text
  'color.text.primary':       { light: '$color.neutral.900', dark: '$color.neutral.50' },
  'color.text.secondary':     { light: '$color.neutral.600', dark: '$color.neutral.400' },
  'color.text.tertiary':      { light: '$color.neutral.500', dark: '$color.neutral.500' },
  'color.text.inverse':       { light: '$color.neutral.50',  dark: '$color.neutral.900' },
  'color.text.success':       { light: '$color.green.600',   dark: '$color.green.400' },
  'color.text.warning':       { light: '$color.amber.700',   dark: '$color.amber.300' },
  'color.text.error':         { light: '$color.red.600',     dark: '$color.red.400' },
  'color.text.info':          { light: '$color.cyan.600',    dark: '$color.cyan.400' },
  // Background
  'color.background.primary':   { light: '$color.neutral.50',  dark: '$color.neutral.900' },
  'color.background.secondary': { light: '$color.neutral.100', dark: '$color.neutral.800' },
  'color.background.tertiary':  { light: '$color.neutral.200', dark: '$color.neutral.700' },
  'color.background.inverse':   { light: '$color.neutral.900', dark: '$color.neutral.50' },
  'color.background.success':   { light: '$color.green.50',    dark: '$color.green.900' },
  'color.background.warning':   { light: '$color.amber.50',    dark: '$color.amber.900' },
  'color.background.error':     { light: '$color.red.50',      dark: '$color.red.900' },
  'color.background.info':      { light: '$color.cyan.50',     dark: '$color.cyan.900' },
  'color.background.overlay':   { light: '$color.neutral.950', dark: '$color.neutral.950' },
  // Border
  'color.border.default': { light: '$color.neutral.300', dark: '$color.neutral.700' },
  'color.border.hover':   { light: '$color.neutral.400', dark: '$color.neutral.600' },
  'color.border.focus':   { light: '$color.blue.500',    dark: '$color.blue.400' },
  // Interactive
  'color.interactive.primary':       { light: '$color.blue.500',    dark: '$color.blue.400' },
  'color.interactive.primary-hover': { light: '$color.blue.600',    dark: '$color.blue.300' },
  'color.interactive.primary-active':{ light: '$color.blue.700',    dark: '$color.blue.200' },
  'color.interactive.secondary':     { light: '$color.purple.500',  dark: '$color.purple.400' },
  'color.interactive.disabled':      { light: '$color.neutral.300', dark: '$color.neutral.700' },
};

for (const [name, refs] of Object.entries(semanticColorMap)) {
  pen.variables[name] = {
    type: 'color',
    value: [
      { value: refs.light, theme: { mode: 'light' } },
      { value: refs.dark,  theme: { mode: 'dark' } },
    ],
  };
}

// ── Semantic Sizing → Primitive Sizing ──
const sizingRefMap = {
  'size.component.height.xs': '$sizing.component.height.xs',
  'size.component.height.sm': '$sizing.component.height.sm',
  'size.component.height.md': '$sizing.component.height.md',
  'size.component.height.lg': '$sizing.component.height.lg',
  'size.component.height.xl': '$sizing.component.height.xl',
  'size.component.icon.xs':   '$sizing.component.icon.xs',
  'size.component.icon.sm':   '$sizing.component.icon.sm',
  'size.component.icon.md':   '$sizing.component.icon.md',
  'size.component.icon.lg':   '$sizing.component.icon.lg',
  'size.component.icon.xl':   '$sizing.component.icon.xl',
  'size.touch.minimum':       '$sizing.touch.minimum',
  'size.touch.comfortable':   '$sizing.touch.comfortable',
};

for (const [name, ref] of Object.entries(sizingRefMap)) {
  pen.variables[name] = { type: 'number', value: ref };
}

// ── Component Tokens → Semantic Tokens ──
const componentRefMap = {
  // Button
  'component.button.padding-x':    '$space.component.padding.lg',
  'component.button.padding-y':    '$space.component.padding.sm',
  'component.button.height-sm':    '$size.component.height.sm',
  'component.button.height-md':    '$size.component.height.md',
  'component.button.height-lg':    '$size.component.height.lg',
  'component.button.gap':          '$space.component.gap.sm',
  'component.button.font-size':    '$typography.size.sm',
  'component.button.font-weight':  '$typography.weight.medium',
  // Input
  'component.input.height':     '$size.component.height.md',
  'component.input.padding-x':  '$space.component.padding.md',
  'component.input.padding-y':  '$space.component.padding.sm',
  'component.input.font-size':  '$typography.size.sm',
  // Alert
  'component.alert.padding':    '$space.component.padding.md',
  // Badge
  'component.badge.font-size':   '$typography.size.xs',
  'component.badge.font-weight': '$typography.weight.semibold',
  // Card
  'component.card.padding':     '$space.component.padding.lg',
  'component.card.header-gap':  '$space.component.gap.sm',
  // Dialog
  'component.dialog.padding':   '$space.component.padding.xl',
  'component.dialog.gap':       '$space.component.gap.sm',
  // Toast
  'component.toast.padding':    '$space.component.padding.lg',
};

for (const [name, ref] of Object.entries(componentRefMap)) {
  pen.variables[name] = { type: 'number', value: ref };
}

// Write back
writeFileSync(penPath, JSON.stringify(pen, null, 2) + '\n');

// Summary
const semanticCount = Object.keys(semanticColorMap).length + Object.keys(sizingRefMap).length;
const componentCount = Object.keys(componentRefMap).length;
console.log(`Done! Wired ${semanticCount} semantic → primitive refs and ${componentCount} component → semantic refs.`);
console.log(`Total variables: ${Object.keys(pen.variables).length}`);

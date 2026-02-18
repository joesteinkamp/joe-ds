#!/usr/bin/env node
/**
 * Add Autocomplete and Multiselect components to js-ds-ui.pen
 */
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const penPath = resolve(__dirname, '..', 'js-ds-ui.pen');
const pen = JSON.parse(readFileSync(penPath, 'utf-8'));

// Find the Form Controls page
const formPage = pen.children.find(c => c.name === 'Form Controls');
if (!formPage) { console.error('Form Controls page not found'); process.exit(1); }

let seq = 50000;
const id = () => `_ac_${seq++}`;

// ── Autocomplete Component ──
const autocomplete = {
  id: id(), type: 'frame', name: 'autocomplete', reusable: true,
  layout: 'vertical', width: 320,
  children: [
    {
      id: id(), type: 'frame', name: 'ac-input',
      width: 'fill_container', height: 40, cornerRadius: 6,
      fill: '$color.background.primary',
      stroke: { fill: '$color.interactive.primary', thickness: 2 },
      padding: [12, 10], alignItems: 'center', gap: 8,
      children: [
        { id: id(), type: 'icon_font', name: 'ac-search-icon', iconFontFamily: 'lucide', iconFontName: 'search', width: 16, height: 16, fill: '$color.text.tertiary' },
        { id: id(), type: 'text', name: 'ac-input-text', content: 'Rea', fontFamily: 'Inter', fontSize: 14, fontWeight: 'normal', fill: '$color.text.primary' },
      ]
    },
    {
      id: id(), type: 'frame', name: 'ac-dropdown',
      layout: 'vertical', width: 'fill_container', cornerRadius: 8,
      fill: '$color.background.primary',
      stroke: { fill: '$color.border.default', thickness: 1 },
      effect: { type: 'shadow', shadowType: 'outer', color: '#00000025', blur: 12, offset: { x: 0, y: 4 }, spread: -2 },
      padding: 4, gap: 2,
      children: [
        {
          id: id(), type: 'frame', name: 'ac-item-react',
          width: 'fill_container', height: 36, cornerRadius: 6,
          fill: '$color.background.secondary', padding: [10, 8], alignItems: 'center', gap: 8,
          children: [
            { id: id(), type: 'icon_font', iconFontFamily: 'lucide', iconFontName: 'code', width: 16, height: 16, fill: '$color.text.secondary' },
            { id: id(), type: 'text', content: 'React', fontFamily: 'Inter', fontSize: 14, fontWeight: 'normal', fill: '$color.text.primary' },
          ]
        },
        {
          id: id(), type: 'frame', name: 'ac-item-react-native',
          width: 'fill_container', height: 36, cornerRadius: 6,
          padding: [10, 8], alignItems: 'center', gap: 8,
          children: [
            { id: id(), type: 'icon_font', iconFontFamily: 'lucide', iconFontName: 'smartphone', width: 16, height: 16, fill: '$color.text.secondary' },
            { id: id(), type: 'text', content: 'React Native', fontFamily: 'Inter', fontSize: 14, fontWeight: 'normal', fill: '$color.text.primary' },
          ]
        },
        {
          id: id(), type: 'frame', name: 'ac-item-reasonml',
          width: 'fill_container', height: 36, cornerRadius: 6,
          padding: [10, 8], alignItems: 'center', gap: 8,
          children: [
            { id: id(), type: 'icon_font', iconFontFamily: 'lucide', iconFontName: 'terminal', width: 16, height: 16, fill: '$color.text.secondary' },
            { id: id(), type: 'text', content: 'ReasonML', fontFamily: 'Inter', fontSize: 14, fontWeight: 'normal', fill: '$color.text.primary' },
          ]
        },
        {
          id: id(), type: 'frame', name: 'ac-item-realm',
          width: 'fill_container', height: 36, cornerRadius: 6,
          padding: [10, 8], alignItems: 'center', gap: 8,
          children: [
            { id: id(), type: 'icon_font', iconFontFamily: 'lucide', iconFontName: 'database', width: 16, height: 16, fill: '$color.text.secondary' },
            { id: id(), type: 'text', content: 'Realm', fontFamily: 'Inter', fontSize: 14, fontWeight: 'normal', fill: '$color.text.primary' },
          ]
        },
      ]
    }
  ]
};

// ── Multiselect Component ──
function makeTag(name) {
  return {
    id: id(), type: 'frame', name: `ms-tag-${name.toLowerCase()}`,
    height: 26, cornerRadius: 4, fill: '$color.interactive.primary',
    padding: [8, 4], alignItems: 'center', gap: 4,
    children: [
      { id: id(), type: 'text', content: name, fontFamily: 'Inter', fontSize: 12, fontWeight: '500', fill: '#FFFFFF' },
      { id: id(), type: 'icon_font', iconFontFamily: 'lucide', iconFontName: 'x', width: 12, height: 12, fill: '#FFFFFF' },
    ]
  };
}

function makeCheckedOption(name) {
  return {
    id: id(), type: 'frame', name: `ms-opt-${name.toLowerCase()}`,
    width: 'fill_container', height: 36, cornerRadius: 6,
    fill: '$color.background.secondary', padding: [10, 8], alignItems: 'center', gap: 8,
    children: [
      {
        id: id(), type: 'frame', name: `ms-check-${name.toLowerCase()}`,
        width: 16, height: 16, cornerRadius: 3, fill: '$color.interactive.primary',
        alignItems: 'center', justifyContent: 'center',
        children: [
          { id: id(), type: 'icon_font', iconFontFamily: 'lucide', iconFontName: 'check', width: 12, height: 12, fill: '#FFFFFF' },
        ]
      },
      { id: id(), type: 'text', content: name, fontFamily: 'Inter', fontSize: 14, fontWeight: 'normal', fill: '$color.text.primary' },
    ]
  };
}

function makeUncheckedOption(name) {
  return {
    id: id(), type: 'frame', name: `ms-opt-${name.toLowerCase().replace('.', '')}`,
    width: 'fill_container', height: 36, cornerRadius: 6,
    padding: [10, 8], alignItems: 'center', gap: 8,
    children: [
      {
        id: id(), type: 'frame', name: `ms-uncheck-${name.toLowerCase()}`,
        width: 16, height: 16, cornerRadius: 3,
        fill: '$color.background.primary',
        stroke: { fill: '$color.border.default', thickness: 1 },
      },
      { id: id(), type: 'text', content: name, fontFamily: 'Inter', fontSize: 14, fontWeight: 'normal', fill: '$color.text.primary' },
    ]
  };
}

const multiselect = {
  id: id(), type: 'frame', name: 'multiselect', reusable: true,
  layout: 'vertical', width: 360,
  children: [
    {
      id: id(), type: 'frame', name: 'ms-input',
      width: 'fill_container', cornerRadius: 6,
      fill: '$color.background.primary',
      stroke: { fill: '$color.border.default', thickness: 1 },
      padding: 8, gap: 6, flexWrap: 'wrap', alignItems: 'center',
      children: [
        makeTag('React'),
        makeTag('Vue'),
        makeTag('Angular'),
        { id: id(), type: 'text', content: 'Search...', fontFamily: 'Inter', fontSize: 14, fontWeight: 'normal', fill: '$color.text.tertiary' },
        { id: id(), type: 'icon_font', iconFontFamily: 'lucide', iconFontName: 'chevrons-up-down', width: 16, height: 16, fill: '$color.text.secondary' },
      ]
    },
    {
      id: id(), type: 'frame', name: 'ms-dropdown',
      layout: 'vertical', width: 'fill_container', cornerRadius: 8,
      fill: '$color.background.primary',
      stroke: { fill: '$color.border.default', thickness: 1 },
      effect: { type: 'shadow', shadowType: 'outer', color: '#00000025', blur: 12, offset: { x: 0, y: 4 }, spread: -2 },
      padding: 4, gap: 2,
      children: [
        makeCheckedOption('React'),
        makeCheckedOption('Vue'),
        makeCheckedOption('Angular'),
        makeUncheckedOption('Svelte'),
        makeUncheckedOption('Next.js'),
        makeUncheckedOption('Nuxt'),
      ]
    }
  ]
};

// Add sections wrapping the components
const acSection = {
  id: id(), type: 'frame', name: 'autocomplete-section',
  layout: 'vertical', gap: 16, width: 1344,
  children: [
    { id: id(), type: 'text', content: 'Autocomplete', fontFamily: 'Inter', fontSize: 14, fontWeight: '600', fill: '$color.text.primary' },
    autocomplete,
  ]
};

const msSection = {
  id: id(), type: 'frame', name: 'multiselect-section',
  layout: 'vertical', gap: 16, width: 1344,
  children: [
    { id: id(), type: 'text', content: 'Multiselect', fontFamily: 'Inter', fontSize: 14, fontWeight: '600', fill: '$color.text.primary' },
    multiselect,
  ]
};

formPage.children.push(acSection, msSection);

// Remove any MCP-created orphans (DZe0S, WPWMJ and their sections)
function removeById(node, idsToRemove) {
  if (!node.children || !Array.isArray(node.children)) return;
  node.children = node.children.filter(c => !idsToRemove.includes(c.id));
  node.children.forEach(c => removeById(c, idsToRemove));
}
removeById(formPage, ['UQDIR', '15C43', 'DZe0S', 'WPWMJ']);

writeFileSync(penPath, JSON.stringify(pen, null, 2) + '\n');

// Count reusable
function countReusable(node) {
  let count = node.reusable ? 1 : 0;
  if (Array.isArray(node.children)) {
    for (const c of node.children) count += countReusable(c);
  }
  return count;
}
const total = pen.children.reduce((sum, c) => sum + countReusable(c), 0);
console.log(`Done! Added autocomplete and multiselect to Form Controls.`);
console.log(`Total reusable components: ${total}`);

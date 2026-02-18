import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Toolbar, ToolbarButton, ToolbarSeparator } from './toolbar';

expect.extend(toHaveNoViolations);

describe('Toolbar', () => {
  describe('Rendering', () => {
    it('renders toolbar', () => {
      const { container } = render(
        <Toolbar>
          <ToolbarButton>Button 1</ToolbarButton>
          <ToolbarButton>Button 2</ToolbarButton>
        </Toolbar>
      );

      expect(container.querySelector('[role="toolbar"]')).toBeInTheDocument();
    });

    it('renders toolbar buttons', () => {
      render(
        <Toolbar>
          <ToolbarButton>Cut</ToolbarButton>
          <ToolbarButton>Copy</ToolbarButton>
          <ToolbarButton>Paste</ToolbarButton>
        </Toolbar>
      );

      expect(screen.getByText('Cut')).toBeInTheDocument();
      expect(screen.getByText('Copy')).toBeInTheDocument();
      expect(screen.getByText('Paste')).toBeInTheDocument();
    });

    it('renders separator', () => {
      const { container } = render(
        <Toolbar>
          <ToolbarButton>Button 1</ToolbarButton>
          <ToolbarSeparator />
          <ToolbarButton>Button 2</ToolbarButton>
        </Toolbar>
      );

      expect(container.querySelector('[role="separator"]')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(
        <Toolbar>
          <ToolbarButton>Button</ToolbarButton>
        </Toolbar>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has toolbar role', () => {
      const { container } = render(
        <Toolbar>
          <ToolbarButton>Button</ToolbarButton>
        </Toolbar>
      );

      expect(container.querySelector('[role="toolbar"]')).toBeInTheDocument();
    });
  });

  describe('Custom Styling', () => {
    it('accepts custom className', () => {
      const { container } = render(
        <Toolbar className="custom-toolbar">
          <ToolbarButton>Button</ToolbarButton>
        </Toolbar>
      );

      expect(container.querySelector('.custom-toolbar')).toBeInTheDocument();
    });
  });
});

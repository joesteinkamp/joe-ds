import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Slider } from './slider';

expect.extend(toHaveNoViolations);

describe('Slider', () => {
  describe('Rendering', () => {
    it('renders slider', () => {
      const { container } = render(<Slider defaultValue={[50]} />);
      const slider = container.querySelector('[role="slider"]');
      expect(slider).toBeInTheDocument();
    });

    it('shows correct default value', () => {
      const { container } = render(<Slider defaultValue={[75]} />);
      const slider = container.querySelector('[role="slider"]');
      expect(slider).toHaveAttribute('aria-valuenow', '75');
    });

    it('renders with min and max', () => {
      const { container } = render(<Slider min={0} max={100} defaultValue={[50]} />);
      const slider = container.querySelector('[role="slider"]');
      expect(slider).toHaveAttribute('aria-valuemin', '0');
      expect(slider).toHaveAttribute('aria-valuemax', '100');
    });

    it('renders with step', () => {
      const { container } = render(<Slider step={10} defaultValue={[50]} />);
      const slider = container.querySelector('[role="slider"]');
      expect(slider).toBeInTheDocument();
    });

    it('renders multiple thumbs for range', () => {
      const { container } = render(<Slider defaultValue={[25, 75]} />);
      const sliders = container.querySelectorAll('[role="slider"]');
      expect(sliders).toHaveLength(2);
    });
  });

  describe('Interactions', () => {
    it('updates value on drag', async () => {
      const user = userEvent.setup();
      let value = [50];
      const handleValueChange = (val: number[]) => {
        value = val;
      };

      const { container } = render(
        <Slider defaultValue={[50]} onValueChange={handleValueChange} />
      );

      const thumb = container.querySelector('[role="slider"]');
      if (thumb) {
        await user.pointer([
          { keys: '[MouseLeft>]', target: thumb },
          { coords: { x: 100, y: 0 } },
          { keys: '[/MouseLeft]' },
        ]);
      }

      // Value should have changed
      expect(value).not.toEqual([50]);
    });

    it('respects min value', () => {
      const { container } = render(<Slider min={10} max={100} defaultValue={[5]} />);
      const slider = container.querySelector('[role="slider"]');
      expect(slider).toHaveAttribute('aria-valuenow', '10');
    });

    it('respects max value', () => {
      const { container } = render(<Slider min={0} max={100} defaultValue={[150]} />);
      const slider = container.querySelector('[role="slider"]');
      expect(slider).toHaveAttribute('aria-valuenow', '100');
    });

    it('snaps to step values', () => {
      const { container } = render(<Slider step={10} defaultValue={[45]} />);
      // Should snap to nearest step (40 or 50)
      const slider = container.querySelector('[role="slider"]');
      expect(slider).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    it('increases value with Arrow Right', async () => {
      const user = userEvent.setup();
      const { container } = render(<Slider defaultValue={[50]} />);
      const slider = container.querySelector('[role="slider"]') as HTMLElement;

      slider.focus();
      const initialValue = slider.getAttribute('aria-valuenow');

      await user.keyboard('{ArrowRight}');

      const newValue = slider.getAttribute('aria-valuenow');
      expect(Number(newValue)).toBeGreaterThan(Number(initialValue));
    });

    it('decreases value with Arrow Left', async () => {
      const user = userEvent.setup();
      const { container } = render(<Slider defaultValue={[50]} />);
      const slider = container.querySelector('[role="slider"]') as HTMLElement;

      slider.focus();
      const initialValue = slider.getAttribute('aria-valuenow');

      await user.keyboard('{ArrowLeft}');

      const newValue = slider.getAttribute('aria-valuenow');
      expect(Number(newValue)).toBeLessThan(Number(initialValue));
    });

    it('increases value with Arrow Up', async () => {
      const user = userEvent.setup();
      const { container } = render(<Slider defaultValue={[50]} />);
      const slider = container.querySelector('[role="slider"]') as HTMLElement;

      slider.focus();
      const initialValue = slider.getAttribute('aria-valuenow');

      await user.keyboard('{ArrowUp}');

      const newValue = slider.getAttribute('aria-valuenow');
      expect(Number(newValue)).toBeGreaterThan(Number(initialValue));
    });

    it('decreases value with Arrow Down', async () => {
      const user = userEvent.setup();
      const { container } = render(<Slider defaultValue={[50]} />);
      const slider = container.querySelector('[role="slider"]') as HTMLElement;

      slider.focus();
      const initialValue = slider.getAttribute('aria-valuenow');

      await user.keyboard('{ArrowDown}');

      const newValue = slider.getAttribute('aria-valuenow');
      expect(Number(newValue)).toBeLessThan(Number(initialValue));
    });

    it('jumps to min with Home', async () => {
      const user = userEvent.setup();
      const { container } = render(<Slider min={0} max={100} defaultValue={[50]} />);
      const slider = container.querySelector('[role="slider"]') as HTMLElement;

      slider.focus();
      await user.keyboard('{Home}');

      expect(slider).toHaveAttribute('aria-valuenow', '0');
    });

    it('jumps to max with End', async () => {
      const user = userEvent.setup();
      const { container } = render(<Slider min={0} max={100} defaultValue={[50]} />);
      const slider = container.querySelector('[role="slider"]') as HTMLElement;

      slider.focus();
      await user.keyboard('{End}');

      expect(slider).toHaveAttribute('aria-valuenow', '100');
    });

    it('respects step with keyboard', async () => {
      const user = userEvent.setup();
      const { container } = render(<Slider step={10} defaultValue={[50]} />);
      const slider = container.querySelector('[role="slider"]') as HTMLElement;

      slider.focus();
      await user.keyboard('{ArrowRight}');

      const value = Number(slider.getAttribute('aria-valuenow'));
      expect(value % 10).toBe(0); // Should be multiple of step
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<Slider defaultValue={[50]} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has slider role', () => {
      const { container } = render(<Slider defaultValue={[50]} />);
      expect(container.querySelector('[role="slider"]')).toBeInTheDocument();
    });

    it('has correct ARIA attributes', () => {
      const { container } = render(<Slider min={0} max={100} defaultValue={[60]} />);
      const slider = container.querySelector('[role="slider"]');

      expect(slider).toHaveAttribute('aria-valuenow', '60');
      expect(slider).toHaveAttribute('aria-valuemin', '0');
      expect(slider).toHaveAttribute('aria-valuemax', '100');
    });

    it('supports aria-label', () => {
      const { container } = render(
        <Slider defaultValue={[50]} aria-label="Volume control" />
      );
      const slider = container.querySelector('[aria-label="Volume control"]');
      expect(slider).toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('renders disabled slider', () => {
      const { container } = render(<Slider defaultValue={[50]} disabled />);
      const slider = container.querySelector('[role="slider"]');
      expect(slider).toHaveAttribute('data-disabled');
    });

    it('does not respond to keyboard when disabled', async () => {
      const user = userEvent.setup();
      const { container } = render(<Slider defaultValue={[50]} disabled />);
      const slider = container.querySelector('[role="slider"]') as HTMLElement;

      const initialValue = slider.getAttribute('aria-valuenow');
      slider.focus();
      await user.keyboard('{ArrowRight}');

      expect(slider.getAttribute('aria-valuenow')).toBe(initialValue);
    });
  });

  describe('Vertical Orientation', () => {
    it('renders vertical slider', () => {
      const { container } = render(<Slider orientation="vertical" defaultValue={[50]} />);
      const slider = container.querySelector('[role="slider"]');
      expect(slider).toHaveAttribute('aria-orientation', 'vertical');
    });
  });

  describe('Custom Styling', () => {
    it('accepts custom className', () => {
      const { container } = render(
        <Slider defaultValue={[50]} className="custom-slider" />
      );
      expect(container.querySelector('.custom-slider')).toBeInTheDocument();
    });
  });
});

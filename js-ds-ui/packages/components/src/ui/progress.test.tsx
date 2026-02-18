import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Progress } from './progress';

expect.extend(toHaveNoViolations);

describe('Progress', () => {
  describe('Rendering', () => {
    it('renders progress bar', () => {
      const { container } = render(<Progress value={50} />);
      const progressBar = container.querySelector('[role="progressbar"]');
      expect(progressBar).toBeInTheDocument();
    });

    it('shows correct value', () => {
      const { container } = render(<Progress value={60} />);
      const progressBar = container.querySelector('[role="progressbar"]');
      expect(progressBar).toHaveAttribute('aria-valuenow', '60');
    });

    it('handles 0% value', () => {
      const { container } = render(<Progress value={0} />);
      const progressBar = container.querySelector('[role="progressbar"]');
      expect(progressBar).toHaveAttribute('aria-valuenow', '0');
    });

    it('handles 100% value', () => {
      const { container } = render(<Progress value={100} />);
      const progressBar = container.querySelector('[role="progressbar"]');
      expect(progressBar).toHaveAttribute('aria-valuenow', '100');
    });

    it('handles undefined value (indeterminate)', () => {
      const { container } = render(<Progress />);
      const progressBar = container.querySelector('[role="progressbar"]');
      expect(progressBar).toBeInTheDocument();
    });
  });

  describe('Progress Indicator', () => {
    it('indicator width reflects value', () => {
      const { container } = render(<Progress value={75} />);
      const indicator = container.querySelector('[data-state]');
      expect(indicator).toHaveStyle({ transform: 'translateX(-25%)' });
    });

    it('indicator at 0% is fully left', () => {
      const { container } = render(<Progress value={0} />);
      const indicator = container.querySelector('[data-state]');
      expect(indicator).toHaveStyle({ transform: 'translateX(-100%)' });
    });

    it('indicator at 100% is fully visible', () => {
      const { container } = render(<Progress value={100} />);
      const indicator = container.querySelector('[data-state]');
      expect(indicator).toHaveStyle({ transform: 'translateX(-0%)' });
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<Progress value={50} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has progressbar role', () => {
      const { container } = render(<Progress value={50} />);
      expect(container.querySelector('[role="progressbar"]')).toBeInTheDocument();
    });

    it('has aria-valuenow', () => {
      const { container } = render(<Progress value={65} />);
      const progressBar = container.querySelector('[role="progressbar"]');
      expect(progressBar).toHaveAttribute('aria-valuenow', '65');
    });

    it('has default aria-valuemin', () => {
      const { container } = render(<Progress value={50} />);
      const progressBar = container.querySelector('[role="progressbar"]');
      expect(progressBar).toHaveAttribute('aria-valuemin');
    });

    it('has default aria-valuemax', () => {
      const { container } = render(<Progress value={50} />);
      const progressBar = container.querySelector('[role="progressbar"]');
      expect(progressBar).toHaveAttribute('aria-valuemax');
    });

    it('supports custom max value', () => {
      const { container } = render(<Progress value={50} max={200} />);
      const progressBar = container.querySelector('[role="progressbar"]');
      expect(progressBar).toHaveAttribute('aria-valuemax', '200');
    });

    it('supports aria-label', () => {
      const { container } = render(<Progress value={50} aria-label="Upload progress" />);
      const progressBar = container.querySelector('[role="progressbar"]');
      expect(progressBar).toHaveAttribute('aria-label', 'Upload progress');
    });

    it('supports aria-labelledby', () => {
      render(
        <>
          <span id="progress-label">Loading files</span>
          <Progress value={50} aria-labelledby="progress-label" />
        </>
      );

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-labelledby', 'progress-label');
    });
  });

  describe('States', () => {
    it('shows complete state', () => {
      const { container } = render(<Progress value={100} />);
      const progress = container.querySelector('[data-state="complete"]');
      expect(progress).toBeInTheDocument();
    });

    it('shows loading state for partial values', () => {
      const { container } = render(<Progress value={50} />);
      const progress = container.querySelector('[data-state="loading"]');
      expect(progress).toBeInTheDocument();
    });

    it('shows indeterminate state when no value', () => {
      const { container } = render(<Progress />);
      const progress = container.querySelector('[data-state="indeterminate"]');
      expect(progress).toBeInTheDocument();
    });
  });

  describe('Dynamic Updates', () => {
    it('updates when value changes', () => {
      const { container, rerender } = render(<Progress value={25} />);

      let progressBar = container.querySelector('[role="progressbar"]');
      expect(progressBar).toHaveAttribute('aria-valuenow', '25');

      rerender(<Progress value={75} />);

      progressBar = container.querySelector('[role="progressbar"]');
      expect(progressBar).toHaveAttribute('aria-valuenow', '75');
    });

    it('transitions smoothly', () => {
      const { container } = render(<Progress value={50} />);
      const indicator = container.querySelector('[data-state]');
      expect(indicator).toHaveClass('transition-all');
    });
  });

  describe('Custom Styling', () => {
    it('accepts custom className', () => {
      const { container } = render(<Progress value={50} className="custom-progress" />);
      const progress = container.querySelector('.custom-progress');
      expect(progress).toBeInTheDocument();
    });

    it('accepts custom width', () => {
      const { container } = render(<Progress value={50} className="w-[200px]" />);
      const progress = container.querySelector('.w-\\[200px\\]');
      expect(progress).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles negative values', () => {
      const { container } = render(<Progress value={-10} />);
      const indicator = container.querySelector('[data-state]');
      // Should clamp to 0 or handle gracefully
      expect(indicator).toBeInTheDocument();
    });

    it('handles values over 100', () => {
      const { container } = render(<Progress value={150} />);
      const indicator = container.querySelector('[data-state]');
      // Should clamp to 100 or handle gracefully
      expect(indicator).toBeInTheDocument();
    });

    it('handles decimal values', () => {
      const { container } = render(<Progress value={33.33} />);
      const progressBar = container.querySelector('[role="progressbar"]');
      expect(progressBar).toHaveAttribute('aria-valuenow', '33.33');
    });
  });
});

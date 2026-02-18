import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './collapsible';
import { Button } from './button';

expect.extend(toHaveNoViolations);

describe('Collapsible', () => {
  const renderCollapsible = () => {
    return render(
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button>Toggle</Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div>Collapsible content goes here</div>
        </CollapsibleContent>
      </Collapsible>
    );
  };

  describe('Rendering', () => {
    it('renders trigger button', () => {
      renderCollapsible();
      expect(screen.getByText('Toggle')).toBeInTheDocument();
    });

    it('content is hidden by default', () => {
      renderCollapsible();
      expect(screen.queryByText('Collapsible content goes here')).not.toBeVisible();
    });

    it('renders with defaultOpen', () => {
      render(
        <Collapsible defaultOpen>
          <CollapsibleTrigger asChild>
            <Button>Toggle</Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div>Content</div>
          </CollapsibleContent>
        </Collapsible>
      );

      expect(screen.getByText('Content')).toBeVisible();
    });
  });

  describe('Interactions', () => {
    it('expands on trigger click', async () => {
      const user = userEvent.setup();
      renderCollapsible();

      await user.click(screen.getByText('Toggle'));
      expect(screen.getByText('Collapsible content goes here')).toBeVisible();
    });

    it('collapses on second click', async () => {
      const user = userEvent.setup();
      renderCollapsible();

      await user.click(screen.getByText('Toggle'));
      expect(screen.getByText('Collapsible content goes here')).toBeVisible();

      await user.click(screen.getByText('Toggle'));
      expect(screen.queryByText('Collapsible content goes here')).not.toBeVisible();
    });

    it('calls onOpenChange', async () => {
      const user = userEvent.setup();
      let open = false;
      const handleOpenChange = (value: boolean) => {
        open = value;
      };

      render(
        <Collapsible onOpenChange={handleOpenChange}>
          <CollapsibleTrigger asChild>
            <Button>Toggle</Button>
          </CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );

      await user.click(screen.getByText('Toggle'));
      expect(open).toBe(true);

      await user.click(screen.getByText('Toggle'));
      expect(open).toBe(false);
    });
  });

  describe('Keyboard Navigation', () => {
    it('trigger is focusable', async () => {
      const user = userEvent.setup();
      renderCollapsible();

      await user.tab();
      expect(screen.getByText('Toggle')).toHaveFocus();
    });

    it('expands with Enter', async () => {
      const user = userEvent.setup();
      renderCollapsible();

      screen.getByText('Toggle').focus();
      await user.keyboard('{Enter}');

      expect(screen.getByText('Collapsible content goes here')).toBeVisible();
    });

    it('expands with Space', async () => {
      const user = userEvent.setup();
      renderCollapsible();

      screen.getByText('Toggle').focus();
      await user.keyboard(' ');

      expect(screen.getByText('Collapsible content goes here')).toBeVisible();
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations (closed)', async () => {
      const { container } = renderCollapsible();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations (open)', async () => {
      const user = userEvent.setup();
      const { container } = renderCollapsible();

      await user.click(screen.getByText('Toggle'));
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has correct ARIA attributes', async () => {
      const user = userEvent.setup();
      renderCollapsible();

      const trigger = screen.getByText('Toggle');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');

      await user.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('Controlled Mode', () => {
    it('works in controlled mode', async () => {
      const user = userEvent.setup();
      const ControlledCollapsible = () => {
        const [open, setOpen] = React.useState(false);
        return (
          <Collapsible open={open} onOpenChange={setOpen}>
            <CollapsibleTrigger asChild>
              <Button>Toggle</Button>
            </CollapsibleTrigger>
            <CollapsibleContent>Controlled content</CollapsibleContent>
          </Collapsible>
        );
      };

      render(<ControlledCollapsible />);

      expect(screen.queryByText('Controlled content')).not.toBeVisible();

      await user.click(screen.getByText('Toggle'));
      expect(screen.getByText('Controlled content')).toBeVisible();
    });
  });

  describe('Disabled State', () => {
    it('renders disabled trigger', () => {
      render(
        <Collapsible disabled>
          <CollapsibleTrigger asChild>
            <Button>Toggle</Button>
          </CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );

      expect(screen.getByText('Toggle')).toBeDisabled();
    });

    it('does not expand when disabled', async () => {
      const user = userEvent.setup();
      render(
        <Collapsible disabled>
          <CollapsibleTrigger asChild>
            <Button>Toggle</Button>
          </CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );

      await user.click(screen.getByText('Toggle'));
      expect(screen.queryByText('Content')).not.toBeVisible();
    });
  });
});

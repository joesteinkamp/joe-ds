import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion';

expect.extend(toHaveNoViolations);

describe('Accordion', () => {
  const renderAccordion = (type: 'single' | 'multiple' = 'single') => {
    return render(
      <Accordion type={type} collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Section 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Section 2</AccordionTrigger>
          <AccordionContent>Content 2</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Section 3</AccordionTrigger>
          <AccordionContent>Content 3</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  };

  describe('Rendering', () => {
    it('renders all accordion items', () => {
      renderAccordion();
      expect(screen.getByText('Section 1')).toBeInTheDocument();
      expect(screen.getByText('Section 2')).toBeInTheDocument();
      expect(screen.getByText('Section 3')).toBeInTheDocument();
    });

    it('content is hidden by default', () => {
      renderAccordion();
      expect(screen.queryByText('Content 1')).not.toBeVisible();
    });

    it('renders with default expanded item', () => {
      render(
        <Accordion type="single" defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger>Section 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
        </Accordion>
      );
      expect(screen.getByText('Content 1')).toBeVisible();
    });
  });

  describe('Single Mode', () => {
    it('expands item on click', async () => {
      const user = userEvent.setup();
      renderAccordion('single');

      await user.click(screen.getByText('Section 1'));
      expect(screen.getByText('Content 1')).toBeVisible();
    });

    it('collapses current and expands new item', async () => {
      const user = userEvent.setup();
      renderAccordion('single');

      await user.click(screen.getByText('Section 1'));
      expect(screen.getByText('Content 1')).toBeVisible();

      await user.click(screen.getByText('Section 2'));
      expect(screen.queryByText('Content 1')).not.toBeVisible();
      expect(screen.getByText('Content 2')).toBeVisible();
    });

    it('collapses when clicking same item (collapsible)', async () => {
      const user = userEvent.setup();
      renderAccordion('single');

      await user.click(screen.getByText('Section 1'));
      expect(screen.getByText('Content 1')).toBeVisible();

      await user.click(screen.getByText('Section 1'));
      expect(screen.queryByText('Content 1')).not.toBeVisible();
    });
  });

  describe('Multiple Mode', () => {
    it('allows multiple items open', async () => {
      const user = userEvent.setup();
      renderAccordion('multiple');

      await user.click(screen.getByText('Section 1'));
      await user.click(screen.getByText('Section 2'));

      expect(screen.getByText('Content 1')).toBeVisible();
      expect(screen.getByText('Content 2')).toBeVisible();
    });

    it('toggles items independently', async () => {
      const user = userEvent.setup();
      renderAccordion('multiple');

      await user.click(screen.getByText('Section 1'));
      await user.click(screen.getByText('Section 2'));

      await user.click(screen.getByText('Section 1'));

      expect(screen.queryByText('Content 1')).not.toBeVisible();
      expect(screen.getByText('Content 2')).toBeVisible();
    });
  });

  describe('Keyboard Navigation', () => {
    it('focuses triggers with Tab', async () => {
      const user = userEvent.setup();
      renderAccordion();

      await user.tab();
      expect(screen.getByText('Section 1')).toHaveFocus();

      await user.tab();
      expect(screen.getByText('Section 2')).toHaveFocus();
    });

    it('expands with Enter', async () => {
      const user = userEvent.setup();
      renderAccordion();

      screen.getByText('Section 1').focus();
      await user.keyboard('{Enter}');

      expect(screen.getByText('Content 1')).toBeVisible();
    });

    it('expands with Space', async () => {
      const user = userEvent.setup();
      renderAccordion();

      screen.getByText('Section 1').focus();
      await user.keyboard(' ');

      expect(screen.getByText('Content 1')).toBeVisible();
    });

    it('navigates with Arrow keys', async () => {
      const user = userEvent.setup();
      renderAccordion();

      screen.getByText('Section 1').focus();

      await user.keyboard('{ArrowDown}');
      expect(screen.getByText('Section 2')).toHaveFocus();

      await user.keyboard('{ArrowDown}');
      expect(screen.getByText('Section 3')).toHaveFocus();

      await user.keyboard('{ArrowUp}');
      expect(screen.getByText('Section 2')).toHaveFocus();
    });

    it('navigates to first with Home', async () => {
      const user = userEvent.setup();
      renderAccordion();

      screen.getByText('Section 3').focus();
      await user.keyboard('{Home}');

      expect(screen.getByText('Section 1')).toHaveFocus();
    });

    it('navigates to last with End', async () => {
      const user = userEvent.setup();
      renderAccordion();

      screen.getByText('Section 1').focus();
      await user.keyboard('{End}');

      expect(screen.getByText('Section 3')).toHaveFocus();
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = renderAccordion();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has correct ARIA attributes', async () => {
      const user = userEvent.setup();
      renderAccordion();

      const trigger = screen.getByText('Section 1');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');

      await user.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    it('associates trigger with content', () => {
      renderAccordion();
      const trigger = screen.getByText('Section 1');
      expect(trigger).toHaveAttribute('aria-controls');
    });
  });

  describe('Disabled Items', () => {
    it('renders disabled items', () => {
      render(
        <Accordion type="single">
          <AccordionItem value="item-1" disabled>
            <AccordionTrigger>Disabled Section</AccordionTrigger>
            <AccordionContent>Content</AccordionContent>
          </AccordionItem>
        </Accordion>
      );

      const trigger = screen.getByText('Disabled Section');
      expect(trigger).toHaveAttribute('data-disabled');
    });

    it('does not expand disabled items', async () => {
      const user = userEvent.setup();
      render(
        <Accordion type="single">
          <AccordionItem value="item-1" disabled>
            <AccordionTrigger>Disabled</AccordionTrigger>
            <AccordionContent>Content</AccordionContent>
          </AccordionItem>
        </Accordion>
      );

      await user.click(screen.getByText('Disabled'));
      expect(screen.queryByText('Content')).not.toBeVisible();
    });
  });

  describe('Custom Styling', () => {
    it('accepts custom className', () => {
      const { container } = render(
        <Accordion type="single" className="custom-accordion">
          <AccordionItem value="item-1">
            <AccordionTrigger>Section</AccordionTrigger>
            <AccordionContent>Content</AccordionContent>
          </AccordionItem>
        </Accordion>
      );

      expect(container.querySelector('.custom-accordion')).toBeInTheDocument();
    });
  });
});

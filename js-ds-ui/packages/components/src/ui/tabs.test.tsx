import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

expect.extend(toHaveNoViolations);

describe('Tabs', () => {
  const renderTabs = () => {
    return render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          <TabsTrigger value="tab3">Tab 3</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
        <TabsContent value="tab3">Content 3</TabsContent>
      </Tabs>
    );
  };

  describe('Rendering', () => {
    it('renders all tab triggers', () => {
      renderTabs();
      expect(screen.getByText('Tab 1')).toBeInTheDocument();
      expect(screen.getByText('Tab 2')).toBeInTheDocument();
      expect(screen.getByText('Tab 3')).toBeInTheDocument();
    });

    it('shows default tab content', () => {
      renderTabs();
      expect(screen.getByText('Content 1')).toBeInTheDocument();
      expect(screen.queryByText('Content 2')).not.toBeInTheDocument();
    });

    it('marks default tab as selected', () => {
      renderTabs();
      const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
      expect(tab1).toHaveAttribute('data-state', 'active');
    });
  });

  describe('Interactions', () => {
    it('switches tabs on click', async () => {
      const user = userEvent.setup();
      renderTabs();

      await user.click(screen.getByText('Tab 2'));

      expect(screen.getByText('Content 2')).toBeInTheDocument();
      expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
    });

    it('updates active tab indicator', async () => {
      const user = userEvent.setup();
      renderTabs();

      const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
      const tab2 = screen.getByRole('tab', { name: 'Tab 2' });

      expect(tab1).toHaveAttribute('data-state', 'active');
      expect(tab2).toHaveAttribute('data-state', 'inactive');

      await user.click(tab2);

      expect(tab1).toHaveAttribute('data-state', 'inactive');
      expect(tab2).toHaveAttribute('data-state', 'active');
    });

    it('calls onValueChange callback', async () => {
      const user = userEvent.setup();
      let value = '';
      const handleChange = (val: string) => {
        value = val;
      };

      render(
        <Tabs onValueChange={handleChange}>
          <TabsList>
            <TabsTrigger value="a">Tab A</TabsTrigger>
            <TabsTrigger value="b">Tab B</TabsTrigger>
          </TabsList>
          <TabsContent value="a">Content A</TabsContent>
          <TabsContent value="b">Content B</TabsContent>
        </Tabs>
      );

      await user.click(screen.getByText('Tab B'));
      expect(value).toBe('b');
    });
  });

  describe('Keyboard Navigation', () => {
    it('navigates with Arrow keys', async () => {
      const user = userEvent.setup();
      renderTabs();

      const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
      const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
      const tab3 = screen.getByRole('tab', { name: 'Tab 3' });

      tab1.focus();

      await user.keyboard('{ArrowRight}');
      expect(tab2).toHaveFocus();
      expect(screen.getByText('Content 2')).toBeInTheDocument();

      await user.keyboard('{ArrowRight}');
      expect(tab3).toHaveFocus();
      expect(screen.getByText('Content 3')).toBeInTheDocument();

      await user.keyboard('{ArrowLeft}');
      expect(tab2).toHaveFocus();
      expect(screen.getByText('Content 2')).toBeInTheDocument();
    });

    it('wraps around with Arrow keys', async () => {
      const user = userEvent.setup();
      renderTabs();

      const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
      const tab3 = screen.getByRole('tab', { name: 'Tab 3' });

      tab1.focus();

      await user.keyboard('{ArrowLeft}');
      expect(tab3).toHaveFocus();

      await user.keyboard('{ArrowRight}');
      expect(tab1).toHaveFocus();
    });

    it('activates tab with Enter', async () => {
      const user = userEvent.setup();
      renderTabs();

      screen.getByText('Tab 2').focus();
      await user.keyboard('{Enter}');

      expect(screen.getByText('Content 2')).toBeInTheDocument();
    });

    it('activates tab with Space', async () => {
      const user = userEvent.setup();
      renderTabs();

      screen.getByText('Tab 3').focus();
      await user.keyboard(' ');

      expect(screen.getByText('Content 3')).toBeInTheDocument();
    });

    it('navigates to first tab with Home key', async () => {
      const user = userEvent.setup();
      renderTabs();

      const tab3 = screen.getByRole('tab', { name: 'Tab 3' });
      const tab1 = screen.getByRole('tab', { name: 'Tab 1' });

      tab3.focus();
      await user.keyboard('{Home}');

      expect(tab1).toHaveFocus();
    });

    it('navigates to last tab with End key', async () => {
      const user = userEvent.setup();
      renderTabs();

      const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
      const tab3 = screen.getByRole('tab', { name: 'Tab 3' });

      tab1.focus();
      await user.keyboard('{End}');

      expect(tab3).toHaveFocus();
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = renderTabs();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has correct ARIA attributes', () => {
      renderTabs();
      const tablist = screen.getByRole('tablist');
      const tabs = screen.getAllByRole('tab');

      expect(tablist).toBeInTheDocument();
      expect(tabs).toHaveLength(3);

      tabs.forEach((tab) => {
        expect(tab).toHaveAttribute('aria-selected');
      });
    });

    it('associates tabs with tabpanels', () => {
      renderTabs();
      const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
      const panel1 = screen.getByRole('tabpanel');

      expect(tab1).toHaveAttribute('aria-controls');
      expect(panel1).toHaveAttribute('aria-labelledby');
    });
  });

  describe('Disabled Tabs', () => {
    it('renders disabled tabs', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2" disabled>
              Tab 2 (disabled)
            </TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );

      const disabledTab = screen.getByText('Tab 2 (disabled)');
      expect(disabledTab).toHaveAttribute('data-disabled', 'true');
    });

    it('does not activate disabled tabs', async () => {
      const user = userEvent.setup();
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2" disabled>
              Tab 2
            </TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );

      await user.click(screen.getByText('Tab 2'));

      expect(screen.getByText('Content 1')).toBeInTheDocument();
      expect(screen.queryByText('Content 2')).not.toBeInTheDocument();
    });
  });

  describe('Controlled Mode', () => {
    it('works in controlled mode', async () => {
      const user = userEvent.setup();
      const ControlledTabs = () => {
        const [value, setValue] = React.useState('tab1');
        return (
          <Tabs value={value} onValueChange={setValue}>
            <TabsList>
              <TabsTrigger value="tab1">Tab 1</TabsTrigger>
              <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1">Content 1</TabsContent>
            <TabsContent value="tab2">Content 2</TabsContent>
          </Tabs>
        );
      };

      render(<ControlledTabs />);

      expect(screen.getByText('Content 1')).toBeInTheDocument();

      await user.click(screen.getByText('Tab 2'));

      expect(screen.getByText('Content 2')).toBeInTheDocument();
    });
  });

  describe('Custom Styling', () => {
    it('accepts custom className on TabsList', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList className="custom-list">
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content</TabsContent>
        </Tabs>
      );

      expect(screen.getByRole('tablist')).toHaveClass('custom-list');
    });

    it('accepts custom className on TabsTrigger', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1" className="custom-trigger">
              Tab 1
            </TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content</TabsContent>
        </Tabs>
      );

      expect(screen.getByRole('tab')).toHaveClass('custom-trigger');
    });
  });
});

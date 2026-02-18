import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { RadioGroup, RadioGroupItem } from './radio-group';
import { Label } from './label';

expect.extend(toHaveNoViolations);

describe('RadioGroup', () => {
  const renderRadioGroup = () => {
    return render(
      <RadioGroup defaultValue="option1">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option1" id="r1" />
          <Label htmlFor="r1">Option 1</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option2" id="r2" />
          <Label htmlFor="r2">Option 2</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option3" id="r3" />
          <Label htmlFor="r3">Option 3</Label>
        </div>
      </RadioGroup>
    );
  };

  describe('Rendering', () => {
    it('renders all radio items', () => {
      renderRadioGroup();
      const radios = screen.getAllByRole('radio');
      expect(radios).toHaveLength(3);
    });

    it('renders with default value selected', () => {
      renderRadioGroup();
      const option1 = screen.getByRole('radio', { name: 'Option 1' });
      expect(option1).toBeChecked();
    });

    it('renders labels correctly', () => {
      renderRadioGroup();
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
      expect(screen.getByText('Option 3')).toBeInTheDocument();
    });

    it('renders disabled items', () => {
      render(
        <RadioGroup>
          <RadioGroupItem value="option1" disabled />
          <RadioGroupItem value="option2" />
        </RadioGroup>
      );
      const radios = screen.getAllByRole('radio');
      expect(radios[0]).toBeDisabled();
      expect(radios[1]).not.toBeDisabled();
    });
  });

  describe('Interactions', () => {
    it('selects radio on click', async () => {
      const user = userEvent.setup();
      renderRadioGroup();

      const option2 = screen.getByRole('radio', { name: 'Option 2' });
      await user.click(option2);

      expect(option2).toBeChecked();
      expect(screen.getByRole('radio', { name: 'Option 1' })).not.toBeChecked();
    });

    it('calls onValueChange callback', async () => {
      const user = userEvent.setup();
      let value = '';
      const handleChange = (val: string) => {
        value = val;
      };

      render(
        <RadioGroup onValueChange={handleChange}>
          <RadioGroupItem value="a" aria-label="Option A" />
          <RadioGroupItem value="b" aria-label="Option B" />
        </RadioGroup>
      );

      await user.click(screen.getByRole('radio', { name: 'Option A' }));
      expect(value).toBe('a');

      await user.click(screen.getByRole('radio', { name: 'Option B' }));
      expect(value).toBe('b');
    });

    it('does not select disabled item', async () => {
      const user = userEvent.setup();
      render(
        <RadioGroup>
          <RadioGroupItem value="option1" aria-label="Option 1" />
          <RadioGroupItem value="option2" disabled aria-label="Option 2" />
        </RadioGroup>
      );

      const disabled = screen.getByRole('radio', { name: 'Option 2' });
      await user.click(disabled);
      expect(disabled).not.toBeChecked();
    });

    it('only one radio can be selected at a time', async () => {
      const user = userEvent.setup();
      renderRadioGroup();

      const option1 = screen.getByRole('radio', { name: 'Option 1' });
      const option2 = screen.getByRole('radio', { name: 'Option 2' });
      const option3 = screen.getByRole('radio', { name: 'Option 3' });

      expect(option1).toBeChecked();

      await user.click(option2);
      expect(option2).toBeChecked();
      expect(option1).not.toBeChecked();
      expect(option3).not.toBeChecked();

      await user.click(option3);
      expect(option3).toBeChecked();
      expect(option1).not.toBeChecked();
      expect(option2).not.toBeChecked();
    });
  });

  describe('Keyboard Navigation', () => {
    it('focuses radio group with Tab', async () => {
      const user = userEvent.setup();
      renderRadioGroup();

      await user.tab();
      const option1 = screen.getByRole('radio', { name: 'Option 1' });
      expect(option1).toHaveFocus();
    });

    it('navigates with Arrow keys', async () => {
      const user = userEvent.setup();
      renderRadioGroup();

      const option1 = screen.getByRole('radio', { name: 'Option 1' });
      const option2 = screen.getByRole('radio', { name: 'Option 2' });
      const option3 = screen.getByRole('radio', { name: 'Option 3' });

      option1.focus();

      await user.keyboard('{ArrowDown}');
      expect(option2).toBeChecked();
      expect(option2).toHaveFocus();

      await user.keyboard('{ArrowDown}');
      expect(option3).toBeChecked();
      expect(option3).toHaveFocus();

      await user.keyboard('{ArrowUp}');
      expect(option2).toBeChecked();
      expect(option2).toHaveFocus();
    });

    it('wraps around with Arrow keys', async () => {
      const user = userEvent.setup();
      renderRadioGroup();

      const option1 = screen.getByRole('radio', { name: 'Option 1' });
      const option3 = screen.getByRole('radio', { name: 'Option 3' });

      option1.focus();

      await user.keyboard('{ArrowUp}');
      expect(option3).toHaveFocus();

      await user.keyboard('{ArrowDown}');
      expect(option1).toHaveFocus();
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(
        <RadioGroup aria-label="Choose option">
          <RadioGroupItem value="option1" aria-label="Option 1" />
          <RadioGroupItem value="option2" aria-label="Option 2" />
        </RadioGroup>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations (with labels)', async () => {
      const { container } = renderRadioGroup();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('supports aria-label on RadioGroup', () => {
      render(
        <RadioGroup aria-label="Select option">
          <RadioGroupItem value="a" aria-label="Option A" />
        </RadioGroup>
      );
      expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-label', 'Select option');
    });

    it('associates items with labels via htmlFor/id', () => {
      renderRadioGroup();
      expect(screen.getByLabelText('Option 1')).toBeInTheDocument();
      expect(screen.getByLabelText('Option 2')).toBeInTheDocument();
      expect(screen.getByLabelText('Option 3')).toBeInTheDocument();
    });
  });

  describe('Custom Styling', () => {
    it('accepts custom className on RadioGroup', () => {
      const { container } = render(
        <RadioGroup className="custom-group">
          <RadioGroupItem value="a" />
        </RadioGroup>
      );
      expect(container.querySelector('.custom-group')).toBeInTheDocument();
    });

    it('accepts custom className on RadioGroupItem', () => {
      render(<RadioGroupItem value="a" className="custom-item" />);
      const radio = screen.getByRole('radio');
      expect(radio).toHaveClass('custom-item');
    });
  });
});

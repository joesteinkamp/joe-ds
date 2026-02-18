import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import * as React from 'react';
import { DataTable, type DataTableColumn } from './data-table';

expect.extend(toHaveNoViolations);

interface TestRow {
  id: string;
  name: string;
  email: string;
  status: string;
}

const columns: DataTableColumn<TestRow>[] = [
  { id: 'name', header: 'Name', accessorKey: 'name', sortable: true },
  { id: 'email', header: 'Email', accessorKey: 'email' },
  { id: 'status', header: 'Status', accessorKey: 'status', sortable: true },
];

const data: TestRow[] = [
  { id: '1', name: 'Alice', email: 'alice@example.com', status: 'Active' },
  { id: '2', name: 'Bob', email: 'bob@example.com', status: 'Inactive' },
  { id: '3', name: 'Charlie', email: 'charlie@example.com', status: 'Active' },
  { id: '4', name: 'Diana', email: 'diana@example.com', status: 'Pending' },
  { id: '5', name: 'Eve', email: 'eve@example.com', status: 'Active' },
];

describe('DataTable', () => {
  describe('Rendering', () => {
    it('renders table with columns and data', () => {
      render(<DataTable columns={columns} data={data} />);

      // Headers
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();

      // Data
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('bob@example.com')).toBeInTheDocument();
      expect(screen.getByText('Charlie')).toBeInTheDocument();
    });

    it('renders correct number of rows', () => {
      render(<DataTable columns={columns} data={data} />);
      const rows = screen.getAllByRole('row');
      // 1 header + 5 data rows = 6
      expect(rows.length).toBe(6);
    });

    it('renders table element', () => {
      render(<DataTable columns={columns} data={data} />);
      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });

  describe('Empty state', () => {
    it('shows "No results." when data is empty', () => {
      render(<DataTable columns={columns} data={[]} />);
      expect(screen.getByText('No results.')).toBeInTheDocument();
    });

    it('renders header row even when data is empty', () => {
      render(<DataTable columns={columns} data={[]} />);
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
    });
  });

  describe('Sorting', () => {
    it('sortable columns show sort indicator', () => {
      const { container } = render(<DataTable columns={columns} data={data} />);
      // Sortable columns (Name and Status) should have ArrowUpDown icon initially
      // The unsorted indicator is an svg with opacity-50
      const nameHeader = screen.getByText('Name').closest('th')!;
      const svgs = nameHeader.querySelectorAll('svg');
      expect(svgs.length).toBeGreaterThan(0);
    });

    it('clicking a sortable column sorts ascending', async () => {
      const user = userEvent.setup();
      render(<DataTable columns={columns} data={data} />);

      await user.click(screen.getByText('Name'));

      const rows = screen.getAllByRole('row');
      // Skip header row (index 0), first data row should be Alice (ascending)
      const firstDataRow = rows[1];
      expect(within(firstDataRow).getByText('Alice')).toBeInTheDocument();
    });

    it('clicking a sortable column twice toggles to descending', async () => {
      const user = userEvent.setup();
      render(<DataTable columns={columns} data={data} />);

      await user.click(screen.getByText('Name'));
      await user.click(screen.getByText('Name'));

      const rows = screen.getAllByRole('row');
      // First data row should be Eve (descending)
      const firstDataRow = rows[1];
      expect(within(firstDataRow).getByText('Eve')).toBeInTheDocument();
    });

    it('non-sortable columns do not sort on click', async () => {
      const user = userEvent.setup();
      render(<DataTable columns={columns} data={data} />);

      // Email is not sortable - clicking should not change order
      const emailHeader = screen.getByText('Email');
      const emailTh = emailHeader.closest('th')!;
      const svgsBefore = emailTh.querySelectorAll('svg');
      expect(svgsBefore.length).toBe(0);

      await user.click(emailHeader);

      // Data order should remain the same
      const rows = screen.getAllByRole('row');
      const firstDataRow = rows[1];
      expect(within(firstDataRow).getByText('Alice')).toBeInTheDocument();
    });
  });

  describe('Pagination', () => {
    it('shows page count', () => {
      render(<DataTable columns={columns} data={data} pageSize={2} />);
      expect(screen.getByText(/Page 1 of 3/)).toBeInTheDocument();
    });

    it('shows Previous and Next buttons', () => {
      render(<DataTable columns={columns} data={data} pageSize={2} />);
      expect(screen.getByText('Previous')).toBeInTheDocument();
      expect(screen.getByText('Next')).toBeInTheDocument();
    });

    it('Previous button is disabled on first page', () => {
      render(<DataTable columns={columns} data={data} pageSize={2} />);
      expect(screen.getByText('Previous')).toBeDisabled();
    });

    it('Next button navigates to next page', async () => {
      const user = userEvent.setup();
      render(<DataTable columns={columns} data={data} pageSize={2} />);

      // Page 1: Alice, Bob
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
      expect(screen.queryByText('Charlie')).not.toBeInTheDocument();

      await user.click(screen.getByText('Next'));

      // Page 2: Charlie, Diana
      expect(screen.getByText('Charlie')).toBeInTheDocument();
      expect(screen.getByText('Diana')).toBeInTheDocument();
      expect(screen.queryByText('Alice')).not.toBeInTheDocument();
      expect(screen.getByText(/Page 2 of 3/)).toBeInTheDocument();
    });

    it('Previous button navigates back', async () => {
      const user = userEvent.setup();
      render(<DataTable columns={columns} data={data} pageSize={2} />);

      await user.click(screen.getByText('Next'));
      expect(screen.getByText(/Page 2 of 3/)).toBeInTheDocument();

      await user.click(screen.getByText('Previous'));
      expect(screen.getByText(/Page 1 of 3/)).toBeInTheDocument();
      expect(screen.getByText('Alice')).toBeInTheDocument();
    });

    it('Next button is disabled on last page', async () => {
      const user = userEvent.setup();
      render(<DataTable columns={columns} data={data} pageSize={2} />);

      await user.click(screen.getByText('Next'));
      await user.click(screen.getByText('Next'));

      expect(screen.getByText(/Page 3 of 3/)).toBeInTheDocument();
      expect(screen.getByText('Next')).toBeDisabled();
    });

    it('does not show pagination when pageSize is 0', () => {
      render(<DataTable columns={columns} data={data} pageSize={0} />);
      expect(screen.queryByText('Previous')).not.toBeInTheDocument();
      expect(screen.queryByText('Next')).not.toBeInTheDocument();
    });

    it('does not show pagination when all data fits in one page', () => {
      render(<DataTable columns={columns} data={data} pageSize={10} />);
      expect(screen.queryByText('Previous')).not.toBeInTheDocument();
      expect(screen.queryByText('Next')).not.toBeInTheDocument();
    });
  });

  describe('Row selection', () => {
    it('shows checkboxes when selectable is true', () => {
      render(<DataTable columns={columns} data={data} selectable />);
      const checkboxes = screen.getAllByRole('checkbox');
      // 1 select-all + 5 row checkboxes = 6
      expect(checkboxes.length).toBe(6);
    });

    it('does not show checkboxes when selectable is false', () => {
      render(<DataTable columns={columns} data={data} />);
      expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    });

    it('clicking a row checkbox selects it', async () => {
      const user = userEvent.setup();
      let selected = new Set<number>();
      const handleChange = (s: Set<number>) => {
        selected = s;
      };

      render(
        <DataTable
          columns={columns}
          data={data}
          selectable
          selectedRows={new Set()}
          onSelectionChange={handleChange}
        />
      );

      const checkboxes = screen.getAllByRole('checkbox');
      // First checkbox is select-all, second is row 0
      await user.click(checkboxes[1]);

      expect(selected.has(0)).toBe(true);
      expect(selected.size).toBe(1);
    });

    it('clicking a selected row checkbox deselects it', async () => {
      const user = userEvent.setup();
      let selected = new Set<number>([0]);
      const handleChange = (s: Set<number>) => {
        selected = s;
      };

      render(
        <DataTable
          columns={columns}
          data={data}
          selectable
          selectedRows={selected}
          onSelectionChange={handleChange}
        />
      );

      const checkboxes = screen.getAllByRole('checkbox');
      await user.click(checkboxes[1]); // row 0 checkbox

      expect(selected.has(0)).toBe(false);
    });

    it('select all checkbox selects all rows', async () => {
      const user = userEvent.setup();
      let selected = new Set<number>();
      const handleChange = (s: Set<number>) => {
        selected = s;
      };

      render(
        <DataTable
          columns={columns}
          data={data}
          selectable
          selectedRows={new Set()}
          onSelectionChange={handleChange}
        />
      );

      const selectAll = screen.getByLabelText('Select all rows');
      await user.click(selectAll);

      expect(selected.size).toBe(5);
    });

    it('select all checkbox deselects all when all are selected', async () => {
      const user = userEvent.setup();
      let selected = new Set<number>([0, 1, 2, 3, 4]);
      const handleChange = (s: Set<number>) => {
        selected = s;
      };

      render(
        <DataTable
          columns={columns}
          data={data}
          selectable
          selectedRows={selected}
          onSelectionChange={handleChange}
        />
      );

      const selectAll = screen.getByLabelText('Select all rows');
      await user.click(selectAll);

      expect(selected.size).toBe(0);
    });
  });

  describe('Custom cell renderer', () => {
    it('renders custom cell content', () => {
      const customColumns: DataTableColumn<TestRow>[] = [
        {
          id: 'name',
          header: 'Name',
          cell: (row) => <strong data-testid="custom-cell">{row.name}</strong>,
        },
      ];

      render(<DataTable columns={customColumns} data={data} />);
      const customCells = screen.getAllByTestId('custom-cell');
      expect(customCells.length).toBe(5);
      expect(customCells[0]).toHaveTextContent('Alice');
    });
  });

  describe('Custom className', () => {
    it('merges custom className', () => {
      const { container } = render(
        <DataTable columns={columns} data={data} className="custom-table" />
      );
      expect(container.firstChild).toHaveClass('custom-table');
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(
        <DataTable columns={columns} data={data} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with selectable rows', async () => {
      const { container } = render(
        <DataTable columns={columns} data={data} selectable />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('select all checkbox has accessible label', () => {
      render(<DataTable columns={columns} data={data} selectable />);
      expect(screen.getByLabelText('Select all rows')).toBeInTheDocument();
    });

    it('row checkboxes have accessible labels', () => {
      render(<DataTable columns={columns} data={data} selectable />);
      expect(screen.getByLabelText('Select row 1')).toBeInTheDocument();
      expect(screen.getByLabelText('Select row 2')).toBeInTheDocument();
    });
  });
});

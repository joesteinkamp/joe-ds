import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from './table';

expect.extend(toHaveNoViolations);

describe('Table', () => {
  const renderTable = () => {
    return render(
      <Table>
        <TableCaption>A list of recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>INV001</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>$250.00</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>INV002</TableCell>
            <TableCell>Pending</TableCell>
            <TableCell>$150.00</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell>$400.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    );
  };

  describe('Rendering', () => {
    it('renders a complete table with all sub-components', () => {
      renderTable();
      expect(screen.getByText('A list of recent invoices.')).toBeInTheDocument();
      expect(screen.getByText('Invoice')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Amount')).toBeInTheDocument();
      expect(screen.getByText('INV001')).toBeInTheDocument();
      expect(screen.getByText('Paid')).toBeInTheDocument();
      expect(screen.getByText('$250.00')).toBeInTheDocument();
      expect(screen.getByText('INV002')).toBeInTheDocument();
      expect(screen.getByText('Pending')).toBeInTheDocument();
      expect(screen.getByText('$150.00')).toBeInTheDocument();
      expect(screen.getByText('Total')).toBeInTheDocument();
      expect(screen.getByText('$400.00')).toBeInTheDocument();
    });

    it('renders correct HTML table element', () => {
      renderTable();
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('renders correct thead element', () => {
      const { container } = renderTable();
      const thead = container.querySelector('thead');
      expect(thead).toBeInTheDocument();
    });

    it('renders correct tbody element', () => {
      const { container } = renderTable();
      const tbody = container.querySelector('tbody');
      expect(tbody).toBeInTheDocument();
    });

    it('renders correct tfoot element', () => {
      const { container } = renderTable();
      const tfoot = container.querySelector('tfoot');
      expect(tfoot).toBeInTheDocument();
    });

    it('renders correct tr elements', () => {
      renderTable();
      const rows = screen.getAllByRole('row');
      // 1 header row + 2 body rows + 1 footer row = 4
      expect(rows.length).toBe(4);
    });

    it('renders correct th elements', () => {
      renderTable();
      const headers = screen.getAllByRole('columnheader');
      expect(headers.length).toBe(3);
    });

    it('renders correct td elements', () => {
      renderTable();
      const cells = screen.getAllByRole('cell');
      // 2 body rows * 3 cells + 2 footer cells = 8
      expect(cells.length).toBe(8);
    });

    it('renders caption element', () => {
      const { container } = renderTable();
      const caption = container.querySelector('caption');
      expect(caption).toBeInTheDocument();
      expect(caption).toHaveTextContent('A list of recent invoices.');
    });
  });

  describe('Custom className', () => {
    it('merges custom className on Table', () => {
      render(
        <Table className="custom-table">
          <TableBody>
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      expect(screen.getByRole('table')).toHaveClass('custom-table');
    });

    it('merges custom className on TableHeader', () => {
      const { container } = render(
        <Table>
          <TableHeader className="custom-header">
            <TableRow>
              <TableHead>Head</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      );
      const thead = container.querySelector('thead');
      expect(thead).toHaveClass('custom-header');
    });

    it('merges custom className on TableBody', () => {
      const { container } = render(
        <Table>
          <TableBody className="custom-body">
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      const tbody = container.querySelector('tbody');
      expect(tbody).toHaveClass('custom-body');
    });

    it('merges custom className on TableFooter', () => {
      const { container } = render(
        <Table>
          <TableFooter className="custom-footer">
            <TableRow>
              <TableCell>Footer</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      );
      const tfoot = container.querySelector('tfoot');
      expect(tfoot).toHaveClass('custom-footer');
    });

    it('merges custom className on TableRow', () => {
      render(
        <Table>
          <TableBody>
            <TableRow className="custom-row">
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      const row = screen.getByRole('row');
      expect(row).toHaveClass('custom-row');
    });

    it('merges custom className on TableHead', () => {
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="custom-head">Head</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      );
      expect(screen.getByRole('columnheader')).toHaveClass('custom-head');
    });

    it('merges custom className on TableCell', () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="custom-cell">Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      expect(screen.getByRole('cell')).toHaveClass('custom-cell');
    });

    it('merges custom className on TableCaption', () => {
      const { container } = render(
        <Table>
          <TableCaption className="custom-caption">Caption</TableCaption>
          <TableBody>
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      const caption = container.querySelector('caption');
      expect(caption).toHaveClass('custom-caption');
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = renderTable();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('uses semantic table markup', () => {
      const { container } = renderTable();
      expect(container.querySelector('table')).toBeInTheDocument();
      expect(container.querySelector('thead')).toBeInTheDocument();
      expect(container.querySelector('tbody')).toBeInTheDocument();
      expect(container.querySelector('tfoot')).toBeInTheDocument();
      expect(container.querySelector('caption')).toBeInTheDocument();
      expect(container.querySelectorAll('th').length).toBe(3);
      expect(container.querySelectorAll('td').length).toBe(8);
    });
  });
});

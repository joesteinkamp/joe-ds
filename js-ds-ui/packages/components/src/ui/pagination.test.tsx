import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from './pagination';

expect.extend(toHaveNoViolations);

describe('Pagination', () => {
  const renderFullPagination = () =>
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );

  describe('Rendering', () => {
    it('renders with role="navigation" and aria-label="pagination"', () => {
      renderFullPagination();
      const nav = screen.getByRole('navigation', { name: /pagination/i });
      expect(nav).toBeInTheDocument();
    });

    it('renders PaginationContent as a ul element', () => {
      renderFullPagination();
      const list = screen.getByRole('list');
      expect(list).toBeInTheDocument();
      expect(list.tagName).toBe('UL');
    });

    it('renders PaginationLink with aria-current="page" when isActive', () => {
      renderFullPagination();
      const activeLink = screen.getByText('1');
      expect(activeLink).toHaveAttribute('aria-current', 'page');
    });

    it('does not render aria-current on inactive PaginationLink', () => {
      renderFullPagination();
      const inactiveLink = screen.getByText('2');
      expect(inactiveLink).not.toHaveAttribute('aria-current');
    });

    it('renders PaginationPrevious with correct text', () => {
      renderFullPagination();
      expect(screen.getByText('Previous')).toBeInTheDocument();
    });

    it('renders PaginationNext with correct text', () => {
      renderFullPagination();
      expect(screen.getByText('Next')).toBeInTheDocument();
    });

    it('renders PaginationPrevious with aria-label', () => {
      renderFullPagination();
      const prev = screen.getByLabelText(/go to previous page/i);
      expect(prev).toBeInTheDocument();
    });

    it('renders PaginationNext with aria-label', () => {
      renderFullPagination();
      const next = screen.getByLabelText(/go to next page/i);
      expect(next).toBeInTheDocument();
    });

    it('renders PaginationEllipsis with aria-hidden', () => {
      const { container } = renderFullPagination();
      const ellipsis = container.querySelector('span[aria-hidden]');
      expect(ellipsis).toBeInTheDocument();
    });

    it('renders PaginationEllipsis with "More pages" sr-only text', () => {
      renderFullPagination();
      expect(screen.getByText('More pages')).toBeInTheDocument();
    });
  });

  describe('Custom className', () => {
    it('merges custom className on Pagination', () => {
      render(
        <Pagination className="custom-pagination">
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      const nav = screen.getByRole('navigation');
      expect(nav).toHaveClass('custom-pagination');
    });

    it('merges custom className on PaginationContent', () => {
      render(
        <Pagination>
          <PaginationContent className="custom-content">
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      const list = screen.getByRole('list');
      expect(list).toHaveClass('custom-content');
    });

    it('merges custom className on PaginationItem', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem className="custom-item" data-testid="item">
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      const item = screen.getByTestId('item');
      expect(item).toHaveClass('custom-item');
    });

    it('merges custom className on PaginationLink', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="#" className="custom-link">
                1
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      const link = screen.getByText('1');
      expect(link).toHaveClass('custom-link');
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations for a complete pagination', async () => {
      const { container } = renderFullPagination();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations for minimal pagination', async () => {
      const { container } = render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                1
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});

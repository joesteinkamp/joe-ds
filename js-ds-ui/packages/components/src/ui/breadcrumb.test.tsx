import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './breadcrumb';

expect.extend(toHaveNoViolations);

describe('Breadcrumb', () => {
  const renderFullBreadcrumb = () =>
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/products">Products</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Current Page</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );

  describe('Rendering', () => {
    it('renders with aria-label="breadcrumb" on nav', () => {
      renderFullBreadcrumb();
      const nav = screen.getByRole('navigation', { name: /breadcrumb/i });
      expect(nav).toBeInTheDocument();
      expect(nav.tagName).toBe('NAV');
    });

    it('renders BreadcrumbList as an ol element', () => {
      renderFullBreadcrumb();
      const list = screen.getByRole('list');
      expect(list).toBeInTheDocument();
      expect(list.tagName).toBe('OL');
    });

    it('renders BreadcrumbLink as an anchor element', () => {
      renderFullBreadcrumb();
      const link = screen.getByText('Home');
      expect(link.tagName).toBe('A');
      expect(link).toHaveAttribute('href', '/');
    });

    it('renders BreadcrumbPage with aria-current="page"', () => {
      renderFullBreadcrumb();
      const page = screen.getByText('Current Page');
      expect(page).toHaveAttribute('aria-current', 'page');
    });

    it('renders BreadcrumbPage with aria-disabled="true"', () => {
      renderFullBreadcrumb();
      const page = screen.getByText('Current Page');
      expect(page).toHaveAttribute('aria-disabled', 'true');
    });

    it('renders BreadcrumbSeparator with aria-hidden="true"', () => {
      const { container } = renderFullBreadcrumb();
      const separators = container.querySelectorAll('[aria-hidden="true"]');
      expect(separators.length).toBeGreaterThan(0);
    });

    it('renders BreadcrumbSeparator with ChevronRight by default', () => {
      const { container } = renderFullBreadcrumb();
      const separators = container.querySelectorAll('li[role="presentation"]');
      separators.forEach((sep) => {
        const svg = sep.querySelector('svg');
        expect(svg).toBeInTheDocument();
      });
    });

    it('renders custom separator children', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );

      expect(screen.getByText('/')).toBeInTheDocument();
    });
  });

  describe('Custom className', () => {
    it('merges custom className on BreadcrumbList', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList className="custom-list">
            <BreadcrumbItem>
              <BreadcrumbPage>Page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );
      const list = screen.getByRole('list');
      expect(list).toHaveClass('custom-list');
    });

    it('merges custom className on BreadcrumbItem', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="custom-item" data-testid="item">
              <BreadcrumbPage>Page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );
      const item = screen.getByTestId('item');
      expect(item).toHaveClass('custom-item');
    });

    it('merges custom className on BreadcrumbLink', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="custom-link">Home</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );
      const link = screen.getByText('Home');
      expect(link).toHaveClass('custom-link');
    });

    it('merges custom className on BreadcrumbPage', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage className="custom-page">Current</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );
      const page = screen.getByText('Current');
      expect(page).toHaveClass('custom-page');
    });

    it('merges custom className on BreadcrumbSeparator', () => {
      const { container } = render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="custom-sep" />
            <BreadcrumbItem>
              <BreadcrumbPage>Page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );
      const sep = container.querySelector('.custom-sep');
      expect(sep).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations for a complete breadcrumb', async () => {
      const { container } = renderFullBreadcrumb();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations for a minimal breadcrumb', async () => {
      const { container } = render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Home</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});

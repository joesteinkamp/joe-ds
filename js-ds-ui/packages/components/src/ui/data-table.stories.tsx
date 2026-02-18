import type { Meta, StoryObj } from '@storybook/react';
import { DataTable, DataTableColumn } from './data-table';

type Payment = {
  id: string;
  amount: string;
  status: string;
  email: string;
};

const columns: DataTableColumn<Payment>[] = [
  { id: 'id', header: 'ID', accessorKey: 'id' },
  { id: 'status', header: 'Status', accessorKey: 'status', sortable: true },
  { id: 'email', header: 'Email', accessorKey: 'email', sortable: true },
  { id: 'amount', header: 'Amount', accessorKey: 'amount', sortable: true, className: 'text-right' },
];

const data: Payment[] = [
  { id: 'PAY-001', amount: '$316.00', status: 'Success', email: 'ken@example.com' },
  { id: 'PAY-002', amount: '$242.00', status: 'Success', email: 'abe@example.com' },
  { id: 'PAY-003', amount: '$837.00', status: 'Processing', email: 'monserrat@example.com' },
  { id: 'PAY-004', amount: '$874.00', status: 'Success', email: 'silas@example.com' },
  { id: 'PAY-005', amount: '$721.00', status: 'Failed', email: 'carmella@example.com' },
];

const paginatedData: Payment[] = [
  { id: 'PAY-001', amount: '$316.00', status: 'Success', email: 'ken@example.com' },
  { id: 'PAY-002', amount: '$242.00', status: 'Success', email: 'abe@example.com' },
  { id: 'PAY-003', amount: '$837.00', status: 'Processing', email: 'monserrat@example.com' },
  { id: 'PAY-004', amount: '$874.00', status: 'Success', email: 'silas@example.com' },
  { id: 'PAY-005', amount: '$721.00', status: 'Failed', email: 'carmella@example.com' },
  { id: 'PAY-006', amount: '$129.00', status: 'Success', email: 'nora@example.com' },
  { id: 'PAY-007', amount: '$534.00', status: 'Processing', email: 'derek@example.com' },
  { id: 'PAY-008', amount: '$283.00', status: 'Success', email: 'lana@example.com' },
  { id: 'PAY-009', amount: '$619.00', status: 'Failed', email: 'miles@example.com' },
  { id: 'PAY-010', amount: '$472.00', status: 'Success', email: 'tanya@example.com' },
  { id: 'PAY-011', amount: '$195.00', status: 'Processing', email: 'oliver@example.com' },
  { id: 'PAY-012', amount: '$688.00', status: 'Success', email: 'fiona@example.com' },
  { id: 'PAY-013', amount: '$341.00', status: 'Failed', email: 'greg@example.com' },
  { id: 'PAY-014', amount: '$756.00', status: 'Success', email: 'hana@example.com' },
  { id: 'PAY-015', amount: '$412.00', status: 'Processing', email: 'ivan@example.com' },
];

const meta = {
  title: 'Data/DataTable',
  component: DataTable,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <DataTable columns={columns} data={data} />
  ),
};

export const WithSelection: Story = {
  render: () => (
    <DataTable columns={columns} data={data} selectable />
  ),
};

export const WithPagination: Story = {
  render: () => (
    <DataTable columns={columns} data={paginatedData} pageSize={5} />
  ),
};

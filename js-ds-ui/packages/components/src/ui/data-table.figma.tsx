import figma from '@figma/code-connect';
import { DataTable } from './data-table';

figma.connect(DataTable, 'https://www.figma.com/design/YOUR_FILE_ID/js-ds-ui?node-id=PASTE_NODE_ID', {
  props: {},
  example: () => (
    <DataTable
      columns={[
        { id: 'name', header: 'Name', accessorKey: 'name', sortable: true },
        { id: 'status', header: 'Status', accessorKey: 'status' },
        { id: 'amount', header: 'Amount', accessorKey: 'amount', sortable: true },
      ]}
      data={[
        { name: 'INV001', status: 'Paid', amount: '$250.00' },
        { name: 'INV002', status: 'Pending', amount: '$150.00' },
        { name: 'INV003', status: 'Overdue', amount: '$350.00' },
      ]}
    />
  ),
});

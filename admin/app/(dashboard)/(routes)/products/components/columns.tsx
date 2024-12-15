'use client';

import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import CellAction from './cell-action';
import { formatter } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown } from 'lucide-react';

dayjs.extend(advancedFormat);

export type ProductColumn = {
  id: string;
  name: string;
  sku: string;
  price: number;
  discount: number;
  stock: number;
  createdAt: Date;
  category: string;
};

export const Columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="p-0 text-foreground font-medium flex space-x-2 items-center focus-visible:outline-0"
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
    cell: ({ getValue }) => (
      <span className="font-medium">{getValue() as React.ReactNode}</span>
    ),
  },
  {
    accessorKey: 'stock',
    header: () => <span className="text-foreground font-medium">Status</span>,
    cell: ({ row }) => {
      return (
        <Badge
          variant={row.original.stock > 0 ? 'outline' : 'destructive'}
          className="text-muted-foreground"
        >
          {row.original.stock > 0 ? 'In Stock' : 'Out of Stock'}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'category',
    header: () => <span className="text-foreground font-medium">Category</span>,
    cell: ({ getValue }) => (
      <span className="text-muted-foreground">
        {getValue() as React.ReactNode}
      </span>
    ),
  },
  {
    accessorKey: 'price',
    header: () => <span className="text-foreground font-medium">Price</span>,
    cell: ({ row }) => {
      if (row.original.discount > 0) {
        return (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-muted-foreground">
              {formatter.format(
                row.original.price -
                  (row.original.price * row.original.discount) / 100
              )}{' '}
              USD
            </span>
            <s className="text-muted-foreground">
              {formatter.format(row.original.price)} USD
            </s>
          </div>
        );
      }

      return (
        <span className="text-muted-foreground">
          {formatter.format(row.original.price)} USD
        </span>
      );
    },
  },
  {
    accessorKey: 'discount',
    header: () => <span className="text-foreground font-medium">Discount</span>,
    cell: ({ row }) => {
      return (
        <span className="text-muted-foreground">{row.original.discount}%</span>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: () => <span className="text-foreground font-medium">Date</span>,
    cell: ({ row }) => {
      const formatedDate = dayjs(row.original.createdAt).format(
        'MMMM Do, YYYY'
      );

      return <div className="text-muted-foreground">{formatedDate}</div>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

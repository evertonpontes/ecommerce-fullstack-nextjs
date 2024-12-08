'use client';

import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import CellAction from './cell-action';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Attribute, Category } from '@prisma/client';

dayjs.extend(advancedFormat);

export type CategoryColumn = { attributes: Attribute[] } & {
  subCategories: Category[];
} & Category;

export const Columns: ColumnDef<CategoryColumn>[] = [
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
    accessorKey: 'slug',
    header: () => <span className="text-foreground font-medium">Slug</span>,
    cell: ({ getValue }) => (
      <span className="text-muted-foreground">
        {getValue() as React.ReactNode}
      </span>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: () => <span className="text-foreground font-medium">Date</span>,
    cell: ({ row }) => {
      const formattedDate = dayjs(row.original.createdAt).format(
        'MMM Do, YYYY'
      );

      return <div className="text-muted-foreground">{formattedDate}</div>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

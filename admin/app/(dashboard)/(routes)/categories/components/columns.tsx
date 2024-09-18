'use client';

import { Category } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(advancedFormat);

export const Columns: ColumnDef<Category>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row }) => {
      const formatedDate = dayjs(row.original.createdAt).format(
        'MMMM Do, YYYY'
      );

      return <div>{formatedDate}</div>;
    },
  },
];

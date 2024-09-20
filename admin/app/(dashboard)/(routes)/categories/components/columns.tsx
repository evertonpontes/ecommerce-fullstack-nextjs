'use client';

import { Category } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import CellAction from '../[categoryId]/components/cell-action';

dayjs.extend(advancedFormat);

export type CategoryColumn = {
  id: string;
  name: string;
  createdAt: Date;
};

export const Columns: ColumnDef<CategoryColumn>[] = [
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
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

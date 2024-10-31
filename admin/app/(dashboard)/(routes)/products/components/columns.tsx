'use client';

import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import CellAction from '../[product]/components/cell-action';
import Image from 'next/image';
import { formatter } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

dayjs.extend(advancedFormat);

export type ProductColumn = {
  id: string;
  name: string;
  description: string;
  price: number;
  brand: string;
  discount: number;
  availability: string;
  images: string[];
  createdAt: Date;
  category: string;
};

export const Columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'availability',
    header: 'Status',
    cell: ({ row }) => {
      return (
        <Badge
          variant={
            row.original.availability === 'In Stock' ? 'outline' : 'destructive'
          }
        >
          {row.original.availability}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => {
      return <span>{row.original.price}</span>;
    },
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

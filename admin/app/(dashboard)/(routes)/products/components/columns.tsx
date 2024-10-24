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
  title: string;
  brand: string;
  price: number;
  discount: number;
  category: string;
  createdAt: Date;
  images: string[];
  status: string;
};

export const Columns: ColumnDef<ProductColumn>[] = [
  {
    id: 'image',
    cell: ({ row }) => {
      return (
        <div className="relative w-10 h-10 rounded-md items-center justify-center">
          <Image
            alt="product"
            src={
              row.original.images[0] ||
              'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='
            }
            fill
            sizes="(max-width: 40px) 100vw, (max-width: 80px) 50vw, 33vw"
            className="object-cover absolute"
          />
        </div>
      );
    },
  },
  {
    accessorKey: 'title',
    header: 'Name',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge
        variant={row.original.status === 'In Stock' ? 'outline' : 'destructive'}
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => {
      const priceFormatted = formatter.format(row.original.price);

      return <span>{priceFormatted}</span>;
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row }) => {
      const formatedDate = dayjs(row.original.createdAt).format('M/D/YYYY');

      return <div>{formatedDate}</div>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

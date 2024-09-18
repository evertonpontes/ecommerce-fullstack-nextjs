import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { PageHeader } from '@/components/ui/page-header';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Columns } from './components/columns';

import React from 'react';
import { prisma } from '@/prisma';

const CategoriesPage = async () => {
  const categories = await prisma.category.findMany({
    include: {
      attributes: true,
      childrens: true,
    },
  });

  return (
    <div>
      <div className="flex justify-between">
        <PageHeader
          title={'Categories'}
          description={'List of all categories in the store.'}
        />
        <Link href={'/categories/new'}>
          <Button className="gap-4 mx-8 my-4">
            <Plus className="w-4 h-4" />
            New category
          </Button>
        </Link>
      </div>
      <div className="max-w-screen-xl mx-auto px-8">
        <DataTable columns={Columns} data={categories} />
      </div>
    </div>
  );
};

export default CategoriesPage;

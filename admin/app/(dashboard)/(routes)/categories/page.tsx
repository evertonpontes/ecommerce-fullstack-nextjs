import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { PageHeader } from '@/components/ui/page-header';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { Columns } from './components/columns';

import React from 'react';
import { prisma } from '@/prisma';
import { Card, CardContent } from '@/components/ui/card';

const CategoriesPage = async () => {
  const categories = await prisma.category.findMany({
    include: {
      attributes: true,
      childrens: true,
    },
  });

  return (
    <div className="p-4 sm:px-6 sm:py-0">
      <div className="flex justify-between">
        <PageHeader
          title={'Categories'}
          description={'List of all categories in the store.'}
        />
        <Link href={'/categories/new'}>
          <Button className="gap-4 mx-8 my-4">
            <PlusCircle className="w-4 h-4" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add category
            </span>
          </Button>
        </Link>
      </div>
      <Card className="max-w-screen-xl mx-auto px-8">
        <CardContent className="p-6">
          <DataTable columns={Columns} data={categories} filter="name" />
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoriesPage;

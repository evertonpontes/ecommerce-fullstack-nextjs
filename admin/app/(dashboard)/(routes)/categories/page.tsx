import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { PageHeader } from '@/components/ui/page-header';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Columns } from './components/columns';

import React from 'react';
import { prisma } from '@/prisma';
import { Card, CardContent } from '@/components/ui/card';

const CategoriesPage = async () => {
  const categories = await prisma.category.findMany({
    include: {
      attributes: true,
      subCategories: true,
    },
  });

  return (
    <div className="p-4 sm:px-6 sm:py-0">
      <Card className="max-w-screen-xl mx-auto px-8">
        <CardContent className="p-6">
          <div className="flex justify-between">
            <PageHeader
              title={'Categories'}
              description={'List of all categories in the store.'}
            />
            <Button
              variant={'outline'}
              className="gap-4 mx-8 my-4 border-primary text-primary hover:text-primary"
            >
              <Link
                href={'/categories/new'}
                className="flex space-x-2 items-center focus-visible:outline-0"
              >
                <Plus className="w-4 h-4" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add category
                </span>
              </Link>
            </Button>
          </div>
          <DataTable columns={Columns} data={categories} filter="name" />
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoriesPage;

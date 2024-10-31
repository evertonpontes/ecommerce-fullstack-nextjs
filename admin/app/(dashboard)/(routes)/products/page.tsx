import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { PageHeader } from '@/components/ui/page-header';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { Columns } from './components/columns';

import React from 'react';
import { prisma } from '@/prisma';
import { Card, CardContent } from '@/components/ui/card';

const ProductsPage = async () => {
  const products = await prisma.product.findMany({
    include: {
      category: {},
      images: {},
      hasVariant: {},
      productAttributes: {},
      productGroup: {},
      _count: true,
    },
  });

  const data = products.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    brand: product.brand,
    price: Number(product.price),
    discount: Number(product.discount),
    category: product.category.name,
    createdAt: product.createdAt,
    images: product.images.map((image) => image.url),
    availability: product.amount <= 0 ? 'Out of Stock' : 'In Stock',
  }));

  return (
    <div className="p-4 sm:px-6 sm:py-0">
      <div className="flex justify-between">
        <PageHeader
          title={'Products'}
          description={'List of all products in the store.'}
        />
        <Link href={'/products/new'}>
          <Button className="gap-4 mx-8 my-4">
            <PlusCircle className="w-4 h-4" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Product
            </span>
          </Button>
        </Link>
      </div>
      <div className="max-w-screen-xl mx-auto px-8">
        <Card>
          <CardContent className="p-6">
            <DataTable columns={Columns} data={data} filter="name" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductsPage;

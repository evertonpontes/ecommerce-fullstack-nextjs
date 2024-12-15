import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { PageHeader } from '@/components/ui/page-header';
import { Plus, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { Columns } from './components/columns';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import axios from 'axios';
import { Product, Category } from '@prisma/client';

const ProductsPage = async () => {
  const products = await axios.get<({ category: Category } & Product)[]>(
    'http://localhost:3000/api/products'
  );

  const data = products.data.map((product) => ({
    ...product,
    category: product.category.name,
    price: Number(product.price),
    discount: Number(product.discount),
  }));

  return (
    <div className="p-4 sm:px-6 sm:py-0">
      <div className="max-w-screen-xl mx-auto px-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between">
              <PageHeader
                title={'Products'}
                description={'List of all products in the store.'}
              />
              <Button
                variant={'outline'}
                className="gap-4 mx-8 my-4 border-primary text-primary hover:text-primary"
              >
                <Link
                  href={'/products/new'}
                  className="flex space-x-2 items-center focus-visible:outline-0"
                >
                  <Plus className="w-4 h-4" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Product
                  </span>
                </Link>
              </Button>
            </div>
            <DataTable columns={Columns} data={data} filter="name" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductsPage;

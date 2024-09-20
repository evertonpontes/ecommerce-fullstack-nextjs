import React from 'react';
import { CategoryForm } from './components/category-form';
import { PageHeader } from '@/components/ui/page-header';
import { prisma } from '@/prisma';

const CategoryPage = async ({ params }: { params: { categoryId: string } }) => {
  const category = await prisma.category.findFirst({
    where: {
      id: params.categoryId,
    },
    include: {
      attributes: true,
    },
  });

  const categories = await prisma.category.findMany();

  const data = {
    title: category ? 'Edit Category' : 'Create Category',
    description: category
      ? 'Edit a category of your product catalog.'
      : 'Add a new category to your product catalog.',
  };

  console.log(categories);
  return (
    <div className="space-y-4 px-8 pb-4">
      <PageHeader title={data.title} description={data.description} />
      <CategoryForm categories={categories} data={category} />
    </div>
  );
};

export default CategoryPage;

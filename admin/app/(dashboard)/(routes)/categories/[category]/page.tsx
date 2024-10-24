import React from 'react';
import { CategoryClient } from './components/client';

const CategoryPage = ({
  params,
  searchParams,
}: {
  params: { category: string };
  searchParams: { categoryId: string };
}) => {
  return (
    <CategoryClient
      params={params.category}
      categoryId={searchParams.categoryId}
    />
  );
};

export default CategoryPage;

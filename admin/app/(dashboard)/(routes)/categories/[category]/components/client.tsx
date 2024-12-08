'use client';
import { PageHeader } from '@/components/ui/page-header';
import { Attribute, Category } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { CategoryForm } from './category-form';

interface CategoryClientProps {
  params: string;
  categoryId: string;
}

type DataType =
  | void
  | ({
      attributes: Attribute[];
    } & Category)
  | null;

type CategoriesType = {
  attributes: Attribute[];
  subCategories: Category[];
  parent: Category;
} & Category;

export const CategoryClient: React.FC<CategoryClientProps> = ({
  categoryId,
  params,
}) => {
  const route = useRouter();

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<DataType>(null);
  const [categories, setCategories] = useState<CategoriesType[]>([]);

  const fetchDataById = useCallback(async () => {
    try {
      const response = await axios.get<DataType>(
        `/api/categories/${categoryId}`
      );
      if (!response.data) {
        route.refresh();
        route.push('/');
      }
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }, [categoryId, route]);

  const fetchAllCategories = async () => {
    try {
      const response = await axios.get<CategoriesType[]>('/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setTimeout(async () => {
      if (params === 'edit') {
        const response = await fetchDataById();
        setData(response);
      }
      fetchAllCategories();
      setLoading(false);
    }, 1000);
  }, [fetchDataById, params]);

  const header = {
    title: data ? 'Edit Category' : 'Create Category',
    description: data
      ? 'Edit a category of your product catalog.'
      : 'Add a new category to your product catalog.',
  };

  return (
    <div className="space-y-4 px-8 pb-4">
      {!isLoading ? (
        <>
          <PageHeader title={header.title} description={header.description} />
          <CategoryForm categories={categories} data={data} />
        </>
      ) : (
        ''
      )}
    </div>
  );
};

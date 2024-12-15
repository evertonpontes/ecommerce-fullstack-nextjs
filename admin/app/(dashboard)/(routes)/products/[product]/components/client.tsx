'use client';
import { PageHeader } from '@/components/ui/page-header';
import { Attribute, Category } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { formSchema, ProductForm } from './form-components/product-form';
import { z } from 'zod';

interface ProductClientProps {
  params: string;
  productId: string;
}

type DataType = { id: string } & z.infer<typeof formSchema>;

export const ProductClient: React.FC<ProductClientProps> = ({
  productId,
  params,
}) => {
  const route = useRouter();

  const [isMounted, setIsMounted] = useState(false);
  const [data, setData] = useState<DataType | undefined>(undefined);
  const [categories, setCategories] = useState<
    ({ attributes: Attribute[] } & Category)[]
  >([]);

  const fetchDataById = useCallback(async () => {
    try {
      const response = await axios.get<DataType>(`/api/products/${productId}`);
      if (!response.data) {
        route.refresh();
        route.push('/');
      }
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }, [productId, route]);

  const fetchAllCategories = async () => {
    try {
      const response = await axios.get<
        ({ attributes: Attribute[] } & Category)[]
      >('/api/categories');
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
    }, 1000);

    setIsMounted(true);
  }, [fetchDataById, params]);

  const header = {
    title: data ? 'Edit Product' : 'Create Product',
    description: data
      ? 'Edit a product of your store.'
      : 'Add a new product to your store.',
  };

  if (params === 'edit' && !data) return null;

  return (
    <div className="space-y-4 px-2 sm:px-8 pb-4">
      {isMounted ? (
        <>
          <PageHeader title={header.title} description={header.description} />
          <ProductForm categories={categories} data={data} />
        </>
      ) : (
        ''
      )}
    </div>
  );
};

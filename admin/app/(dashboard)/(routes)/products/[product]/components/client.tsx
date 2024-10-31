'use client';
import { PageHeader } from '@/components/ui/page-header';
import {
  Attribute,
  Category,
  Product,
  ProductAttribute,
  ProductImage,
} from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { ProductForm } from './product-form';

interface ProductClientProps {
  params: string;
  productId: string;
}

type DataType = {
  price: number;
  discount: number;
  amount: number;
  images: string[];
  keywords: string[];
  productAttributes: {
    name: string;
    value: string;
  }[];
  name: string;
  title: string;
  brand: string;
  description: string;
  categoryId: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
} | null;

export const ProductClient: React.FC<ProductClientProps> = ({
  productId,
  params,
}) => {
  const route = useRouter();

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<DataType>(null);
  const [categories, setCategories] = useState<
    ({ attributes: Attribute[] } & Category)[]
  >([]);

  const fetchDataById = useCallback(async () => {
    try {
      const response = await axios.get<
        {
          images: ProductImage[];
          productAttributes: ProductAttribute[];
        } & Product
      >(`/api/products/${productId}`);
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
        const formattedProduct = response
          ? {
              ...response,
              price: Number(response.price),
              discount: Number(response.discount),
              amount: Number(response.amount),
              images: response.images.map((image) => image.url),
              keywords: response.keywords.split(' '),
              productAttributes: response.productAttributes.map((attr) => ({
                name: attr.attributeName,
                value: attr.attributeValue,
              })),
            }
          : null;
        setData(formattedProduct || null);
      }
      fetchAllCategories();
      setLoading(false);
    }, 1000);
  }, [fetchDataById, params]);

  const header = {
    title: data ? 'Edit Product' : 'Create Product',
    description: data
      ? 'Edit a product of your store.'
      : 'Add a new product to your store.',
  };

  return (
    <div className="space-y-4 px-8 pb-4">
      {!isLoading ? (
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

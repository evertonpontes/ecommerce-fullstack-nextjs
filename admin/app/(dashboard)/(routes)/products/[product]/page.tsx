import React from 'react';
import { ProductClient } from './components/client';

const ProductPage = async ({
  params,
  searchParams,
}: {
  params: { product: string };
  searchParams: { productId: string };
}) => {
  return (
    <ProductClient params={params.product} productId={searchParams.productId} />
  );
};

export default ProductPage;

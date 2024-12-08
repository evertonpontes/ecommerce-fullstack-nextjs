'use client';

import React, { useContext } from 'react';
import { ProductFormContext } from './product-form';
import { Badge } from '@/components/ui/badge';
import { formatter } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Image from 'next/image';

export const ProductSwatches = () => {
  const { form } = useContext(ProductFormContext);

  return (
    <div>
      <ProductPage />
    </div>
  );
};

const ProductPage = () => {
  const { form } = useContext(ProductFormContext);
  const { watch } = form;
  const description = watch('description');
  const price =
    watch('discount') === 0
      ? watch('price')
      : watch('price') - (watch('price') * watch('discount')) / 100;
  const paragraphRef = React.useRef<HTMLParagraphElement>(null);

  React.useEffect(() => {
    if (paragraphRef.current) {
      paragraphRef.current.innerHTML = description;
    }
  }, [description]);

  return (
    <div className="w-full grid xl:grid-cols-2 gap-8 xl:gap-4 border rounded-md bg-background p-8">
      <ImageDisplay />
      <div className="space-y-8">
        <h1 className="text-4xl font-semibold">{watch('name')}</h1>
        <div className="flex gap-2 items-center">
          <Badge>{formatter.format(price)} USD</Badge>
          {watch('discount') > 0 && (
            <s className="text-sm text-muted-foreground">
              {formatter.format(watch('price'))} USD
            </s>
          )}
        </div>
        <Separator />
        {watch('variesBy').map((variation, index) => (
          <div key={index} className="space-y-4">
            <p>{variation.name}</p>
            <div className="flex gap-4">
              {variation.options.map((option, index) => (
                <Button
                  type="button"
                  key={index}
                  variant="secondary"
                  size={'sm'}
                  className="border border-input rounded-md hover:border-primary transition-colors"
                >
                  {option.value}
                </Button>
              ))}
            </div>
          </div>
        ))}
        <p ref={paragraphRef}></p>
        <Button type="button" disabled size={'lg'} className="rounded-full">
          <Plus className="mr-2 h-6 w-6" />
          <p className="text-xl">Add to cart</p>
        </Button>
      </div>
    </div>
  );
};

const ImageDisplay = () => {
  return (
    <div className="w-full">
      <div className="w-full h-[500px] relative my-2 mb-4 mx-4">
        <Image
          src={'https://placehold.co/500x500?text=Hello\nWorld'}
          alt="variant-image"
          className="absolute object-fill"
          fill
        />
      </div>
      <div className="w-full flex gap-4 items-center justify-center mx-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-20 w-20 relative rounded-md overflow-hidden"
          >
            <Image
              src={'https://placehold.co/80x80?text=Hello\nWorld'}
              alt="variant-image"
              className="absolute object-fill"
              fill
            />
          </div>
        ))}
      </div>
    </div>
  );
};

'use client';

import { useContext } from 'react';
import { ProductFormContext } from './product-form';
import { UploadImages } from '@/components/ui/upload-images';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FieldPath, FieldValues } from 'react-hook-form';
import { formSchema } from './product-form';
import { z } from 'zod';

type ImagesProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
};

export const Images = ({ name }: ImagesProps<z.infer<typeof formSchema>>) => {
  const { form, startTransition, isPending } = useContext(ProductFormContext);
  const formattedImages = form
    .watch(name)
    .map(({ url }: { url: string }) => url);

  function handleFilesChange(values: string[]) {
    const formattedImages = values.map((value) => ({ url: value }));
    form.setValue(name, formattedImages);
  }

  return (
    <div>
      <Separator className="my-8 md:sr-only" />
      <h2 className="text-xl font-semibold text-primary mb-8">Images</h2>
      <Card>
        <CardContent className="p-4">
          <UploadImages
            folder="products"
            value={formattedImages}
            onChange={handleFilesChange}
            startTransition={startTransition}
            disable={isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
};

'use client';

import { useContext } from 'react';
import { ProductFormContext } from './product-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

export const ProductAttributes = () => {
  const { form, states } = useContext(ProductFormContext);

  return (
    <div>
      <Separator className="space-y-4" />
      <h2 className="my-8 text-xl font-semibold">Product Attributes</h2>
      <div className="grid md:grid-cols-2 items-center gap-8">
        {states.attributes.map((attribute) => (
          <FormField
            key={attribute.id}
            control={form.control}
            name={`productAttributes.${attribute.name}`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{attribute.name}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={`Enter ${attribute.name.toLowerCase()}`}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>
    </div>
  );
};

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Attribute, Category } from '@prisma/client';
import { useForm, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

import { createContext, useState, useTransition } from 'react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { BasicInfo } from './basic-info';
import { ProductAttributes } from './product-attributes';
import { Images } from './images';
import { ProductVariations, ShowVariations } from './product-variations';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ProductVariants } from './product-variants';
import { OnChangeFn } from '@tanstack/react-table';
import { Separator } from '@/components/ui/separator';
import { TextEditor } from '@/components/ui/text-editor';
import { ProductSwatches } from './product-swatches';

export const optionSwatchSchema = z.object({
  swatchType: z.enum(['COLOR', 'IMAGE', 'TEXT']),
  swatchShape: z.enum(['SQUARE', 'CIRCLE']),
  swatchColor: z.string().optional(),
  swatchThumbnailUrl: z.string().optional(),
  swatchText: z.string().optional(),
});

export const variationOptionSchema = z.object({
  value: z
    .string()
    .max(50, { message: 'Value must be at most 50 characters.' }),
  optionSlug: z.string().regex(/^[a-z0-9-]+$/, {
    message: 'Slug can only contain lowercase letters, numbers, and hyphens.',
  }),
  swatch: optionSwatchSchema.optional(),
});

export const variationSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'Name must be at least 2 characters.',
    })
    .max(50),
  slug: z.string().regex(/^[a-z0-9-]+$/, {
    message: 'Slug can only contain lowercase letters, numbers, and hyphens.',
  }),
  options: variationOptionSchema.array(),
});

export const productBase = z.object({
  name: z
    .string()
    .min(2, {
      message: 'Name must be at least 2 characters.',
    })
    .max(50),
  sku: z
    .string()
    .min(2, {
      message: 'SKU must be at least 2 characters.',
    })
    .max(50),
  stock: z.number().int().nonnegative(),
  price: z.number().multipleOf(0.01).nonnegative(),
  description: z.string(),
  discount: z.number().multipleOf(0.01).max(100).nonnegative(),
  categoryId: z.string(),
  productAttributes: z.any(),
  images: z
    .object({
      url: z.string().url(),
    })
    .array(),
  variesBy: variationSchema.array(),
  combination: z.any(),
});

export const formSchema = productBase.extend({
  hasVariant: productBase.array(),
});

interface ProductFormProps {
  categories: ({ attributes: Attribute[] } & Category)[];
}

type VariantValues = z.infer<typeof productBase>;

type ProductFormStates = {
  attributes: Attribute[];
  variations: z.infer<typeof variationSchema>[];
  variants: VariantValues[];
};

type ProductFormContextValue = {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  categories: ({ attributes: Attribute[] } & Category)[];
  startTransition: React.TransitionStartFunction;
  isPending: boolean;
  onAttributesChange: OnChangeFn<Attribute[]>;
  onVariationsChange: OnChangeFn<z.infer<typeof variationSchema>[]>;
  onVariantsChange: OnChangeFn<VariantValues[]>;
  states: ProductFormStates;
};

export const ProductFormContext = createContext<ProductFormContextValue>(
  {} as ProductFormContextValue
);

const defaultValues: z.infer<typeof formSchema> = {
  name: '',
  sku: '',
  stock: 1,
  price: 0.01,
  discount: 0,
  categoryId: '',
  images: [],
  variesBy: [],
  hasVariant: [],
  description: '',
};

export const ProductForm: React.FC<ProductFormProps> = ({ categories }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const [isPending, startTransition] = useTransition();
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [hasVariations, setHasVariations] = useState(false);
  const [variations, setVariations] = useState<
    z.infer<typeof variationSchema>[]
  >(form.getValues('variesBy'));
  const [variants, setVariants] = useState<VariantValues[]>([]);

  const states: ProductFormStates = {
    attributes,
    variations,
    variants,
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  function handleCheckChange(value: boolean) {
    setHasVariations(value);
    if (!value) {
      form.setValue('variesBy', []);
      setVariations([]);
    }
  }

  const context: ProductFormContextValue = {
    form,
    categories,
    startTransition,
    isPending,
    onAttributesChange: setAttributes,
    onVariationsChange: setVariations,
    onVariantsChange: setVariants,
    states,
  };

  return (
    <ProductFormContext.Provider value={context}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div
            className="grid lg:grid-cols-2 gap-14
          "
          >
            <div className="space-y-8">
              <BasicInfo />
              {attributes.length ? <ProductAttributes /> : ''}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="has-variations"
                  checked={hasVariations}
                  onCheckedChange={() => handleCheckChange(!hasVariations)}
                />
                <Label htmlFor="has-variations">
                  This product have variations
                </Label>
                <p className="text-sm text-muted-foreground">
                  (e.g. Color, Size, Format.)
                </p>
              </div>
              {hasVariations ? (
                <>
                  <Separator />
                  <ProductVariations />
                  <ShowVariations />
                  <ProductVariants />
                </>
              ) : (
                ''
              )}
              <Separator />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <TextEditor
                        description={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-8">
              <Images name="images" />
            </div>
          </div>
          <div className="space-y-8">
            <Separator />
            <ProductSwatches />
          </div>
          <Button disabled={isPending}>Submit</Button>
        </form>
      </Form>
    </ProductFormContext.Provider>
  );
};

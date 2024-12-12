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
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export const optionSwatchSchema = z.object({
  swatchType: z.enum(['COLOR', 'IMAGE', 'TEXT']).optional(),
  swatchShape: z.enum(['SQUARE', 'CIRCLE']).optional(),
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
  data: ({ id: string } & z.infer<typeof formSchema>) | undefined;
}

type VariantValues = z.infer<typeof productBase>;

type ProductFormStates = {
  attributes: Attribute[];
  variations: z.infer<typeof variationSchema>[];
  variants: VariantValues[];
  productBaseState: z.infer<typeof productBase>;
};

type ProductFormContextValue = {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  categories: ({ attributes: Attribute[] } & Category)[];
  startTransition: React.TransitionStartFunction;
  isPending: boolean;
  onAttributesChange: OnChangeFn<Attribute[]>;
  onVariationsChange: OnChangeFn<z.infer<typeof variationSchema>[]>;
  onVariantsChange: OnChangeFn<VariantValues[]>;
  onProductBaseChange: (name: string, value: any) => void;
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

export const ProductForm: React.FC<ProductFormProps> = ({
  categories,
  data,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: data ? data : defaultValues,
  });

  const [isPending, startTransition] = useTransition();
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [hasVariations, setHasVariations] = useState(false);
  const [variations, setVariations] = useState<
    z.infer<typeof variationSchema>[]
  >(form.getValues('variesBy'));
  const [variants, setVariants] = useState<VariantValues[]>([]);
  const [productBaseState, setProductBaseState] = useState<
    z.infer<typeof productBase>
  >(form.getValues());

  const states: ProductFormStates = {
    attributes,
    variations,
    variants,
    productBaseState,
  };

  const router = useRouter();

  const toastMessage = data
    ? 'Product Updated Successfully!'
    : 'Product Created Successfully!';

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        if (data) {
          await axios.put<z.infer<typeof formSchema>>(
            `/api/products/${data.id}`,
            values
          );
        } else {
          await axios.post<z.infer<typeof formSchema>>('/api/products', values);
        }

        router.refresh();
        router.push('/products');
        toast.success(toastMessage);
      } catch (error) {
        console.log(error);
        toast.error('Something went wrong :(');
      }
    });
  }

  function handleCheckChange(value: boolean) {
    setHasVariations(value);
    if (!value) {
      form.setValue('variesBy', []);
      form.setValue('hasVariant', []);
      setVariations([]);
      setVariants([]);
    }
  }

  const onProductBaseChange = (name: string, value: any) => {
    setProductBaseState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const context: ProductFormContextValue = {
    form,
    categories,
    startTransition,
    isPending,
    onAttributesChange: setAttributes,
    onVariationsChange: setVariations,
    onVariantsChange: setVariants,
    onProductBaseChange,
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
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <TextEditor
                        description={field.value}
                        onChange={(value) => {
                          field.onChange(value);
                          onProductBaseChange(field.name, value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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

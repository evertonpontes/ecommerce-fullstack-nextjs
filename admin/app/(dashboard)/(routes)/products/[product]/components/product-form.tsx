'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import axios from 'axios';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import React, { useState, useTransition } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Attributes, Category } from '@prisma/client';
import { Plus, Trash } from 'lucide-react';
import { UploadImage } from '@/components/ui/upload-image';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const formSchema = z.object({
  name: z.string().min(2).max(50),
  title: z.string().min(2).max(50),
  brand: z.string().min(2).max(50),
  price: z.number().positive(),
  discount: z.number().min(0).max(100),
  amount: z.number().int().positive(),
  keywords: z.string().array(),
  description: z.string().min(2).max(500),
  images: z.string().array(),
  categoryId: z.string(),
  productAttributes: z
    .object({
      name: z.string().min(2).max(50),
      value: z.string().min(2).max(50),
    })
    .array(),
});

interface ProductFormProps {
  categories: ({ attributes: Attributes[] } & Category)[];
  data: ({ id: string } & z.infer<typeof formSchema>) | null;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  categories,
  data,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: data
      ? data
      : {
          name: '',
          brand: '',
          categoryId: '',
          description: '',
          amount: 1,
          discount: 0,
          price: 0,
          images: [],
          keywords: [],
          title: '',
          productAttributes: [{ name: '', value: '' }],
        },
  });

  const [isPending, startTransition] = useTransition();

  const [attributes, setAttributes] = useState<
    { name: string; value: string }[]
  >([]);

  const [keywords, setKeywords] = useState<string[]>([]);

  const router = useRouter();

  const toastMessage = data
    ? 'Product Updated Successfully!'
    : 'Product Created Successfully!';

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        if (data) {
          await axios.put<Category>(`/api/products/${data.id}`, values);
        } else {
          await axios.post<Category>('/api/products', values);
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

  const onCategoryChange = (categoryId: string) => {
    const categorySelected = categories.filter(
      (cat) => cat.id === categoryId
    )[0];
    const attributes = categorySelected.attributes;
    const productAttributes = attributes.map((attr) => ({
      name: attr.name,
      value: '',
    }));

    form.setValue('categoryId', categorySelected.id);
    form.setValue('productAttributes', productAttributes);
    setAttributes(productAttributes);
  };

  const onAddKeyword = () => {
    const keywordsValue = form.getValues('keywords') || [];
    keywordsValue.push('');

    form.setValue('keywords', keywordsValue);
    setKeywords(keywordsValue);
  };

  const onRemoveKeyword = (keywordIdx: number) => {
    const keywordsValue = form.getValues('keywords');
    const newKeywordsValue = keywordsValue.filter(
      (_, idx) => idx !== keywordIdx
    );

    form.setValue('keywords', newKeywordsValue);
    setKeywords(newKeywordsValue);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-3xl mx-auto mb-8"
      >
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Images</FormLabel>
              <FormControl>
                <UploadImage
                  value={field.value || []}
                  onTransition={startTransition}
                  onChangeImages={(imageUrls) => field.onChange(imageUrls)}
                  folder="products"
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="type a product name."
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormDescription>
                Many products with the same &apos;name&apos; will be displayed
                as a product variant into the store.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="type a product title."
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="brand"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brand</FormLabel>
              <FormControl>
                <Input
                  placeholder="type a brand."
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="type a product title."
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="type a product title."
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="discount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="type a product title."
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parent Category</FormLabel>
              <Select
                onValueChange={onCategoryChange}
                defaultValue={field.value || ''}
                disabled={isPending}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem
                      disabled={category.id === data?.categoryId}
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-x-4">
          <Label>{attributes.length ? 'Product Attributes' : ''}</Label>
          <div className="space-y-2 mt-2 max-w-lg">
            {attributes.map((attr, index) => (
              <FormField
                key={index}
                control={form.control}
                name={`productAttributes.${index}.value`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{attr.name}</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Input
                          placeholder="Attribute value"
                          {...field}
                          disabled={isPending}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>
        <div className="space-x-4">
          <Button
            onClick={onAddKeyword}
            variant={'outline'}
            type="button"
            className="gap-2"
            disabled={isPending}
          >
            <Plus className="w-4 h-4" /> Add keyword
          </Button>
          <div className="space-y-2 mt-2 max-w-lg">
            {keywords.map((_keyword, index) => (
              <FormField
                key={index}
                control={form.control}
                name={`keywords.${index}`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Input
                          placeholder="Keyword"
                          {...field}
                          disabled={isPending}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => onRemoveKeyword(index)}
                          disabled={isPending}
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Remove attribute</span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>
        <Button type="submit" disabled={isPending}>
          Submit
        </Button>
      </form>
    </Form>
  );
};

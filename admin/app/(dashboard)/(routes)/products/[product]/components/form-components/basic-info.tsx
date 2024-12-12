'use client';

import { Attribute, Category } from '@prisma/client';
import { useContext } from 'react';
import { ProductFormContext } from './product-form';
import {
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
import { Asterisk, Percent } from 'lucide-react';

export const BasicInfo = () => {
  const { form, categories, onAttributesChange, onProductBaseChange } =
    useContext(ProductFormContext);

  // return attributes of category
  function getAttributes(category: { attributes: Attribute[] } & Category) {
    const attributes = category.attributes;
    return attributes;
  }

  // set attributes of category in the state and form
  function onCategorySelect(categoryId: string) {
    const category = categories.filter((item) => item.id === categoryId)[0];
    const attributes = getAttributes(category);
    const attributesObject: { [key: string]: string } = {};

    for (let attribute of attributes) {
      attributesObject[attribute.name] = '';
    }

    onAttributesChange(attributes);
    form.setValue('categoryId', categoryId);
    form.setValue('productAttributes', attributesObject);
  }

  return (
    <div className="grid gap-8 items-end md:grid-cols-2">
      <h2 className="text-xl font-semibold">Basic Information</h2>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel className="flex gap-1 items-center">
              Name{' '}
              <Asterisk className="flex-shrink-0 h-4 w-4 text-destructive" />
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Enter name"
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  onProductBaseChange(field.name, e.target.value);
                }}
              />
            </FormControl>
            <FormDescription>
              The name of your product as it will appear in the catalog.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="sku"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel className="flex gap-1 items-center">
              SKU{' '}
              <Asterisk className="flex-shrink-0 h-4 w-4 text-destructive" />
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Enter SKU"
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  onProductBaseChange(field.name, e.target.value);
                }}
              />
            </FormControl>
            <FormDescription>
              A unique code that tracks products inventory.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="stock"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Stock</FormLabel>
            <FormControl>
              <Input
                type="number"
                step={1}
                min={0}
                placeholder="Enter the stock"
                {...field}
                onChange={({ target }) => {
                  field.onChange(Number(target.value));
                  onProductBaseChange(field.name, Number(target.value));
                }}
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
                step={0.01}
                min={0}
                placeholder="Enter the price"
                {...field}
                onChange={({ target }) => {
                  field.onChange(Number(target.value));
                  onProductBaseChange(field.name, Number(target.value));
                }}
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
            <FormLabel className="flex gap-1 items-center">
              Discount <Percent className="flex-shrink-0 h-4 w-4" />
            </FormLabel>
            <FormControl>
              <Input
                type="number"
                step={0.01}
                min={0}
                placeholder="Enter the discount"
                {...field}
                onChange={({ target }) => {
                  field.onChange(Number(target.value));
                  onProductBaseChange(field.name, Number(target.value));
                }}
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
            <FormLabel>Category</FormLabel>
            <Select
              onValueChange={(value) => {
                onCategorySelect(value);
                onProductBaseChange(field.name, value);
              }}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Choose..." />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {!categories.length ? (
                  <SelectItem value="default" disabled>
                    No categories found.
                  </SelectItem>
                ) : (
                  categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

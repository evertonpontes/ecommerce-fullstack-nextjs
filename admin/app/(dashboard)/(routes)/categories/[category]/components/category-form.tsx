'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import axios from 'axios';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
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
import { Attribute, Category } from '@prisma/client';
import { Plus, Trash } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface CategoryFormProps {
  categories: ({
    attributes: Attribute[];
    childrens: Category[];
    parent: Category;
  } & Category)[];
  data:
    | void
    | ({
        attributes: Attribute[];
      } & Category)
    | null;
}

const formSchema = z.object({
  name: z.string().min(2).max(50),
  parentId: z.string().nullable(),
  attributes: z
    .object({
      name: z.string().min(2).max(50),
    })
    .array(),
});

export const CategoryForm: React.FC<CategoryFormProps> = ({
  categories,
  data,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data ? data.name : '',
      parentId: data ? data.parentId : '',
      attributes: data ? data.attributes : [],
    },
  });

  const [isPending, startTransition] = useTransition();

  const [attributes, setAttributes] = useState<{ name: string }[]>(
    form.getValues('attributes')
  );

  const router = useRouter();

  const toastMessage = data
    ? 'Category Updated Successfully!'
    : 'Category Created Successfully!';

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        if (data) {
          await axios.put<Category>(`/api/categories/${data.id}`, values);
        } else {
          await axios.post<Category>('/api/categories', values);
        }

        router.refresh();
        router.push('/categories');
        toast.success(toastMessage);
      } catch (error) {
        console.log(error);
        toast.error('Something went wrong :(');
      }
    });
  }

  const onAddAttribute = () => {
    const attributes = form.getValues('attributes');
    attributes.push({ name: '' });

    form.setValue('attributes', attributes);
    setAttributes(attributes);
  };

  const onRemoveAttribute = (index: number) => {
    const attributes = form.getValues('attributes');
    const updatedAttributes = attributes.filter((_, idx) => idx !== index);

    form.setValue('attributes', updatedAttributes);
    setAttributes(updatedAttributes);
  };

  const onParentChange = (parentId: string) => {
    form.setValue('parentId', parentId);

    const parent = categories.filter((cat) => cat.id === parentId)[0];
    const parentAttributes = parent.attributes.map((atr) => ({
      name: atr.name,
    }));

    form.setValue('attributes', parentAttributes);
    setAttributes(parentAttributes);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-3xl mx-auto mb-8"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Name <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="type a name"
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
          name="parentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parent Category</FormLabel>
              <Select
                onValueChange={onParentChange}
                defaultValue={field.value || ''}
                disabled={isPending}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.length ? (
                    categories.map((category) => (
                      <SelectItem
                        disabled={category.id === data?.id}
                        key={category.id}
                        value={category.id}
                      >
                        {category.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled={true} value={'default'}>
                      No categories found.
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <Label>Attributes</Label>
          <div className="space-y-2 mt-2 max-w-lg">
            {attributes.map((_attr, index) => (
              <FormField
                key={index}
                control={form.control}
                name={`attributes.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Input
                          placeholder="Attribute name"
                          {...field}
                          disabled={isPending}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => onRemoveAttribute(index)}
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
            <Button
              type="button"
              variant="outline"
              onClick={onAddAttribute}
              disabled={isPending}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Attribute
            </Button>
          </div>
        </div>
        <Button type="submit" disabled={isPending}>
          Submit
        </Button>
      </form>
    </Form>
  );
};

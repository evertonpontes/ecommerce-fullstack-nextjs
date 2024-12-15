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

import React, { useEffect, useState, useTransition } from 'react';
import { Attribute, Category } from '@prisma/client';
import { Plus, X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { generateNameSlug } from '@/lib/utils';

interface CategoryFormProps {
  categories: ({
    attributes: Attribute[];
    subCategories: Category[];
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
  slug: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[a-z0-9-]+$/, {
      message: 'Slug can only contain lowercase letters, numbers, and hyphens.',
    }),
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
      slug: data ? data.slug : '',
      parentId: data ? data.parentId : '',
      attributes: data ? data.attributes : [],
    },
  });

  const [isPending, startTransition] = useTransition();

  const [attributes, setAttributes] = useState<{ name: string }[]>(
    form.getValues('attributes')
  );

  const [name, setName] = useState(data ? data.name : '');

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

  useEffect(() => {
    form.setValue('slug', generateNameSlug(name));
  }, [form, name]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid md:grid-cols-2 lg:grid-cols-3 items-end gap-8 max-w-3xl m-8"
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
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    setName(e.target.value);
                  }}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Slug <span className="text-destructive">*</span>
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
        <div className="grid grid-cols-subgrid gap-8 md:col-span-2 lg:col-span-3">
          <div className="space-y-2 max-w-lg flex flex-col">
            <Label>Attributes</Label>
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
                          className="flex-shrink-0"
                          onClick={() => onRemoveAttribute(index)}
                          disabled={isPending}
                        >
                          <X className="h-4 w-4" />
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

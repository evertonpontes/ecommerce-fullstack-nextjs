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
import { Textarea } from '@/components/ui/textarea';
import { Category } from '@prisma/client';
import { Plus, Trash } from 'lucide-react';
import { UploadImage } from '@/components/ui/upload-image';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';

interface CategoryFormProps {
  categories: Category[];
}

const formSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().min(2).max(500),
  imageUrl: z.string(),
  parentId: z.string(),
  attributes: z
    .object({
      name: z.string().min(2).max(50),
    })
    .array(),
});

export const CategoryForm: React.FC<CategoryFormProps> = ({ categories }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      imageUrl: '',
      parentId: '',
      attributes: [{ name: '' }],
    },
  });

  const [isPending, startTransition] = useTransition();

  const [attributes, setAttributes] = useState<{ name: string }[]>(
    form.getValues('attributes')
  );

  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        await axios.post<Category>('/api/categories', values);

        router.refresh();
        router.push('/categories');
      } catch (error) {
        console.log(error);
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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-3xl mx-auto mb-8"
      >
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <UploadImage
                  value={field.value ? [field.value] : []}
                  onTransition={startTransition}
                  onChangeImages={(imageUrls) =>
                    field.onChange(imageUrls[imageUrls.length - 1])
                  }
                  disabled={isPending}
                />
              </FormControl>
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
                  placeholder="type a name."
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
          name="parentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parent Category</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isPending}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
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
                          variant="outline"
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

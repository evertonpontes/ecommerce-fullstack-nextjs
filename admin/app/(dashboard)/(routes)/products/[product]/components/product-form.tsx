'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Control, useForm, UseFormReturn } from 'react-hook-form';
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

import React, { useEffect, useRef, useState, useTransition } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Attribute, Category } from '@prisma/client';
import {
  BadgeAlert,
  Bird,
  Ghost,
  GripVertical,
  ImageIcon,
  Plus,
  Trash,
} from 'lucide-react';
import { UploadImage } from '@/components/ui/upload-image';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  MultiStep,
  MultiStepContent,
  MultiStepNavigation,
  MultiStepTriggerNext,
  MultiStepTriggerPrevious,
} from '@/components/ui/multi-step';
import { Card, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { InlineKeywordInput } from '@/components/ui/inline-keyword-input';
import { DraggableTable } from '@/components/ui/draggable-table';
import { ColumnDef } from '@tanstack/react-table';
import { arrayMove, useSortable } from '@dnd-kit/sortable';
import { DragEndEvent } from '@dnd-kit/core';
import Image from 'next/image';

const baseProduct = z.object({
  name: z.string().min(2).max(50),
  images: z.string().array(),
  sku: z.string().max(50),
  brand: z.string().max(50),
  price: z.number().positive(),
  amount: z.number().int().positive(),
  discount: z.number().min(0).max(100),
  keywords: z.string().array(),
  description: z.string().max(500),
  categoryId: z.string(),
  productAttributes: z
    .object({
      name: z.string().max(50),
      value: z.string().max(50),
    })
    .array()
    .optional(),
});

const formSchema = baseProduct.extend({
  hasVariant: z.lazy(() => baseProduct.array()).optional(),
});

interface ProductFormProps {
  categories: ({ attributes: Attribute[] } & Category)[];
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
          sku: '',
          brand: '',
          categoryId: '',
          description: '',
          discount: 0,
          price: 0,
          keywords: [],
          images: [],
          productAttributes: [{ name: '', value: '' }],
        },
  });

  const [isPending, startTransition] = useTransition();

  const [attributes, setAttributes] = useState<
    { name: string; value: string }[]
  >([]);

  const router = useRouter();

  const toastMessage = data
    ? 'Product Updated Successfully!'
    : 'Product Created Successfully!';

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    /*
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
    */
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <MultiStep
          steps={['Basic Information', 'Features', 'Images', 'Variants']}
          className="grid sm:grid-cols-[250px_auto] gap-4"
        >
          <MultiStepNavigation
            title="Registration Steps"
            description="Navigate through the registration steps."
          />
          <Card className="w-full flex flex-col">
            <MultiStepContent
              value="Basic Information"
              className="w-full flex-grow"
            >
              <BasicInformation
                control={form.control}
                categories={categories}
                disable={isPending}
                onCategoryChange={onCategoryChange}
              />
            </MultiStepContent>
            <MultiStepContent value="Features" className="w-full flex-grow">
              <Features
                control={form.control}
                attributes={attributes}
                disable={isPending}
              />
            </MultiStepContent>
            <MultiStepContent value="Images" className="w-full flex-grow">
              <Images
                control={form.control}
                disable={isPending}
                startTransition={startTransition}
              />
            </MultiStepContent>
            <MultiStepContent value="Variants" className="w-full flex-grow">
              <Variants form={form} disable={isPending} />
            </MultiStepContent>
            <CardFooter className="w-full justify-between border-t pt-6">
              <MultiStepTriggerPrevious variant={'outline'} type="button" />
              <MultiStepTriggerNext variant={'outline'} type="button" />
            </CardFooter>
          </Card>
        </MultiStep>
      </form>
    </Form>
  );
};

const BasicInformation = ({
  control,
  disable = false,
  categories,
  onCategoryChange,
}: {
  control: Control<z.infer<typeof formSchema>>;
  disable: boolean;
  categories: ({ attributes: Attribute[] } & Category)[];
  onCategoryChange: (categoryId: string) => void;
}) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-80">
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="type a name" {...field} disabled={disable} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="sku"
        render={({ field }) => (
          <FormItem>
            <FormLabel>SKU</FormLabel>
            <FormControl>
              <Input
                placeholder="type sky of product"
                {...field}
                disabled={disable}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Price</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.01"
                placeholder="0,00"
                {...field}
                onChange={({ target }) => field.onChange(Number(target.value))}
                disabled={disable}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="amount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Amount</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="price of product"
                {...field}
                onChange={({ target }) => field.onChange(Number(target.value))}
                disabled={disable}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="categoryId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <Select
              onValueChange={onCategoryChange}
              defaultValue={field.value || ''}
              disabled={disable}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {categories.length ? (
                  categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
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
      <FormField
        control={control}
        name="discount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Discount</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.1"
                placeholder="Discount (%)"
                {...field}
                onChange={({ target }) => field.onChange(Number(target.value))}
                disabled={disable}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

const Features = ({
  control,
  disable = false,
  attributes,
}: {
  control: Control<z.infer<typeof formSchema>>;
  disable: boolean;
  attributes: { name: string; value: string }[];
}) => {
  return (
    <div className="space-x-4">
      {!attributes.length && (
        <div className="w-full h-full text-sm text-muted-foreground flex flex-col gap-2 items-center justify-center">
          <Ghost className="h-10 w-10" />
          <span>No attributes found.</span>
        </div>
      )}
      <div
        className={cn(
          'grid md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-80',
          !attributes.length && 'sr-only'
        )}
      >
        {attributes.map((attr, index) => (
          <FormField
            key={index}
            control={control}
            name={`productAttributes.${index}.value`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{attr.name}</FormLabel>
                <FormControl>
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Attribute value"
                      {...field}
                      disabled={disable}
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
  );
};

const Images = ({
  control,
  disable = false,
  startTransition,
}: {
  control: Control<z.infer<typeof formSchema>>;
  disable: boolean;
  startTransition: React.TransitionStartFunction;
}) => {
  return (
    <FormField
      control={control}
      name="images"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Upload Image&apos;s</FormLabel>
          <FormControl>
            <UploadImage
              value={field.value || []}
              onTransition={startTransition}
              onChangeImages={(imageUrls) => field.onChange(imageUrls)}
              folder="products"
              disabled={disable}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const RowDragHandleCell = ({ rowId }: { rowId: string }) => {
  const { attributes, listeners } = useSortable({
    id: rowId,
  });

  return (
    // Alternatively, you could set these attributes on the rows themselves
    <Button
      type="button"
      variant={'ghost'}
      {...attributes}
      {...listeners}
      className="cursor-grab aria-pressed:cursor-grabbing"
    >
      <GripVertical className="w-4 h-4" />
    </Button>
  );
};

type VariationOptions = { [key: string]: string[] };

type Result = { id: string; image: string; [key: string]: string };

const Variants = ({
  form,
  disable = false,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  disable: boolean;
}) => {
  const [attributeName, setAttributeName] = useState('');
  const [attributesNameList, setAttributesNameList] = useState<string[]>([]);
  const [variantOptions, setVariantOptions] = useState<VariationOptions | null>(
    null
  );
  const [options, setOptions] = useState<string[]>([]);
  const [error, setError] = useState<{
    invalid: boolean;
    errorId: string;
    message: string;
  } | null>(null);
  const [results, setResults] = useState<Result[]>([]);

  const inputNameRef = useRef<HTMLInputElement>(null);

  const onChangeAttributeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAttributeName(e.currentTarget.value);
  };

  const addVariant = () => {
    if (!attributeName) {
      setError({
        invalid: true,
        errorId: 'attrName',
        message: 'Name is required.',
      });
      return;
    } else if (!options.length) {
      setError({
        invalid: true,
        errorId: 'options',
        message: 'Options is required.',
      });
      return;
    } else if (error) {
      setError(null);
    }
    setAttributesNameList((prev) => [...prev, attributeName]);
    setVariantOptions((prev) => ({ ...prev, [attributeName]: options }));
    setAttributeName('');
    setOptions([]);
  };

  const generateCombinations = (
    attrNames: string[],
    options: VariationOptions
  ) => {
    const getCombinations = (
      keys: string[],
      currentCombination: { id: string; [key: string]: string } = {
        id: '',
      },
      results: { [key: string]: string }[] = []
    ) => {
      if (keys.length === 0) {
        results.push(currentCombination);
        return;
      }

      const currentKey = keys[0];
      const remainingKeys = keys.slice(1);

      for (const option of options[currentKey]) {
        const newCombination = {
          ...currentCombination,
          [currentKey.toLowerCase()]: option,
        };
        newCombination.id +=
          currentKey[0].toLowerCase() +
          option.slice(0, 2).toLowerCase() +
          Math.floor(Math.random() * 1000);

        getCombinations(remainingKeys, newCombination, results);
      }
    };

    const combinations: Result[] = [];
    getCombinations(attrNames, { id: '' }, combinations);

    const formattedData = combinations.map((combination) => ({
      ...combination,
      image: '',
    }));

    setResults(formattedData);
  };

  const columns: ColumnDef<Result>[] = attributesNameList.map((name) => ({
    accessorKey: name.toLowerCase(),
    header: name,
  }));
  columns.unshift({
    id: 'drag',
    cell: ({ row }) => <RowDragHandleCell rowId={row.original.id} />,
  });
  columns.push({
    accessorKey: 'image',
    header: 'Image',
    cell: ({ row }) => (
      <div className="relative w-10 h-10">
        <Image
          alt="image"
          src={
            row.original.image
              ? row.original.image
              : 'https://placehold.co/40x40?text=Upload+Image'
          }
          fill
          objectFit="contain"
          className="absolute"
        />
      </div>
    ),
  });

  useEffect(() => {
    generateCombinations(attributesNameList, variantOptions ?? {});
  }, [attributesNameList, variantOptions]);

  const dataIds = results.map((combination) => combination.id);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!active.id || !over?.id || active.id === over.id) return;

    setResults((prevResults) => {
      const oldIndex = prevResults.findIndex((item) => item.id === active.id);
      const newIndex = prevResults.findIndex((item) => item.id === over.id);
      return arrayMove(prevResults, oldIndex, newIndex);
    });
  };

  return (
    <>
      <div className="w-full flex flex-col space-y-8">
        <Alert>
          <BadgeAlert className="w-4 h-4" />
          <AlertTitle>Add custom options to your products</AlertTitle>
          <AlertDescription>
            Below you can add variations for your product, such as color, size,
            configuration, etc. The product will be saved in a simple format if
            no variation is provided.
          </AlertDescription>
        </Alert>
        <div>
          <div className="grid md:grid-cols-2 lg:grid-cols-[auto_auto_120px] gap-4 mb-8 items-start lg:items-end">
            <div className="w-full space-y-2">
              <Label
                className={cn(
                  !!error && error.errorId === 'attrName' && 'text-destructive'
                )}
                htmlFor="attrName"
              >
                Attribute Name
              </Label>
              <Input
                id="attrName"
                ref={inputNameRef}
                value={attributeName}
                placeholder="e.g. Color"
                className={cn('data-[error]:')}
                onChange={onChangeAttributeName}
                disabled={disable}
              />
              <span
                className={cn(
                  'font-medium text-sm text-destructive lg:absolute',
                  !error || (error.errorId !== 'attrName' && 'sr-only')
                )}
              >
                {error?.message}
              </span>
            </div>
            <div className="w-full space-y-2 relative mb-8 md:mb-0">
              <Label
                className={cn(
                  !!error && error.errorId === 'options' && 'text-destructive'
                )}
                htmlFor="options"
              >
                Options
              </Label>
              <InlineKeywordInput
                id="options"
                keywords={options}
                setKeywords={setOptions}
                placeholder="Enter keywords"
                disabled={disable}
              />
              <span
                className={cn(
                  'flex items-center gap-2 text-xs text-primary absolute',
                  !!error &&
                    error.errorId === 'options' &&
                    'text-destructive text-sm'
                )}
              >
                {!error || error.errorId !== 'options' ? (
                  <>
                    <BadgeAlert className="shrink-0 w-4 h-4" />
                    Separate each option by pressing Tab or Enter.
                  </>
                ) : (
                  error.message
                )}
              </span>
            </div>
            <div className="self-end">
              <Button onClick={addVariant} type="button" disabled={disable}>
                Add Variant
              </Button>
            </div>
          </div>
        </div>
      </div>
      {attributesNameList.length ? (
        <DraggableTable
          items={dataIds}
          columns={columns}
          data={results}
          handleDragEnd={handleDragEnd}
        />
      ) : (
        ''
      )}
    </>
  );
};

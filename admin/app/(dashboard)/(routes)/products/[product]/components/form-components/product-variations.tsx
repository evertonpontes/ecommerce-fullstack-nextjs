'use client';

import React, { useEffect, useRef, useContext, useState } from 'react';
import { cn, generateNameSlug } from '@/lib/utils';
import { object, z, ZodIssue } from 'zod';

import { Pen, Plus, Save, Trash2, X } from 'lucide-react';

import {
  formSchema,
  productBase,
  ProductFormContext,
  variationOptionSchema,
  variationSchema,
} from './product-form';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UseFormReturn } from 'react-hook-form';

type VariationValues = z.infer<typeof variationSchema>;

function generateVariants(
  variations: VariationValues[],
  form: UseFormReturn<z.infer<typeof formSchema>>,
  existingVariants: z.infer<typeof productBase>[]
): z.infer<typeof productBase>[] {
  function generateCombinations(
    variations: VariationValues[],
    combination: { [key: string]: string } = {},
    result: { [key: string]: string }[] = []
  ) {
    if (!variations.length) {
      result.push(combination);
      return result;
    }

    const currentVariation = variations[0].slug;
    const variationOptions = variations[0].options;
    const remainingVariations = variations.slice(1);

    for (const option of variationOptions) {
      generateCombinations(
        remainingVariations,
        { ...combination, [currentVariation]: option.optionSlug },
        result
      );
    }

    return result;
  }

  const combinations = generateCombinations(variations);

  const newVariants = combinations.map((combination) => {
    // Attempt to find an existing variant that matches on shared properties
    const matchedVariant = form.watch('hasVariant').find((variant) => {
      return Object.entries(combination).some(
        ([key, value]) => variant.combination[key] === value
      );
    });

    return {
      ...(matchedVariant || form.getValues()),
      combination,
      hasVariant: [],
      name:
        form.getValues().name +
        ' ' +
        Object.values(combination)
          .map((x) => x.toUpperCase())
          .join(' - '),
      variesBy: form.getValues().variesBy,
      images: matchedVariant?.images || [],
    };
  });

  return newVariants;
}

export const ProductVariations = ({
  variationId,
  onEditingVariantChange,
}: {
  variationId?: number;
  onEditingVariantChange?: (value: boolean) => void;
}) => {
  const { form, onVariationsChange, states, onVariantsChange } =
    useContext(ProductFormContext);
  const [variation, setVariation] = useState<VariationValues>(
    variationId !== undefined
      ? form.getValues().variesBy[variationId]
      : {
          name: '',
          slug: '',
          options: [],
        }
  );
  const [errors, setErrors] = useState<ZodIssue[]>([]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setVariation((prev) => ({ ...prev, [name]: value }));
  }

  function handleAddOption(value: string) {
    const options = [...variation.options];
    const newOption: z.infer<typeof variationOptionSchema> = {
      value,
      optionSlug: generateNameSlug(value),
      swatch: {
        swatchShape: 'SQUARE',
        swatchType: 'TEXT',
        swatchText: value,
      },
    };
    options.push(newOption);

    setVariation((prev) => ({ ...prev, options }));
  }

  function handleRemoveOption(optionValue: string) {
    const options = [...variation.options];
    const newOptions = options.filter((option) => option.value !== optionValue);

    setVariation((prev) => ({ ...prev, options: newOptions }));
  }

  function handleAddVariation() {
    setErrors([]);
    const body = { ...variation, name: variation.name.trim() };
    const result = variationSchema.safeParse(body);

    if (!result.success) {
      setErrors(result.error.issues);
    } else {
      const { variations } = states;

      const newVariations = [...variations];

      if (variationId !== undefined) {
        newVariations[variationId] = variation;
      } else {
        newVariations.push(variation);
      }

      const uniqueNames = new Set([...newVariations].map((item) => item.name));
      const uniqueSlugs = new Set([...newVariations].map((item) => item.slug));

      const isVariationUnique =
        uniqueNames.size === [...newVariations].length &&
        uniqueSlugs.size === [...newVariations].length;

      if (!isVariationUnique) {
        setErrors([
          {
            message: 'Name or slug already exists.',
            path: ['name', 'slug'],
          } as ZodIssue,
        ]);
      } else {
        onVariationsChange([...newVariations]);
        form.setValue('variesBy', [...newVariations]);
        onVariantsChange(
          generateVariants([...newVariations], form, states.variants)
        );
        form.setValue(
          'hasVariant',
          generateVariants([...newVariations], form, states.variants)
        );
      }
    }
    setVariation({
      name: '',
      slug: '',
      options: [],
    });

    onEditingVariantChange?.(false);
  }

  function ErrorMessage({ name }: { name: string }) {
    const message = errors.find((issue) => issue.path.includes(name))?.message;

    return message ? <p className="text-sm text-destructive">{message}</p> : '';
  }

  useEffect(() => {
    setVariation((prev) => ({
      ...prev,
      slug: generateNameSlug(variation.name),
    }));
  }, [variation.name]);

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold">Product Variations</h2>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <Label
            className={cn(
              errors.find((issue) => issue.path.includes('name'))
                ? 'text-destructive'
                : ''
            )}
            htmlFor="variation-name"
          >
            Variation Name
          </Label>
          <Input
            id="variation-name"
            value={variation.name}
            name="name"
            placeholder="e.g. Color"
            onChange={handleChange}
          />
          <ErrorMessage name="name" />
        </div>
        <div className="space-y-2">
          <Label
            className={cn(
              errors.find((issue) => issue.path.includes('name'))
                ? 'text-destructive'
                : ''
            )}
            htmlFor="variation-slug"
          >
            Variation Slug
          </Label>
          <Input
            id="variation-slug"
            name="slug"
            value={variation.slug}
            placeholder="e.g. color"
            onChange={handleChange}
          />
          <ErrorMessage name="slug" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="variation-options">Variation Options</Label>
          <InputOptions
            id="variation-options"
            placeholder={
              variation.options.length ? '' : 'e.g. Red, Green, Blue.'
            }
            onAddKeyword={handleAddOption}
            onRemoveKeyword={handleRemoveOption}
            keywords={variation.options.map((option) => option.value)}
          />
        </div>
      </div>
      <Button
        type="button"
        variant={'outline'}
        className="border-primary text-primary hover:text-primary"
        onClick={handleAddVariation}
      >
        {variationId !== undefined ? (
          <>
            <Save className="size-4 flex-shrink-0 mr-2" />
            Save
          </>
        ) : (
          <>
            <Plus className="size-4 flex-shrink-0 mr-2" />
            Add New Variation
          </>
        )}
      </Button>
    </div>
  );
};

interface InputOptionsProps extends React.HTMLProps<HTMLInputElement> {
  keywords?: string[];
  onAddKeyword?: (keyword: string) => void;
  onRemoveKeyword?: (keyword: string) => void;
}

const InputOptions: React.FC<InputOptionsProps> = ({
  className,
  keywords,
  onAddKeyword,
  onRemoveKeyword,
  ...props
}) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(event.target.value);
  }

  function handleInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Tab' || event.key === 'Enter') {
      event.preventDefault();
      if (
        onAddKeyword &&
        inputValue.trim() &&
        !keywords?.includes(inputValue.trim())
      ) {
        onAddKeyword(inputValue.trim());
        setInputValue('');
      }
    } else if (
      event.key === 'Backspace' &&
      inputValue === '' &&
      keywords?.length
    ) {
      if (onRemoveKeyword) onRemoveKeyword(keywords[keywords.length - 1]);
    }
  }

  function handleWrapperClick() {
    inputRef.current?.focus();
  }

  return (
    <div className="w-full">
      <div
        onClick={handleWrapperClick}
        className={cn(
          'bg-background flex flex-wrap items-center border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
          className
        )}
      >
        {keywords?.map((value, index) => (
          <span
            key={index}
            className="inline-flex items-center m-1 px-2 py-1 rounded-full text-sm bg-primary text-primary-foreground"
          >
            {value}
            <button
              type="button"
              className="ml-1 focus:outline-none"
              onClick={(e) => {
                e.stopPropagation();
                if (onRemoveKeyword) onRemoveKeyword(value);
              }}
            >
              <X className="size-4" />
            </button>
          </span>
        ))}
        <Input
          ref={inputRef}
          value={inputValue}
          className="flex-grow border-none focus-visible:ring-0 focus-visible:ring-offset-0"
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          {...props}
        />
      </div>
    </div>
  );
};

export const ShowVariations = () => {
  const { form, states, onVariationsChange, onVariantsChange } =
    useContext(ProductFormContext);
  const [activatedEditing, setActivatedEditing] = useState<
    Record<number, boolean>
  >({});

  function handleActivateEditingVariation(index: number) {
    setActivatedEditing((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  }

  function handleDeleteVariation(varIndex: number) {
    const filteredVariations = states?.variations?.filter(
      (_, index) => index !== varIndex
    )!;

    onVariationsChange?.([...filteredVariations]);
    form.setValue('variesBy', [...filteredVariations]);

    if (!filteredVariations.length) {
      onVariantsChange([]);
      form.setValue('hasVariant', []);
    } else {
      onVariantsChange(
        generateVariants(filteredVariations, form, states.variants)
      );
      form.setValue(
        'hasVariant',
        generateVariants(filteredVariations, form, states.variants)
      );
    }
  }

  return states?.variations?.map((variation, index) => (
    <Card key={index}>
      {!activatedEditing[index] ? (
        <CardContent>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>{variation.name}</CardTitle>
            <div className="space-x-1">
              <Button
                type="button"
                variant={'ghost'}
                size={'icon'}
                onClick={() => handleActivateEditingVariation(index)}
                title="Edit"
              >
                <Pen className="size-4 text-muted-foreground" />
              </Button>
              <Button
                type="button"
                variant={'ghost'}
                size={'icon'}
                onClick={() => handleDeleteVariation(index)}
                title="Delete"
              >
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </div>
          </CardHeader>
          <div className="flex flex-wrap items-center">
            {variation.options.map((option, opIndex) => (
              <span
                key={opIndex}
                className="inline-flex items-center m-1 px-2 py-1 rounded-full text-sm bg-primary text-primary-foreground"
              >
                {option.value}
              </span>
            ))}
          </div>
        </CardContent>
      ) : (
        <CardContent className="p-8">
          <ProductVariations
            variationId={index}
            onEditingVariantChange={(value) =>
              setActivatedEditing((prev) => ({
                ...prev,
                [index]: value,
              }))
            }
          />
        </CardContent>
      )}
    </Card>
  ));
};

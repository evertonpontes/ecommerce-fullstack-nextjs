'use client';

import React, { useContext, useEffect, useState } from 'react';
import {
  ProductFormContext,
  variationOptionSchema,
  variationSchema,
} from './product-form';
import { Badge } from '@/components/ui/badge';
import { cn, formatter } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import VariationSwatchForm from './variation-swatches';
import { cva, type VariantProps } from 'class-variance-authority';
import { z } from 'zod';

export const ProductSwatches = () => {
  const { form, states } = useContext(ProductFormContext);
  const [editingSwatches, setEditingSwatches] = useState(false);

  return (
    <div className="space-y-8">
      {states.variations.length ? (
        <div className="flex items-center space-x-2">
          <Checkbox
            id="edit-variations-swatches"
            checked={editingSwatches}
            onCheckedChange={() => setEditingSwatches(!editingSwatches)}
          />
          <Label htmlFor="edit-variations-swatches">
            Edit variations swatches
          </Label>
          <p className="text-sm text-muted-foreground">
            (how the variations will be displayed in the product page.)
          </p>
        </div>
      ) : null}
      {editingSwatches && <VariationSwatchForm />}
      <ProductPage />
    </div>
  );
};

const ProductPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const route = useRouter();
  const { form } = useContext(ProductFormContext);

  const setSearchParams = (query: { [key: string]: string }) => {
    const currentSearchParams = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(query)) {
      if (value) {
        currentSearchParams.set(key, value);
      } else {
        currentSearchParams.delete(key);
      }
    }
    route.push(
      `/products/${params.product}?${currentSearchParams.toString()}`,
      {
        scroll: false,
      }
    );
  };

  const currentProduct = () => {
    if (!form.watch('hasVariant').length) return form.getValues();
    else {
      if (!searchParams.size) {
        return form.watch('hasVariant')[0];
      } else {
        const combination = Object.fromEntries(searchParams.entries());
        const product = form.watch('hasVariant').find((variant) => {
          return Object.entries(combination).every(([key, value]) => {
            return variant.combination[key] === value;
          });
        });

        return product || form.watch('hasVariant')[0];
      }
    }
  };

  // Disable variation option button if variant is undefined or variant stock is 0
  const isDisabled = (combination: { [key: string]: string }) => {
    const variant = form.watch('hasVariant').find((variant) => {
      return Object.entries(combination).every(([key, value]) => {
        return variant.combination[key] === value;
      });
    });
    return !variant || variant.stock === 0;
  };

  const description = currentProduct().description;
  const price =
    currentProduct().discount === 0
      ? currentProduct().price
      : currentProduct().price -
        (currentProduct().price * currentProduct().discount) / 100;
  const paragraphRef = React.useRef<HTMLParagraphElement>(null);

  React.useEffect(() => {
    if (paragraphRef.current) {
      paragraphRef.current.innerHTML = description;
    }
  }, [description]);

  const optionSelected = (
    option: z.infer<typeof variationOptionSchema>,
    variation: z.infer<typeof variationSchema>
  ) => {
    return (
      Object.fromEntries(searchParams.entries())[variation.slug] ===
      option.optionSlug
    );
  };

  return (
    <div className="w-full grid xl:grid-cols-2 gap-8 xl:gap-4 border rounded-md bg-background p-8">
      <ImageDisplay images={currentProduct().images} />
      <div className="space-y-8">
        <h1 className="text-2xl sm:text-4xl font-semibold">
          {currentProduct().name}
        </h1>
        <div className="flex gap-2 items-center">
          <Badge>{formatter.format(price)} USD</Badge>
          {currentProduct().discount > 0 && (
            <>
              <s className="text-sm text-muted-foreground">
                {formatter.format(currentProduct().price)} USD
              </s>
              <Badge variant="secondary">
                {currentProduct().discount}% OFF
              </Badge>
            </>
          )}
        </div>
        <Separator />
        {currentProduct().variesBy.map((variation, index) => (
          <dl key={index} className="space-y-4">
            <dt>{variation.name}</dt>
            <dd className="flex gap-4">
              {variation.options.map((option, index) => (
                <Button
                  type="button"
                  key={index}
                  variant="secondary"
                  size={'sm'}
                  className={cn(
                    'border border-input hover:border-primary transition-colors min-w-9 h-9',
                    optionSelected(option, variation) &&
                      'ring-2 ring-ring ring-offset-2',
                    isDisabled({
                      ...currentProduct().combination,
                      [variation.slug]: option.optionSlug,
                    }) &&
                      'overflow-hidden relative before:absolute before:inset-x-0 before:-z-10 before:h-px before:-rotate-45 before:bg-neutral-400 before:transition-transform',
                    option.swatch?.swatchShape === 'CIRCLE' && 'rounded-full'
                  )}
                  style={{
                    backgroundColor:
                      option.swatch?.swatchType === 'COLOR'
                        ? option.swatch?.swatchColor
                        : '',
                    backgroundImage:
                      option.swatch?.swatchType === 'IMAGE'
                        ? `url(${option.swatch?.swatchThumbnailUrl})`
                        : '',
                    backgroundSize: 'cover',
                  }}
                  title={variation.name + '-' + option.value}
                  onClick={() => {
                    setSearchParams({
                      [variation.slug]: option.optionSlug,
                    });
                  }}
                  disabled={isDisabled({
                    ...currentProduct().combination,
                    [variation.slug]: option.optionSlug,
                  })}
                >
                  {option.swatch?.swatchType === 'TEXT' &&
                    option.swatch.swatchText}
                </Button>
              ))}
            </dd>
          </dl>
        ))}
        <p ref={paragraphRef}></p>
        <Button type="button" disabled size={'lg'} className="rounded-full">
          <Plus className="mr-2 h-6 w-6" />
          <p className="text-xl">Add to cart</p>
        </Button>
      </div>
    </div>
  );
};

const ImageDisplay = ({ images }: { images: { url: string }[] }) => {
  const [imagesToDisplay, setImagesToDisplay] = useState<typeof images>([]);
  const [firstIndex, setFirstIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastIndex, setLastIndex] = useState(3);

  //reset indexes if images change
  useEffect(() => {
    setFirstIndex(0);
    setLastIndex(3);
    setCurrentIndex(0);
  }, [images]);

  useEffect(() => {
    setImagesToDisplay(images.slice(firstIndex, lastIndex));
  }, [firstIndex, lastIndex, images]);

  const handlePrev = () => {
    if (firstIndex > 0 && currentIndex - 1 === firstIndex) {
      setFirstIndex(firstIndex - 1);
      setLastIndex(lastIndex - 1);
    }
    setCurrentIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex + 1 === lastIndex && lastIndex < images.length) {
      setFirstIndex(firstIndex + 1);
      setLastIndex(lastIndex + 1);
    }
    setCurrentIndex(currentIndex + 1);
  };

  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < images.length - 1;

  const handleClickOnImage = (url: string) => {
    const index = images.findIndex((image) => image.url === url);
    if (firstIndex > 0 && index === firstIndex) {
      setFirstIndex(firstIndex - 1);
      setLastIndex(lastIndex - 1);
    } else if (index + 1 === lastIndex && lastIndex < images.length) {
      setFirstIndex(firstIndex + 1);
      setLastIndex(lastIndex + 1);
    }
    setCurrentIndex(index);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] relative overflow-hidden mb-4">
        <Image
          src={
            images[currentIndex]?.url || 'https://placehold.co/500x500?text=500'
          }
          alt="variant-image"
          className="absolute object-contain"
          fill
          sizes="(min-width: 1024px) 66vw, 100vw"
        />
        <div
          className="flex items-center
        gap-2 absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/20 p-2 rounded-full backdrop-blur-sm border border-background/30"
        >
          <Button
            type="button"
            onClick={handlePrev}
            variant="link"
            size="icon"
            disabled={!canGoBack}
            title="Go back"
          >
            <ChevronLeft className="h-6 w-6 hover:h-7 hover:w-7 transition-all" />
          </Button>
          <div className="h-8 w-px bg-primary" />
          <Button
            type="button"
            onClick={handleNext}
            variant="link"
            size="icon"
            disabled={!canGoForward}
            title="Go forward"
          >
            <ChevronRight className="h-6 w-6 hover:h-7 hover:w-7 transition-all" />
          </Button>
        </div>
      </div>
      <div className="w-full flex gap-4 items-center justify-center mx-4">
        {imagesToDisplay.map(({ url }, index) => (
          <button
            type="button"
            key={index}
            className={cn(
              'h-16 w-16 sm:h-20 sm:w-20 relative rounded-md overflow-hidden ring-offset-background border border-input',
              url === images[currentIndex]?.url &&
                'ring-2 ring-ring ring-offset-2'
            )}
            onClick={() => handleClickOnImage(url)}
          >
            <Image
              src={url || 'https://placehold.co/80x80?text=80'}
              alt="variant-image"
              className="absolute object-contain hover:scale-110 transition-all"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

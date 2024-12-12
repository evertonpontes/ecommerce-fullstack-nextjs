'use client';

import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  productBase,
  ProductFormContext,
  variationOptionSchema,
  variationSchema,
} from './product-form';
import { Badge } from '@/components/ui/badge';
import { cn, formatter } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Heart, Plus } from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import VariationSwatchForm from './variation-swatches';
import { z } from 'zod';

export const ProductSwatches = () => {
  const { states } = useContext(ProductFormContext);
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
      {editingSwatches && states.variations.length && <VariationSwatchForm />}
      <ProductPage />
    </div>
  );
};

const ProductPage = () => {
  const searchParams = useSearchParams();
  const { states } = useContext(ProductFormContext);
  const { productBaseState, variants } = states;

  const currentProduct = useMemo(() => {
    if (!variants.length) return productBaseState;
    else {
      if (!searchParams.size) {
        return variants[0];
      } else {
        const combination = Object.fromEntries(searchParams.entries());
        const product = variants.find((variant) => {
          return Object.entries(combination).every(([key, value]) => {
            return variant.combination[key] === value;
          });
        });

        return product || variants[0];
      }
    }
  }, [variants, productBaseState, searchParams]);

  const description = currentProduct.description;

  const price =
    currentProduct.discount === 0
      ? currentProduct.price
      : currentProduct.price -
        (currentProduct.price * currentProduct.discount) / 100;

  const paragraphRef = React.useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (paragraphRef.current) {
      paragraphRef.current.innerHTML = description;
    }
  }, [description]);

  return (
    <div className="w-full grid xl:grid-cols-2 gap-8 xl:gap-4 rounded-md">
      <ImageDisplay images={currentProduct.images} />
      <div className="space-y-8">
        <h1 className="text-md sm:text-4xl font-semibold">
          {currentProduct.name}
        </h1>
        <div className="flex gap-2 items-center">
          <Badge>{formatter.format(price)} USD</Badge>
          {currentProduct.discount > 0 && (
            <>
              <s className="text-sm text-muted-foreground">
                {formatter.format(currentProduct.price)} USD
              </s>
              <Badge variant="secondary">{currentProduct.discount}% OFF</Badge>
            </>
          )}
        </div>
        <Separator />
        {currentProduct.variesBy.map((variation, index) => (
          <dl key={index} className="space-y-4">
            <dt>{variation.name}</dt>
            <dd className="flex gap-4">
              {variation.options.map((option, index) => (
                <VariationOptionsButton
                  key={index}
                  option={option}
                  variation={variation}
                  currentProduct={currentProduct}
                />
              ))}
            </dd>
          </dl>
        ))}
        <p ref={paragraphRef}></p>
        <div className="flex justify-center items-center gap-2">
          <Button type="button" variant={'ghost'} size={'icon'} disabled>
            <Heart className="h-6 w-6" />
          </Button>
          <Button
            type="button"
            disabled
            size={'lg'}
            className="w-full md:w-[200px] rounded-none md:rounded-full"
          >
            <Plus className="mr-2 h-6 w-6" />
            <p className="md:text-xl">Add to cart</p>
          </Button>
        </div>
      </div>
    </div>
  );
};

interface VariationOptionsButtonProps {
  option: z.infer<typeof variationOptionSchema>;
  variation: z.infer<typeof variationSchema>;
  currentProduct: z.infer<typeof productBase>;
}

const VariationOptionsButton: React.FC<VariationOptionsButtonProps> = ({
  option,
  variation,
  currentProduct,
}) => {
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

  const optionSelected = (
    option: z.infer<typeof variationOptionSchema>,
    variation: z.infer<typeof variationSchema>
  ) => {
    return (
      Object.fromEntries(searchParams.entries())[variation.slug] ===
      option.optionSlug
    );
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

  const optionButtonVariants = cva(
    'border border-input hover:border-primary transition-colors min-w-9 h-9',
    {
      variants: {
        selected: {
          true: 'ring-2 ring-ring ring-offset-2',
          false: '',
        },
        disabled: {
          true: 'overflow-hidden relative before:absolute before:inset-x-0 before:-z-10 before:h-px before:-rotate-45 before:bg-neutral-400 before:transition-transform',
          false: '',
        },
        shape: {
          CIRCLE: 'rounded-full',
          SQUARE: '',
        },
      },
      defaultVariants: {
        selected: false,
        disabled: false,
        shape: 'SQUARE',
      },
    }
  );

  const styles: React.CSSProperties = {
    backgroundColor:
      option.swatch?.swatchType === 'COLOR' ? option.swatch?.swatchColor : '',
    backgroundImage:
      option.swatch?.swatchType === 'IMAGE'
        ? `url(${option.swatch?.swatchThumbnailUrl})`
        : '',
    backgroundSize: 'cover',
  };

  return (
    <Button
      type="button"
      key={option.optionSlug}
      variant="secondary"
      size={'sm'}
      className={cn(
        optionButtonVariants({
          selected: optionSelected(option, variation),
          disabled: isDisabled({
            ...currentProduct.combination,
            [variation.slug]: option.optionSlug,
          }),
          shape: option.swatch?.swatchShape,
        })
      )}
      style={styles}
      title={variation.name + '-' + option.value}
      onClick={() => {
        setSearchParams({
          [variation.slug]: option.optionSlug,
        });
      }}
      disabled={isDisabled({
        ...currentProduct.combination,
        [variation.slug]: option.optionSlug,
      })}
    >
      {option.swatch?.swatchType === 'TEXT' && option.swatch.swatchText}
    </Button>
  );
};

const ImageDisplay = ({ images }: { images: { url: string }[] }) => {
  const [imagesToDisplay, setImagesToDisplay] = useState<typeof images>([]);
  const [firstIndex, setFirstIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastIndex, setLastIndex] = useState(3);

  console.log(images[currentIndex]?.url);

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
    <div className="w-full h-full min-h-[550px] mb-4">
      <div className="absolute md:static w-[calc(100%+20px)] md:w-full h-full flex flex-col items-center overflow-hidden left-0 -m-[10px]">
        <div className="w-full h-full md:max-w-[550px] md:aspect-square relative mb-4">
          <Image
            src={
              images[currentIndex]?.url ||
              'https://placehold.co/500x500?text=500'
            }
            alt="variant-image"
            className="absolute object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxmaWx0ZXIgaWQ9ImEiPgogICAgPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iNSIvPgogIDwvZmlsdGVyPgogIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHN0eWxlPSJmaWxsOiBibGFjazsiIGZpbHRlcj0idXJsKCNhKSIvPgo8L3N2Zz4="
            fill
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
        <div className="w-full flex gap-4 items-center justify-center mx-4 my-2">
          {imagesToDisplay.map(({ url }, index) => (
            <button
              type="button"
              key={index}
              className={cn(
                'w-full h-full max-w-20 bg-background aspect-square relative rounded-md overflow-hidden ring-offset-background border border-input shrink-0',
                url === images[currentIndex]?.url &&
                  'ring-2 ring-ring ring-offset-2'
              )}
              onClick={() => handleClickOnImage(url)}
            >
              <Image
                src={url || 'https://placehold.co/80x80?text=80'}
                alt="variant-image-mini"
                className="absolute object-cover hover:scale-110 transition-all"
                sizes="80px"
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxmaWx0ZXIgaWQ9ImEiPgogICAgPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iNSIvPgogIDwvZmlsdGVyPgogIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHN0eWxlPSJmaWxsOiBibGFjazsiIGZpbHRlcj0idXJsKCNhKSIvPgo8L3N2Zz4="
                fill
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

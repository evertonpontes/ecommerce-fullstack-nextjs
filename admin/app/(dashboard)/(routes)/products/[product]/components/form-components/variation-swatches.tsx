'use client';

import { z } from 'zod';
import { ProductFormContext, variationOptionSchema } from './product-form';

import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

type SwatchType = 'COLOR' | 'IMAGE' | 'TEXT';
type SwatchShape = 'CIRCLE' | 'SQUARE';
type SwatchOption = z.infer<typeof variationOptionSchema>;

export default function VariationSwatchForm() {
  const { form, states, onVariationsChange } = useContext(ProductFormContext);
  const { variations } = states;
  const [selectedVariation, setSelectedVariation] = useState<string>(
    variations[0].name
  );

  const accordionItemRef = useRef<HTMLDivElement>(null);

  const selectedVariationOptions =
    variations.find((v) => v.name === selectedVariation)?.options || [];

  return (
    <div className="space-y-8 max-w-2xl p-6">
      <div>
        <Label htmlFor="variation-select">Select Variation</Label>
        <Select value={selectedVariation} onValueChange={setSelectedVariation}>
          <SelectTrigger id="variation-select">
            <SelectValue placeholder="Select a variation" />
          </SelectTrigger>
          <SelectContent>
            {variations.map((variation) => (
              <SelectItem key={variation.name} value={variation.name}>
                {variation.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {selectedVariationOptions.map((option, optIndex) => (
          <AccordionItem
            ref={accordionItemRef}
            key={option.value}
            value={option.value}
          >
            <AccordionTrigger>{option.value}</AccordionTrigger>
            <AccordionContent>
              <OptionContent
                option={option}
                optIndex={optIndex}
                variationName={selectedVariation}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

const OptionContent = ({
  option,
  optIndex,
  variationName,
}: {
  option: SwatchOption;
  optIndex: number;
  variationName: string;
}) => {
  const { form, states, onVariationsChange, onVariantsChange } =
    useContext(ProductFormContext);

  const [swatch, setSwatch] = useState(
    option.swatch || ({} as SwatchOption['swatch'])
  );

  const handleChange = ({ name, value }: { name: string; value: string }) => {
    setSwatch({ ...swatch, [name]: value });
  };

  const handleSave = () => {
    const variationId = states.variations.findIndex(
      (v) => v.name === variationName
    );

    form.setValue(`variesBy.${variationId}.options.${optIndex}.swatch`, swatch);
    onVariationsChange(form.getValues().variesBy);

    form.setValue(
      'hasVariant',
      states.variants.map((v) => ({
        ...v,
        variesBy: form.getValues().variesBy,
      }))
    );
    onVariantsChange(form.getValues().hasVariant);

    toast.success('Swatch saved successfully.');
  };

  return (
    <div className="space-y-4 p-6">
      <div className="space-y-2">
        <Label htmlFor={`swatch-type-${optIndex}`}>Swatch Type</Label>
        <Select
          value={swatch?.swatchType || 'TEXT'}
          name="swatchType"
          onValueChange={(value: SwatchType) =>
            handleChange({ name: 'swatchType', value })
          }
        >
          <SelectTrigger id={`swatch-type-${optIndex}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="COLOR">Color</SelectItem>
            <SelectItem value="IMAGE">Image</SelectItem>
            <SelectItem value="TEXT">Text</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Swatch Shape</Label>
        <RadioGroup
          value={swatch?.swatchShape || 'SQUARE'}
          name="swatchShape"
          onValueChange={(value: SwatchShape) =>
            handleChange({ name: 'swatchShape', value })
          }
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="SQUARE" id={`shape-square-${optIndex}`} />
            <Label htmlFor={`shape-square-${optIndex}`}>Square</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="CIRCLE" id={`shape-circle-${optIndex}`} />
            <Label htmlFor={`shape-circle-${optIndex}`}>Circle</Label>
          </div>
        </RadioGroup>
      </div>

      {swatch?.swatchType === 'COLOR' && (
        <div className="space-y-2">
          <Label htmlFor={`swatch-color-${optIndex}`}>Swatch Color</Label>
          <Input
            id={`swatch-color-${optIndex}`}
            type="color"
            name="swatchColor"
            value={swatch?.swatchColor || '#000000'}
            onChange={(e) =>
              handleChange({ name: e.target.name, value: e.target.value })
            }
          />
        </div>
      )}

      {swatch?.swatchType === 'IMAGE' && (
        <div className="space-y-2">
          <Label htmlFor={`swatch-image-${optIndex}`}>
            Swatch Thumbnail URL
          </Label>
          <Input
            id={`swatch-image-${optIndex}`}
            type="url"
            name="swatchThumbnailUrl"
            value={swatch?.swatchThumbnailUrl || ''}
            onChange={(e) =>
              handleChange({ name: e.target.name, value: e.target.value })
            }
            placeholder="https://example.com/image.jpg"
          />
        </div>
      )}

      {swatch?.swatchType === 'TEXT' && (
        <div className="space-y-2">
          <Label htmlFor={`swatch-text-${optIndex}`}>Swatch Text</Label>
          <Input
            id={`swatch-text-${optIndex}`}
            type="text"
            name="swatchText"
            value={swatch?.swatchText || ''}
            onChange={(e) =>
              handleChange({ name: e.target.name, value: e.target.value })
            }
            placeholder="Enter swatch text"
          />
        </div>
      )}

      <Button type="button" onClick={handleSave}>
        Save Changes
      </Button>
    </div>
  );
};

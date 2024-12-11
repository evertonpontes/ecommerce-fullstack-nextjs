'use client';

import React, { useContext, useEffect, useMemo, useState } from 'react';
import { ProductFormContext } from './product-form';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { formatter } from '@/lib/utils';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Edit,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Images } from './images';
import { TextEditor } from '@/components/ui/text-editor';

export const ProductVariants = () => {
  const { form, states } = useContext(ProductFormContext);
  // pagination
  // set first row and last row
  const [firstRow, setFirstRow] = useState(0);
  const [lastRow, setLastRow] = useState(5);
  // total rows 5
  const [totalRows, setTotalRows] = useState(5);
  // get list of pages
  const [pages, setPages] = useState<number[]>([]);
  // get current page
  const [currentPage, setCurrentPage] = useState(0);

  const [variantId, setVariantId] = useState<number | null>(null);

  // set function to handle next page and previous page
  const handleNextPage = () => {
    setFirstRow(firstRow + totalRows);
    setLastRow(lastRow + totalRows);
    setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    setFirstRow(firstRow - totalRows);
    setLastRow(lastRow - totalRows);
    setCurrentPage(currentPage - 1);
  };
  // set function to go to the last page
  const handleGoToLastPage = () => {
    setFirstRow(pages[pages.length - 1] * totalRows);
    setLastRow(pages[pages.length - 1] * totalRows + totalRows);
    setCurrentPage(pages.length - 1);
  };
  // set function to go to the first page
  const handleGoToFirstPage = () => {
    setFirstRow(0);
    setLastRow(totalRows);
    setCurrentPage(0);
  };

  // verify if can go to next page and previous page
  const canGoToNextPage = firstRow + totalRows < states.variants.length;
  const canGoToPreviousPage = firstRow > 0;

  // variant to slice the 5 first rows with useMemo
  const variants = useMemo(() => {
    return states.variants.slice(firstRow, lastRow);
  }, [firstRow, lastRow, states.variants]);

  // get a short list of pages with length 3 that change dynamically
  const shortPages = useMemo(() => {
    if (currentPage % 3 === 0) {
      return pages.slice(currentPage, currentPage + 3);
    } else if (currentPage % 3 === 1) {
      return pages.slice(currentPage - 1, currentPage + 2);
    } else if (currentPage % 3 === 2) {
      return pages.slice(currentPage - 2, currentPage + 1);
    }
    return pages.slice(0, 3);
  }, [currentPage, pages]);

  const onClickVariant = (index: number) => {
    if (variantId === index) {
      setVariantId(null);
    } else {
      setVariantId(index);
    }
  };

  useEffect(() => {
    setPages(
      Array.from(
        { length: Math.ceil(states.variants.length / totalRows) },
        (_, index) => index
      )
    );
  }, [states.variants.length, totalRows]);

  return variants.length ? (
    <div className="bg-background">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/60">
            <TableHead>Combination</TableHead>
            <TableHead>Price</TableHead>
            <TableHead className="hidden sm:table-cell">Stock</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {variants.map((variant, index) => (
            <TableRow key={index} className="even:bg-muted/60">
              <TableCell
                className={
                  variant.stock === 0
                    ? 'line-through text-muted-foreground'
                    : ''
                }
              >
                {Object.values(variant.combination).join(' / ').toUpperCase()}
              </TableCell>
              <TableCell>{formatter.format(variant.price)}</TableCell>
              <TableCell className="hidden sm:table-cell">
                {variant.stock}
              </TableCell>
              <TableCell>
                <EditProductVariantSidebar
                  variantCombination={variant.combination}
                  open={variantId === index}
                  onOpenChange={() => onClickVariant(index)}
                  onClose={() => onClickVariant(index)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex flex-grow items-center justify-end space-x-2 py-4 min-w-[460px]">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleGoToFirstPage}
          disabled={!canGoToPreviousPage}
          title="First"
        >
          <ChevronsLeft className="h-4 w-4 text-muted-foreground" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handlePreviousPage}
          disabled={!canGoToPreviousPage}
          title="Previous"
        >
          <ChevronLeft className="h-4 w-4 text-muted-foreground" />
        </Button>
        <div className="flex space-x-1">
          {shortPages.map((page) => (
            <Button
              type="button"
              variant={currentPage === page ? 'default' : 'ghost'}
              size={'sm'}
              key={page}
              className="size-9 rounded-full"
              onClick={() => {
                setCurrentPage(page);
                setFirstRow(page * totalRows);
                setLastRow(page * totalRows + totalRows);
              }}
            >
              {page + 1}
            </Button>
          ))}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleNextPage}
          disabled={!canGoToNextPage}
          title="Next"
        >
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleGoToLastPage}
          disabled={!canGoToNextPage}
          title="Last"
        >
          <ChevronsRight className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>
    </div>
  ) : null;
};

interface EditProductVariantSidebarProps {
  variantCombination: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
}

const EditProductVariantSidebar = ({
  variantCombination,
  open,
  onOpenChange,
  onClose,
}: EditProductVariantSidebarProps) => {
  const { form, states, onVariantsChange } = useContext(ProductFormContext);
  const variant = form
    .watch('hasVariant')
    .find(
      (variant) =>
        Object.values(variant.combination).join(' / ') ===
        Object.values(variantCombination).join(' / ')
    );

  const variantId = states.variants.findIndex(
    (variant) => variant.combination === variantCombination
  );
  const onDelete = () => {
    form.setValue(
      'hasVariant',
      states.variants.filter(
        (variant) => variant.combination !== variantCombination
      )
    );

    onVariantsChange(form.watch('hasVariant'));

    onClose();
  };

  useEffect(() => {
    onVariantsChange(form.watch('hasVariant'));
  }, [form, onVariantsChange]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button type="button" variant="ghost" size="sm" title="Edit">
          <Edit className="h-5 w-5 text-muted-foreground" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-4xl flex flex-col overflow-auto">
        <SheetHeader>
          <SheetTitle>
            Edit Variant - {Object.values(variant?.combination).join(' / ')}
          </SheetTitle>
          <SheetDescription>
            {"Make changes to your variant here. Click save when you're done."}
          </SheetDescription>
        </SheetHeader>
        <div className="py-2 pb-4 grid sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name={`hasVariant.${variantId}.name`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Type a name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`hasVariant.${variantId}.price`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Type a price"
                    step={0.01}
                    min={0}
                    type="number"
                    {...field}
                    onChange={({ target }) =>
                      field.onChange(Number(target.value))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`hasVariant.${variantId}.stock`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input
                    min={0}
                    placeholder="Type a stock"
                    type="number"
                    {...field}
                    onChange={({ target }) =>
                      field.onChange(Number(target.value))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`hasVariant.${variantId}.discount`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step={0.01}
                    min={0}
                    placeholder="Type a discount"
                    {...field}
                    onChange={({ target }) =>
                      field.onChange(Number(target.value))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`hasVariant.${variantId}.sku`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>SKU</FormLabel>
                <FormControl>
                  <Input placeholder="Type a sku" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <TextEditor
                    description={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="sm:col-span-2 mt-4">
            <Images name={`hasVariant.${variantId}.images`} />
          </div>
        </div>
        <SheetFooter>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Button type="button" onClick={onClose}>
              Save changes
            </Button>
            <p className="text-sm text-muted-foreground">or</p>
            <Button type="button" variant="destructive" onClick={onDelete}>
              Delete variant
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

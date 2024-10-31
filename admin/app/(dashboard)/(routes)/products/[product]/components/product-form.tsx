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

export const ProductForm = () => {
  return <div></div>;
};

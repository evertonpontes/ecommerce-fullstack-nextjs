import { auth } from '@/auth';
import { prisma } from '@/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const optionSwatchSchema = z.object({
  swatchType: z.enum(['COLOR', 'IMAGE', 'TEXT']).optional(),
  swatchShape: z.enum(['SQUARE', 'CIRCLE']).optional(),
  swatchColor: z.string().optional(),
  swatchThumbnailUrl: z.string().optional(),
  swatchText: z.string().optional(),
});

const variationOptionSchema = z.object({
  value: z
    .string()
    .max(50, { message: 'Value must be at most 50 characters.' }),
  optionSlug: z.string().regex(/^[a-z0-9-]+$/, {
    message: 'Slug can only contain lowercase letters, numbers, and hyphens.',
  }),
  swatch: optionSwatchSchema.optional(),
});

const variationSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'Name must be at least 2 characters.',
    })
    .max(50),
  slug: z.string().regex(/^[a-z0-9-]+$/, {
    message: 'Slug can only contain lowercase letters, numbers, and hyphens.',
  }),
  options: variationOptionSchema.array(),
});

const productBase = z.object({
  name: z
    .string()
    .min(2, {
      message: 'Name must be at least 2 characters.',
    })
    .max(50),
  sku: z
    .string()
    .min(2, {
      message: 'SKU must be at least 2 characters.',
    })
    .max(50),
  stock: z.number().int().nonnegative(),
  price: z.number().multipleOf(0.01).nonnegative(),
  description: z.string(),
  discount: z.number().multipleOf(0.01).max(100).nonnegative(),
  categoryId: z.string(),
  productAttributes: z.any(),
  images: z
    .object({
      url: z.string().url(),
    })
    .array(),
  variesBy: variationSchema.array(),
  combination: z.any(),
});

export const productSchema = productBase.extend({
  hasVariant: productBase.array(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();
    const data = productSchema.parse(body);

    if (!session || !session.user) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    const product = await prisma.product.create({
      data: {
        ...data,
        images: {
          createMany: {
            data: data.images,
          },
        },
        variesBy: {
          createMany: {
            data: data.variesBy,
          },
        },
        hasVariant: {
          createMany: {
            data: data.hasVariant,
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCTS_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        images: true,
        hasVariant: true,
        productGroup: true,
        variesBy: true,
        _count: true,
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log('[PRODUCTS_GET]', error);
    console.log(typeof error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

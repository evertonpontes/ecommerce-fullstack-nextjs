import { auth } from '@/auth';
import { prisma } from '@/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(2).max(50),
  title: z.string().min(2).max(50),
  brand: z.string().min(2).max(50),
  price: z.number().positive(),
  discount: z.number().min(0).max(100),
  amount: z.number().int().positive(),
  keywords: z.string().array(),
  description: z.string().min(2).max(500),
  images: z.string().array(),
  categoryId: z.string(),
  productAttributes: z
    .object({
      name: z.string().min(2).max(50),
      value: z.string().min(2).max(50),
    })
    .array(),
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
        keywords: data.keywords.join(' '),
        images: {
          createMany: {
            data: data.images.map((image: string) => ({ url: image })),
          },
        },
        productAttributes: {
          createMany: {
            data: data.productAttributes.map(
              (attr: { name: string; value: string }) => ({
                attributeName: attr.name,
                attributeValue: attr.value,
              })
            ),
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
        productAttributes: true,
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log('[PRODUCTS_GET]', error);
    console.log(typeof error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

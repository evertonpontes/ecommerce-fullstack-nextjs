import { auth } from '@/auth';
import { prisma } from '@/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export const categoryBase = z.object({
  name: z.string().min(2).max(50),
  slug: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[a-z0-9-]+$/, {
      message: 'Slug can only contain lowercase letters, numbers, and hyphens.',
    }),
  parentId: z.string().nullable(),
  attributes: z
    .object({
      name: z.string().min(2).max(50),
    })
    .array(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();
    const { name, attributes, parentId, slug } = categoryBase.parse(body);

    if (!session || !session.user) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        parentId: parentId || undefined,
        attributes: {
          createMany: {
            data: [...attributes.map((attr: { name: string }) => attr)],
          },
        },
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log('[CATEGORIES_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const categories = await prisma.category.findMany({
      include: {
        subCategories: true,
        attributes: true,
        parent: true,
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.log('[CATEGORIES_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

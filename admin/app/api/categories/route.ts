import { auth } from '@/auth';
import { prisma } from '@/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();
    const { name, imageUrl, parentId, description, attributes } = body;

    if (!session || !session.user) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    if (!name) {
      return new NextResponse('Name is required', { status: 400 });
    }

    if (!description) {
      return new NextResponse('Description is required', { status: 400 });
    }

    const category = await prisma.category.create({
      data: {
        name,
        imageUrl,
        parentId: parentId || undefined,
        description,
        attributes: undefined,
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
        childrens: true,
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

import { auth } from '@/auth';
import { prisma } from '@/prisma';
import { NextResponse } from 'next/server';

export async function PUT(
  req: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    if (!params.categoryId) {
      return new NextResponse('Category Id is required', { status: 400 });
    }

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

    const category = await prisma.category.update({
      where: {
        id: params.categoryId,
      },
      data: {
        name,
        imageUrl,
        parentId: parentId || undefined,
        description,
        attributes: {
          deleteMany: {
            categoryId: params.categoryId,
          },
          createMany: {
            data: [...attributes.map((attr: { name: string }) => attr)],
          },
        },
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log('[CATEGORIES_PUT]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    if (!params.categoryId) {
      return new NextResponse('Category Id is required', { status: 400 });
    }

    const category = await prisma.category.findUnique({
      where: {
        id: params.categoryId,
      },
      include: {
        attributes: {},
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log('[CATEGORIES_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    if (!params.categoryId) {
      return new NextResponse('Category Id is required', { status: 400 });
    }

    const session = await auth();

    if (!session || !session.user) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    const category = await prisma.category.delete({
      where: {
        id: params.categoryId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log('[CATEGORIES_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

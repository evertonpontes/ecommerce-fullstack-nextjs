import { auth } from '@/auth';
import { prisma } from '@/prisma';
import { NextResponse } from 'next/server';
import { productSchema } from '../route';

export async function PUT(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    if (!params.productId) {
      return new NextResponse('Product Id is required', { status: 400 });
    }

    const session = await auth();
    const body = await req.json();
    const data = productSchema.parse(body);

    if (!session || !session.user) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    const product = await prisma.product.update({
      where: {
        id: params.productId,
      },
      data: {
        ...data,
        images: {
          deleteMany: {
            productId: params.productId,
          },
          createMany: {
            data: data.images,
          },
        },
        variesBy: {
          deleteMany: {
            productId: params.productId,
          },
          createMany: {
            data: data.variesBy,
          },
        },
        hasVariant: {
          deleteMany: {
            productGroupId: params.productId,
          },
          createMany: {
            data: data.hasVariant,
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_PUT]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    if (!params.productId) {
      return new NextResponse('Product Id is required', { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        category: true,
        images: true,
        hasVariant: true,
        productGroup: true,
        variesBy: true,
        _count: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    if (!params.productId) {
      return new NextResponse('Product Id is required', { status: 400 });
    }

    const session = await auth();

    if (!session || !session.user) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    const product = await prisma.product.update({
      where: {
        id: params.productId,
      },
      data: {
        images: {
          deleteMany: {
            productId: params.productId,
          },
        },
        variesBy: {
          deleteMany: {
            productId: params.productId,
          },
        },
        hasVariant: {
          deleteMany: {
            productGroupId: params.productId,
          },
        },
      },
    });

    await prisma.product.delete({
      where: {
        id: params.productId,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

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
        keywords: data.keywords.join(' '),
        images: {
          deleteMany: {
            productId: params.productId,
          },
          createMany: {
            data: data.images.map((image: string) => ({ url: image })),
          },
        },
        productAttributes: {
          deleteMany: {
            productId: params.productId,
          },
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
        images: {},
        productAttributes: {},
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

    const product = await prisma.product.delete({
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

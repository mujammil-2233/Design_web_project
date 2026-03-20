import { NextRequest, NextResponse } from 'next/server';

// GET all products
export async function GET() {
  try {
    const { connectDB } = await import('@/lib/db');
    const Product = (await import('@/models/Product')).default;
    
    await connectDB();
    const products = await Product.find({ active: true }).sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST create new product
export async function POST(request: NextRequest) {
  try {
    const { connectDB } = await import('@/lib/db');
    const Product = (await import('@/models/Product')).default;
    
    await connectDB();
    const body = await request.json();

    const product = await Product.create(body);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

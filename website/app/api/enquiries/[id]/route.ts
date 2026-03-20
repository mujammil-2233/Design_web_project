import { NextRequest, NextResponse } from 'next/server';

// GET single enquiry
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { connectDB } = await import('@/lib/db');
    const Enquiry = (await import('@/models/Enquiry')).default;
    
    await connectDB();
    const { id } = await params;
    const enquiry = await Enquiry.findById(id).populate('productId');

    if (!enquiry) {
      return NextResponse.json(
        { error: 'Enquiry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(enquiry);
  } catch (error) {
    console.error('Error fetching enquiry:', error);
    return NextResponse.json(
      { error: 'Failed to fetch enquiry' },
      { status: 500 }
    );
  }
}

// PUT update enquiry status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { connectDB } = await import('@/lib/db');
    const Enquiry = (await import('@/models/Enquiry')).default;
    
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const enquiry = await Enquiry.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!enquiry) {
      return NextResponse.json(
        { error: 'Enquiry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(enquiry);
  } catch (error) {
    console.error('Error updating enquiry:', error);
    return NextResponse.json(
      { error: 'Failed to update enquiry' },
      { status: 500 }
    );
  }
}

// DELETE enquiry
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { connectDB } = await import('@/lib/db');
    const Enquiry = (await import('@/models/Enquiry')).default;
    
    await connectDB();
    const { id } = await params;

    const enquiry = await Enquiry.findByIdAndDelete(id);

    if (!enquiry) {
      return NextResponse.json(
        { error: 'Enquiry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Enquiry deleted successfully' });
  } catch (error) {
    console.error('Error deleting enquiry:', error);
    return NextResponse.json(
      { error: 'Failed to delete enquiry' },
      { status: 500 }
    );
  }
}

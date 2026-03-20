import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Enquiry from '@/models/Enquiry';

// GET all enquiries
export async function GET() {
  try {
    await connectDB();
    const enquiries = await Enquiry.find()
      .sort({ createdAt: -1 })
      .populate('productId', 'name category');
    return NextResponse.json(enquiries);
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch enquiries' },
      { status: 500 }
    );
  }
}

// POST create new enquiry
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const enquiry = await Enquiry.create(body);
    
    // Return enquiry data for WhatsApp message
    return NextResponse.json({
      ...enquiry.toObject(),
      message: 'Enquiry created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating enquiry:', error);
    return NextResponse.json(
      { error: 'Failed to create enquiry' },
      { status: 500 }
    );
  }
}

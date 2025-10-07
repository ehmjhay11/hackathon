import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Donation from '@/models/Donation';

// GET /api/donations/[id] - Get donation by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const donation = await Donation.findOne({ donation_id: id });
    
    if (!donation) {
      return NextResponse.json(
        { success: false, error: 'Donation not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: donation });
  } catch (error: unknown) {
    console.error('Failed to fetch donation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch donation' },
      { status: 500 }
    );
  }
}

// PUT /api/donations/[id] - Update donation by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const body = await request.json();
    const { id } = await params;
    
    const donation = await Donation.findOneAndUpdate(
      { donation_id: id },
      body,
      { new: true, runValidators: true }
    );
    
    if (!donation) {
      return NextResponse.json(
        { success: false, error: 'Donation not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: donation });
  } catch (error: unknown) {
    console.error('Failed to update donation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update donation' },
      { status: 500 }
    );
  }
}

// DELETE /api/donations/[id] - Delete donation by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const donation = await Donation.findOneAndDelete({ donation_id: id });
    
    if (!donation) {
      return NextResponse.json(
        { success: false, error: 'Donation not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: donation });
  } catch (error: unknown) {
    console.error('Failed to delete donation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete donation' },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Donation from '@/models/Donation';
import { handleMongoError } from '@/lib/errorHandler';

// GET /api/donations - Get all donations
export async function GET() {
  try {
    await connectDB();
    const donations = await Donation.find({});
    return NextResponse.json({ success: true, data: donations });
  } catch (error: unknown) {
    console.error('Failed to fetch donations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch donations' },
      { status: 500 }
    );
  }
}

// POST /api/donations - Create new donation
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    const donation = await Donation.create(body);
    return NextResponse.json(
      { success: true, data: donation },
      { status: 201 }
    );
  } catch (error: unknown) {
    const { status, message } = handleMongoError(error);
    return NextResponse.json(
      { success: false, error: message },
      { status }
    );
  }
}
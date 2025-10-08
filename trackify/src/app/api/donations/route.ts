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
    
    // Validate donation data based on type
    if (body.type === 'monetary') {
      if (!body.amount || body.amount <= 0) {
        return NextResponse.json(
          { success: false, error: 'Valid amount is required for monetary donations' },
          { status: 400 }
        );
      }
    } else if (body.type === 'item') {
      if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
        return NextResponse.json(
          { success: false, error: 'At least one item is required for item donations' },
          { status: 400 }
        );
      }
      
      // Validate each item
      for (const item of body.items) {
        if (!item.name || !item.quantity || item.quantity <= 0) {
          return NextResponse.json(
            { success: false, error: 'Each item must have a valid name and quantity' },
            { status: 400 }
          );
        }
      }
    } else {
      return NextResponse.json(
        { success: false, error: 'Donation type must be either "monetary" or "item"' },
        { status: 400 }
      );
    }
    
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
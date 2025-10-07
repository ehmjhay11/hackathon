import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Purchase from '@/models/Purchase';
import { handleMongoError } from '@/lib/errorHandler';

// GET /api/purchases - Get all purchases
export async function GET() {
  try {
    await connectDB();
    const purchases = await Purchase.find({});
    return NextResponse.json({ success: true, data: purchases });
  } catch (error: unknown) {
    console.error('Failed to fetch purchases:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch purchases' },
      { status: 500 }
    );
  }
}

// POST /api/purchases - Create new purchase
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    const purchase = await Purchase.create(body);
    return NextResponse.json(
      { success: true, data: purchase },
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
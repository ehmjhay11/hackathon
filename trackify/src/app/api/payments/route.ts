import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Payment from '@/models/Payment';
import { handleMongoError } from '@/lib/errorHandler';

// GET /api/payments - Get all payments
export async function GET() {
  try {
    await connectDB();
    const payments = await Payment.find({});
    return NextResponse.json({ success: true, data: payments });
  } catch (error) {
    console.error('Failed to fetch payments:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}

// POST /api/payments - Create new payment
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    const payment = await Payment.create(body);
    return NextResponse.json(
      { success: true, data: payment },
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
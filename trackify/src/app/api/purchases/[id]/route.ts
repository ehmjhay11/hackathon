import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Purchase from '@/models/Purchase';

// GET /api/purchases/[id] - Get purchase by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const purchase = await Purchase.findOne({ purchase_id: id });
    
    if (!purchase) {
      return NextResponse.json(
        { success: false, error: 'Purchase not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: purchase });
  } catch (error: unknown) {
    console.error('Failed to fetch purchase:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch purchase' },
      { status: 500 }
    );
  }
}

// PUT /api/purchases/[id] - Update purchase by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const body = await request.json();
    const { id } = await params;
    
    const purchase = await Purchase.findOneAndUpdate(
      { purchase_id: id },
      body,
      { new: true, runValidators: true }
    );
    
    if (!purchase) {
      return NextResponse.json(
        { success: false, error: 'Purchase not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: purchase });
  } catch (error: unknown) {
    console.error('Failed to update purchase:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update purchase' },
      { status: 500 }
    );
  }
}

// DELETE /api/purchases/[id] - Delete purchase by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const purchase = await Purchase.findOneAndDelete({ purchase_id: id });
    
    if (!purchase) {
      return NextResponse.json(
        { success: false, error: 'Purchase not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: purchase });
  } catch (error: unknown) {
    console.error('Failed to delete purchase:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete purchase' },
      { status: 500 }
    );
  }
}
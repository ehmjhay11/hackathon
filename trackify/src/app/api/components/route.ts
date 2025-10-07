import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Component from '@/models/Component';
import { handleMongoError } from '@/lib/errorHandler';

// GET /api/components - Get all components
export async function GET() {
  try {
    await connectDB();
    const components = await Component.find({});
    return NextResponse.json({ success: true, data: components });
  } catch (error: unknown) {
    console.error('Failed to fetch components:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch components' },
      { status: 500 }
    );
  }
}

// POST /api/components - Create new component
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    const component = await Component.create(body);
    return NextResponse.json(
      { success: true, data: component },
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
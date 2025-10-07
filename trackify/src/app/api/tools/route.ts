import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Tool from '@/models/Tool';
import { handleMongoError } from '@/lib/errorHandler';

// GET /api/tools - Get all tools
export async function GET() {
  try {
    await connectDB();
    const tools = await Tool.find({});
    return NextResponse.json({ success: true, data: tools });
  } catch (error: unknown) {
    console.error('Failed to fetch tools:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tools' },
      { status: 500 }
    );
  }
}

// POST /api/tools - Create new tool
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    const tool = await Tool.create(body);
    return NextResponse.json(
      { success: true, data: tool },
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
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Tool from '@/models/Tool';

// GET /api/tools/[id] - Get tool by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const tool = await Tool.findOne({ tool_id: id });
    
    if (!tool) {
      return NextResponse.json(
        { success: false, error: 'Tool not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: tool });
  } catch (error: unknown) {
    console.error('Failed to fetch tool:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tool' },
      { status: 500 }
    );
  }
}

// PUT /api/tools/[id] - Update tool by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const body = await request.json();
    const { id } = await params;
    
    const tool = await Tool.findOneAndUpdate(
      { tool_id: id },
      body,
      { new: true, runValidators: true }
    );
    
    if (!tool) {
      return NextResponse.json(
        { success: false, error: 'Tool not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: tool });
  } catch (error: unknown) {
    console.error('Failed to update tool:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update tool' },
      { status: 500 }
    );
  }
}

// DELETE /api/tools/[id] - Delete tool by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const tool = await Tool.findOneAndDelete({ tool_id: id });
    
    if (!tool) {
      return NextResponse.json(
        { success: false, error: 'Tool not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: tool });
  } catch (error: unknown) {
    console.error('Failed to delete tool:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete tool' },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Component from '@/models/Component';

// GET /api/components/[id] - Get component by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const component = await Component.findOne({ component_id: id });
    
    if (!component) {
      return NextResponse.json(
        { success: false, error: 'Component not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: component });
  } catch (error: unknown) {
    console.error('Failed to fetch component:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch component' },
      { status: 500 }
    );
  }
}

// PUT /api/components/[id] - Update component by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const body = await request.json();
    const { id } = await params;
    
    const component = await Component.findOneAndUpdate(
      { component_id: id },
      body,
      { new: true, runValidators: true }
    );
    
    if (!component) {
      return NextResponse.json(
        { success: false, error: 'Component not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: component });
  } catch (error: unknown) {
    console.error('Failed to update component:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update component' },
      { status: 500 }
    );
  }
}

// DELETE /api/components/[id] - Delete component by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const component = await Component.findOneAndDelete({ component_id: id });
    
    if (!component) {
      return NextResponse.json(
        { success: false, error: 'Component not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: component });
  } catch (error: unknown) {
    console.error('Failed to delete component:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete component' },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Tool from '@/models/Tool';
import mongoose from 'mongoose';

// Component schema for admin queries
const componentSchema = new mongoose.Schema({
  component_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  minStock: { type: Number, default: 5 },
  supplier: { type: String },
  lastRestocked: { type: Date }
}, { timestamps: true, collection: 'components' });

const Component = mongoose.models.Component || mongoose.model('Component', componentSchema, 'components');

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'tools', 'components', or 'all'
    const category = searchParams.get('category');
    const available = searchParams.get('available');

    let tools = [];
    let components = [];

    // Fetch tools if requested
    if (!type || type === 'all' || type === 'tools') {
      const toolQuery: any = {};
      // Note: Tool model doesn't have category field, but has status
      if (available !== null) {
        toolQuery.status = available === 'true' ? 'available' : { $ne: 'available' };
      }

      tools = await Tool.find(toolQuery).sort({ toolName: 1 });
    }

    // Fetch components if requested
    if (!type || type === 'all' || type === 'components') {
      const componentQuery: any = {};
      if (category) componentQuery.type = category;
      if (available !== null) {
        componentQuery.stock = available === 'true' ? { $gt: 0 } : { $eq: 0 };
      }

      components = await Component.find(componentQuery).sort({ name: 1 });
    }

    // Combine and format inventory data
    const inventory = [
      ...tools.map(tool => ({
        ...tool.toObject(),
        _id: tool._id,
        name: tool.toolName,
        type: 'tool',
        category: 'General Equipment', // Default category since Tool model doesn't have category
        price: 50, // Default hourly rate since Tool model doesn't have price
        available: tool.status === 'available'
      })),
      ...components.map(component => ({
        ...component.toObject(),
        type: 'component',
        available: component.stock > 0
      }))
    ];

    // Calculate statistics
    const stats = {
      totalTools: tools.length,
      availableTools: tools.filter(t => t.status === 'available').length,
      totalComponents: components.length,
      availableComponents: components.filter(c => c.stock > 0).length,
      lowStockComponents: components.filter(c => c.stock <= c.minStock).length,
      toolsInMaintenance: tools.filter(t => t.status === 'maintenance').length
    };

    // Get low stock alerts
    const lowStockAlerts = components
      .filter(c => c.stock <= c.minStock)
      .map(c => ({
        id: c.component_id,
        name: c.name,
        currentStock: c.stock,
        minStock: c.minStock
      }));

    return NextResponse.json({
      inventory,
      tools,
      components,
      stats,
      alerts: {
        lowStock: lowStockAlerts
      }
    });

  } catch (error) {
    console.error('Error fetching inventory:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { type, ...itemData } = await request.json();
    
    let newItem;
    
    if (type === 'tool') {
      newItem = new Tool(itemData);
    } else if (type === 'component') {
      newItem = new Component(itemData);
    } else {
      return NextResponse.json(
        { error: 'Invalid item type. Must be "tool" or "component"' },
        { status: 400 }
      );
    }

    await newItem.save();

    return NextResponse.json({
      ...newItem.toObject(),
      type,
      available: type === 'tool' ? newItem.available : newItem.stock > 0
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating inventory item:', error);
    return NextResponse.json(
      { error: 'Failed to create inventory item' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    const { id, type, ...updateData } = await request.json();
    
    let updatedItem;
    
    if (type === 'tool') {
      updatedItem = await Tool.findByIdAndUpdate(id, updateData, { new: true });
    } else if (type === 'component') {
      updatedItem = await Component.findByIdAndUpdate(id, updateData, { new: true });
    } else {
      return NextResponse.json(
        { error: 'Invalid item type' },
        { status: 400 }
      );
    }

    if (!updatedItem) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...updatedItem.toObject(),
      type,
      available: type === 'tool' ? updatedItem.available : updatedItem.stock > 0
    });

  } catch (error) {
    console.error('Error updating inventory item:', error);
    return NextResponse.json(
      { error: 'Failed to update inventory item' },
      { status: 500 }
    );
  }
}
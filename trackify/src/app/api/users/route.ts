import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { User } from '@/models/User';
import { handleMongoError } from '@/lib/errorHandler';

// GET /api/users - Get all users
export async function GET() {
  try {
    await connectDB();
    const users = await User.find({}).select('-password'); // Exclude password from response
    return NextResponse.json({ success: true, data: users });
  } catch (error: unknown) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST /api/users - Create new user
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    const user = await User.create(body);
    const userWithoutPassword = { ...user.toObject() };
    delete userWithoutPassword.password;
    
    return NextResponse.json(
      { success: true, data: userWithoutPassword },
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
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { User } from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Get all users with their basic information
    const users = await User.find({}, {
      password: 0 // Exclude password field for security
    }).sort({ createdAt: -1 });

    return NextResponse.json(users);

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const userData = await request.json();
    
    // Create new user
    const newUser = new User(userData);
    await newUser.save();

    // Return user without password
    const userResponse = newUser.toObject();
    delete userResponse.password;

    return NextResponse.json(userResponse, { status: 201 });

  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    const { userId, ...updateData } = await request.json();
    
    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, select: '-password' }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedUser);

  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}
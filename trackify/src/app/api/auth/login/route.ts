import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { User } from '@/models/User';
import { AuthResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      const response: AuthResponse = {
        success: false,
        error: 'Email and password are required'
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      const response: AuthResponse = {
        success: false,
        error: 'Invalid email or password'
      };
      return NextResponse.json(response, { status: 401 });
    }

    // Check if user is active
    if (!user.isActive) {
      const response: AuthResponse = {
        success: false,
        error: 'Account is not active. Please contact administrator.'
      };
      return NextResponse.json(response, { status: 401 });
    }

    // For now, we'll do a simple password check
    // In production, you should use hashed passwords
    if (user.password !== password) {
      const response: AuthResponse = {
        success: false,
        error: 'Invalid email or password'
      };
      return NextResponse.json(response, { status: 401 });
    }

    // Return successful authentication
    const response: AuthResponse = {
      success: true,
      user: {
        _id: user._id?.toString(),
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        password: '', // Don't send password back
        membershipLevel: user.membershipLevel,
        joinDate: user.joinDate,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Login error:', error);
    const response: AuthResponse = {
      success: false,
      error: 'Internal server error'
    };
    return NextResponse.json(response, { status: 500 });
  }
}
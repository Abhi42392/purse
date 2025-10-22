import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectDB } from '../../../lib/mongodb';
import User from '../../../models/UserModal';

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request) {
  try {
    // Connect to database
    await connectDB();

    // Get request body
    const { username, password } = await request.json();

    // Validation
    if (!username || !password) {
      return NextResponse.json(
        {
          success: false,
          message: 'Username and password are required'
        },
        { status: 400 }
      );
    }

    if (username.length < 3) {
      return NextResponse.json(
        {
          success: false,
          message: 'Username must be at least 3 characters long'
        },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: 'Password must be at least 6 characters long'
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      username: username.toLowerCase() 
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: 'Username already exists'
        },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      username: username.toLowerCase(),
      password: hashedPassword,
      walletCounters: {
        solana: 0,
        ethereum: 0
      }
    });

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id.toString(), 
        username: user.username 
      },
      JWT_SECRET,
      { 
        expiresIn: '7d' 
      }
    );

    // Prepare user response (without password)
    const userResponse = {
      _id: user._id,
      username: user.username,
      walletCounters: user.walletCounters,
      createdAt: user.createdAt
    };

    return NextResponse.json(
      {
        success: true,
        message: 'User registered successfully',
        token,
        user: userResponse
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error registering user',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
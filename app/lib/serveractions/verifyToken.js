import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { success: true, data: decoded.userId };
  } catch (error) {
    console.error('Token verification error:', error.message);
    return NextResponse.json(
        { error: error },
        { status: 401 }
      );
  }
}
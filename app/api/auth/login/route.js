import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "../../../lib/mongodb";
import User from "../../../models/UserModal";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request) {
  try {
    await connectDB();

    const { username, password } = await request.json();

    // Validation
    if (!username || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Username and password are required",
        },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ username: username }).select("+password");

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid username or password",
        },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid username or password",
        },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id.toString(),
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Prepare user response (exclude password)

    return NextResponse.json(
      {
        success: true,
        token: token,
        hasSeed: user.hasSeedPhrase,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error logging in",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/app/lib/mongodb";
import Wallet from "../../../models/WalletModal";

export async function GET(request, { params }) {
  try {
    const { walletId } = await params;
    console.log(walletId);

    if (!walletId) {
      return NextResponse.json(
        { success: false, message: "Wallet ID is required" },
        { status: 400 }
      );
    }

    // Get and verify the authorization token
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "No authorization token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    // Verify the JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Connect to database
    await connectDB();

    const wallet = await Wallet.findOne({
      _id: walletId,
      userId: decoded.userId,
    }).select("+createdAt");

    if (!wallet) {
      return NextResponse.json(
        { success: false, message: "Wallet not found or access denied" },
        { status: 404 }
      );
    }

    // Return wallet data (without private key)
    return NextResponse.json({
      success: true,
      wallet: {
        _id: wallet._id,
        name: wallet.name,
        walletType: wallet.walletType,
        publicKey: wallet.publicKey,
        userId: wallet.userId,
        createdAt: wallet.createdAt,
      },
    });
  } catch (error) {
    console.error("Error fetching wallet:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

// You can also add other methods like PUT for updating wallet name, DELETE for removing wallet

export async function PUT(request, { params }) {
  try {
    const { walletId } = params;

    if (!walletId) {
      return NextResponse.json(
        { success: false, message: "Wallet ID is required" },
        { status: 400 }
      );
    }

    // Get and verify the authorization token
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "No authorization token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    // Verify the JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Get request body
    const body = await request.json();
    const { name } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, message: "Wallet name is required" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Find and update the wallet
    const wallet = await Wallet.findOneAndUpdate(
      {
        _id: walletId,
        userId: decoded.userId,
      },
      {
        name: name.trim(),
      },
      {
        new: true, // Return the updated document
        runValidators: true, // Run model validators
      }
    ).select("-privateKey"); // Exclude private key from response

    if (!wallet) {
      return NextResponse.json(
        { success: false, message: "Wallet not found or access denied" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Wallet updated successfully",
      wallet: {
        _id: wallet._id,
        name: wallet.name,
        walletType: wallet.walletType,
        publicKey: wallet.publicKey,
        userId: wallet.userId,
        createdAt: wallet.createdAt,
      },
    });
  } catch (error) {
    console.error("Error updating wallet:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { walletId } = params;

    if (!walletId) {
      return NextResponse.json(
        { success: false, message: "Wallet ID is required" },
        { status: 400 }
      );
    }

    // Get and verify the authorization token
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "No authorization token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    // Verify the JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Find and delete the wallet
    const wallet = await Wallet.findOneAndDelete({
      _id: walletId,
      userId: decoded.userId,
    });

    if (!wallet) {
      return NextResponse.json(
        { success: false, message: "Wallet not found or access denied" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Wallet deleted successfully",
      deletedWalletId: walletId,
    });
  } catch (error) {
    console.error("Error deleting wallet:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

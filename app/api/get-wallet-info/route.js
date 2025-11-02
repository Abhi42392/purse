import { NextResponse } from "next/server";
import { connectDB } from "../../lib/mongodb"; // Adjust path to your MongoDB connection
import Wallet from "../../models/WalletModal"; // Adjust path to your Wallet model
import { verifyToken } from "../../lib/serveractions/verifyToken";

function getToken(req) {
  const auth = req.headers.get("authorization");
  if (auth && auth.startsWith("Bearer ")) {
    return auth.slice("Bearer ".length);
  }
  return null;
}

export async function POST(req) {
  try {
    // Connect to database
    await connectDB();

    const token = getToken(req);

    if (!token) {
      console.log("No Token");
      return NextResponse.json(
        { error: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }

    const verification = await verifyToken(token);
    if (!verification.success) {
      console.log(verification.error);
      return NextResponse.json({ error: verification.error }, { status: 401 });
    }

    const userId = verification.data;
    console.log(userId);

    const wallets = await Wallet.find({ userId: userId })
      .select("-privateKey") // Explicitly exclude private key
      .sort({ createdAt: -1 }); // Sort by newest first

    return NextResponse.json({
      success: true,
      wallets: wallets,
    });
  } catch (error) {
    console.error("Error fetching wallets:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch wallets",
      },
      { status: 500 }
    );
  }
}

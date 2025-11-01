import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectDB } from "@/app/lib/mongodb";
import Wallet from "@/app/models/WalletModal";
import User from "@/app/models/UserModal";
import { verifyToken } from "@/app/lib/serveractions/verifyToken";
function getToken(req) {
  const auth = req.headers.get("authorization");
  if (auth && auth.startsWith("Bearer ")) {
    return auth.slice("Bearer ".length);
  }
  return null;
}

export async function POST(req) {
  try {
    await connectDB();
    const { password, walletId } = await req.json();
    const token = getToken(req);
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }

    const verification = await verifyToken(token);
    if (!verification.success) {
      return NextResponse.json({ error: verification.error }, { status: 401 });
    }

    const userId = verification.data;

    const user_data = await User.findById(userId).select("+password");
    const isPasswordValid = await bcrypt.compare(password, user_data.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid username or password",
        },
        { status: 401 }
      );
    }
    const wallet = await Wallet.findById(walletId).select("privateKey");
    console.log(wallet);
    const privateKey = wallet.privateKey;
    return NextResponse.json({ success: true, privateKey });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ success: false, error: err });
  }
}

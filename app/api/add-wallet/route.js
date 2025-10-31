import { NextResponse } from 'next/server';
import { verifyToken } from '@/app/lib/serveractions/verifyToken';
import User from '@/app/models/UserModal';
import { connectDB } from '@/app/lib/mongodb';
import { getSolanaKeypair } from '../../lib/serveractions/SolanaWallet'; // assuming you have this helper

// ✅ Helper function to extract token
function getToken(req) {
  const auth = req.headers.get('authorization');
  if (auth && auth.startsWith('Bearer ')) {
    return auth.slice('Bearer '.length);
  }
  return null;
}

export async function POST(req) {
  try {
    await connectDB();

    const { wallet_name, wallet_type } = await req.json();

    const token = getToken(req);
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }

    const verification = await verifyToken(token);
    if (!verification.success) {
      return NextResponse.json(
        { error: verification.error },
        { status: 401 }
      );
    }

    const userId = verification.data;

    // ✅ Find user
    const user_data = await User.findById(userId);

    if (!user_data) {
      console.log("User not found")
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const seed = user_data.seedPhrase;
    if (!seed) {
      console.log("Generate Mnemonic first")
      return NextResponse.json(
        { success: false, error: 'Generate Mnemonic first' },
        { status: 400 }
      );
    }

    // ✅ Generate new wallet
    let new_wallet = {
      name: wallet_name,
      walletType: wallet_type,
    };

    if (wallet_type === 'solana') {
      const solana_wallet_number = user_data.walletCounter.solana + 1;
      const derivation_path = `m/44'/60'/${solana_wallet_number}'/0'`;
      const result = await getSolanaKeypair(seed, derivation_path);

      new_wallet.privateKey = result.privateKey;
      new_wallet.publicKey = result.publicKey;
    } else if (wallet_type === 'ethereum') {
      // TODO: implement Ethereum wallet creation logic
    } else {
      return NextResponse.json(
        { success: false, error: 'Unsupported wallet type' },
        { status: 400 }
      );
    }

    console.log('New wallet:', new_wallet);

    // ✅ Insert into DB (optional)
    // await Wallet.create(new_wallet);


    return NextResponse.json({
      success: true,
      message: 'New wallet created successfully',
      wallet: new_wallet,
    });
  } catch (err) {
    console.error('Error in add-wallet route:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

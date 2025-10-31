import { NextResponse } from 'next/server';
import { verifyToken } from '@/app/lib/serveractions/verifyToken';
import Wallet from '@/app/models/WalletModal';
import User from '@/app/models/UserModal';
import { connectDB } from '@/app/lib/mongodb';
import { getSolanaKeypair } from '../../lib/serveractions/SolanaWallet'; 

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
    const user_data = await User.findById(userId).select("+seedPhrase");

    if (!user_data) {
      console.log("User not found")
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    console.log(user_data)
    const seed = user_data.seedPhrase;
    if (!seed) {
      console.log("Generate Mnemonic first")
      return NextResponse.json(
        { success: false, error: 'Generate Mnemonic first' },
        { status: 400 }
      );
    }

    let new_wallet = {};

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
    const res=new Wallet({
      userId:userId,
      privateKey:new_wallet.privateKey,
      publicKey:new_wallet.publicKey,
      name:wallet_name,
      walletType:wallet_type
    })
    await res.save();
    await User.findByIdAndUpdate(userId,{
      "$inc":{
        totalWallets:1,
        [`walletCounter.${wallet_type}`]:1
      }
    })
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

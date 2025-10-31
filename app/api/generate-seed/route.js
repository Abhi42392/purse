import { generateMnemonic,mnemonicToSeedSync } from "bip39";
import User from "@/app/models/UserModal";
import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import { verifyToken } from "@/app/lib/serveractions/verifyToken";
function getToken(req) {
  const auth = req.headers.get('authorization');
  if (auth && auth.startsWith('Bearer ')) {
    return auth.slice('Bearer '.length);
  }
  return null;
}

export async function POST(req){
    try{
        await connectDB();
        const token = getToken(req);
            if (!token) {
              return NextResponse.json(
                { error: 'Unauthorized - No token provided' },
                { status: 401 }
              );
            }
            console.log("Token "+token)
        const verification = await verifyToken(token);
            if (!verification.success) {
              return NextResponse.json(
                { error: verification.error },
                { status: 401 }
              );
            }
          
        const userId = verification.data;
        const mnemonic=generateMnemonic();
        const seed=mnemonicToSeedSync(mnemonic);
        
        await User.findByIdAndUpdate(
            userId,
            { seedPhrase: seed, hasSeedPhrase: true },
            {new:true}
        );

        return NextResponse.json({success:true,data:{message:"Seed phrase generated",mnemonic:mnemonic}})
    }catch(err){
        console.log(err);
        return NextResponse.json({success:false,error:err})
    }   
}
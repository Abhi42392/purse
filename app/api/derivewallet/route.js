import { getSolanaKeypair } from "@/app/lib/serveractions/SolanaWallet";

export default async function GET(req,res) {
    try{
        const{currency}=req.body;
        const cointype=currency==="solana"?501:60
    }catch(err){

    }
}
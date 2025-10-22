import { Keypair } from "@solana/web3.js";
import { derivePath } from "ed25519-hd-key";
import nacl from "tweetnacl";

export function getSolanaKeypair(seed,derivationPath){
    const derivedSeed=derivePath(derivationPath,seed.toString("hex")).key;

    const secret=nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    //solana based keypair
    const privateKey=Keypair.fromSecretKey(secret).secretKey.toBase58();
    const publicKey=Keypair.fromSecretKey(secret).publicKey.toBase58();
    return {privateKey:privateKey,publicKey:publicKey};
}
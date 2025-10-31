import { Keypair } from "@solana/web3.js";
import { derivePath } from "ed25519-hd-key";
import nacl from "tweetnacl";
import bs58 from "bs58";

export function getSolanaKeypair(seed, derivationPath) {
    // Convert seed to hex string if it's a Buffer
    const seedHex = Buffer.isBuffer(seed) ? seed.toString("hex") : seed;
    
    // Derive the seed using the derivation path
    const derivedSeed = derivePath(derivationPath, seedHex).key;
    
    // Generate the secret key from the derived seed
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    
    // Create Solana keypair from the secret key
    const keypair = Keypair.fromSecretKey(secret);
    
    // Encode the keys to base58 format (Solana's standard)
    // secretKey is a Uint8Array, needs to be encoded with bs58
    const privateKey = bs58.encode(keypair.secretKey);
    
    // publicKey has a built-in toBase58() method
    const publicKey = keypair.publicKey.toBase58();
    
    return { privateKey, publicKey };
}
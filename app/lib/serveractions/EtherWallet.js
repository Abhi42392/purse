import { HDNodeWallet,Wallet } from "ethers";

export function deriveEtheriumWallet(seed,derivationPath){
    const seedBuffer = Buffer.from(seed, "hex");
    const hdNode=HDNodeWallet.fromSeed(seedBuffer);
    const child=hdNode.derivePath(derivationPath)
    return {publicKey:child.publicKey,privateKey:child.privateKey};
}

export function deriveEtheriumPrivateKey(seed,derivationPath){
    const seedBuffer = Buffer.from(seed, "hex");
    const hdnode=HDNodeWallet.fromSeed(seedBuffer);
    const child=hdnode.derivePath(derivationPath);
    return child.privateKey;
}
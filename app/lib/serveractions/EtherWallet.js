import { HDNodeWallet,Wallet } from "ethers";

export function deriveEtheriumWallet(seed,derivationPath){
    const privateKey=deriveEtheriumPrivateKey(seed,derivationPath);
    return new Wallet(privateKey);
}

export function deriveEtheriumPrivateKey(seed,derivationPath){
    const hdnode=HDNodeWallet.fromSeed(seed);
    const child=hdnode.derivePath(derivationPath);
    return child.privateKey;
}
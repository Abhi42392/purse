"use server"
import { generateMnemonic,mnemonicToSeedSync } from "bip39";

export async function getMnemonic(){
    const mnemonic=generateMnemonic();
    const seed=mnemonicToSeedSync(mnemonic);
    //store seed in mongodb
    return mnemonic;
}
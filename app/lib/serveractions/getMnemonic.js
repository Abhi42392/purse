import { generateMnemonic,mnemonicToSeedSync } from "bip39";

export default function(){
    const mnemonic=generateMnemonic();
    const seed=mnemonicToSeedSync(mnemonic);
    //store seed in mongodb
    return mnemonic;
}
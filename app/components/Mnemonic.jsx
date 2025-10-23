"use client";

import { useState, useTransition } from "react";
import {getMnemonic} from "../lib/serveractions/getMnemonic";
import DisplayMnemonic from "./DisplayMnemonic";

export default function MnemonicPrompt() {
  const [mnemonic, setMnemonic] = useState(null);
  const [isPending, startTransition] = useTransition();

  const handleGenerate = () => {
    startTransition(async () => {
      const result = await getMnemonic();
      setMnemonic(result);
    });
  };

  if (mnemonic) {
    return <DisplayMnemonic words={mnemonic} />;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className=" text-white rounded-2xl shadow-lg p-8 w-96 text-center border-2 border-white">
        <h2 className="text-lg font-semibold mb-4">
          Generate Your Mnemonic
        </h2>
        <p className="text-sm text-gray-300 mb-6">
          This mnemonic phrase will be used to create your wallet. Make sure to
          store it safely.
        </p>
        <button
          onClick={handleGenerate}
          disabled={isPending}
          className="px-6 py-2 border border-white bg-black text-white rounded-lg hover:bg-gray-900 transition-all"
        >
          {isPending ? "Generating..." : "Generate Mnemonic"}
        </button>
      </div>
    </div>
  );
}

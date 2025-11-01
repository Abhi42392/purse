"use client";

import { useContext, useState, useTransition } from "react";
import DisplayMnemonic from "./DisplayMnemonic";
import { AuthContext } from "../context/AuthContext";

export default function MnemonicPrompt() {
  const [mnemonic, setMnemonic] = useState(null);
  const [isPending, startTransition] = useTransition();
  const{userData,setUserData}=useContext(AuthContext)

  const handleGenerate = () => {
    startTransition(async () => {
      try {
        const token=userData.token
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/generate-seed`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }, 
        });
        const result=await response.json();
        if(result.success){
          console.log(result.data.mnemonic)
          setMnemonic(result.data.mnemonic);
          // setUserData({...userData,hasSeed:true})
          localStorage.setItem('userData',JSON.stringify({...userData,hasSeed:true}))
        }else{
          throw new Error(result.error)
        }
      } catch (err) {
        console.error("Request failed:", err);
      }
    });
  };


  if (mnemonic) {
    return <DisplayMnemonic words={mnemonic} />;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center  backdrop-blur-sm">
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

"use client"
import React, { startTransition, useState, useTransition,useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const AddWallet= () => {
  const [selectedChain, setSelectedChain] = useState('solana');
  const [walletName, setWalletName] = useState('');
  const{userData}=useContext(AuthContext)
  const[isPending,startTransition]=useTransition()

  const handleSubmit = (e) => {
    e.preventDefault();
    startTransition(async()=>{
      try{
         const token=userData.token
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/add-wallet`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, 
            "Content-Type": "application/json",
          }, 
          body:JSON.stringify({
            wallet_name:walletName,
            wallet_type:selectedChain
          })
        });
      }catch(err){
        console.log(err)
      }
    })
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-md mx-4">
        <div className="bg-black border-2 border-white rounded-lg p-6">
          {/* Modal Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Add Wallet</h2>
            <button
              
              className="text-white hover:text-gray-300 transition-colors"
              aria-label="Close modal"
            >
              
            </button>
          </div>

          {/* Modal Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Wallet Name Input */}
            <div>
              <label htmlFor="walletName" className="block text-sm font-medium text-white mb-2">
                Wallet Name
              </label>
              <input
                id="walletName"
                type="text"
                value={walletName}
                onChange={(e) => setWalletName(e.target.value)}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                placeholder="Enter wallet name"
                required
              />
            </div>

            {/* Blockchain Dropdown */}
            <div>
              <label htmlFor="blockchain" className="block text-sm font-medium text-white mb-2">
                Blockchain Network
              </label>
              <select
                id="blockchain"
                value={selectedChain}
                onChange={(e) => setSelectedChain(e.target.value)}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent appearance-none cursor-pointer"
              >
                <option value="solana" className='bg-white text-black'>Solana</option>
                <option value="ethereum" className='bg-white text-black'>Ethereum</option>
              </select>
            </div>

            {/* Create Wallet Button */}
            <button
              type="submit"
              className="w-full bg-white text-black font-semibold py-2 px-4 rounded-md hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
            >
              Create Wallet
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddWallet

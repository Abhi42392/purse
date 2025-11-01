"use client"
import { useContext, useState } from 'react';
import Link from 'next/link';
import { AuthContext } from '../context/AuthContext';
export default function CreateWallet() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [walletData, setWalletData] = useState(null);
  const{userData}=useContext(AuthContext)

  const createWallet = async (walletName, walletType) => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      
      const response = await fetch('/api/add-wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.token}`
        },
        body: JSON.stringify({
          wallet_name: walletName,
          wallet_type: walletType
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create wallet');
      }

      if (data.success) {
        setSuccess(true);
        setWalletData(data.wallet);
      } else {
        throw new Error(data.error || 'Failed to create wallet');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        
        {/* Loading State */}
        {loading && (
          <div className="text-center">
            <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-lg">
              <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              <span className="text-white text-sm font-medium">Creating your wallet...</span>
            </div>
          </div>
        )}

        {/* Success State */}
        {success && !loading && (
          <div className="text-center space-y-6 animate-fadeIn">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Wallet Created!</h2>
              <p className="text-gray-400 text-sm">Your new wallet has been successfully created</p>
            </div>

            {walletData && (
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 text-left space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Public Key:</span>
                  <span className="text-white text-xs font-mono truncate max-w-[200px]">
                    {walletData.publicKey}
                  </span>
                </div>
              </div>
            )}
            <Link href="/">
            <button
              className="w-full bg-white text-black font-medium py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Go to Home
            </button>
            </Link>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center space-y-6 animate-fadeIn">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/20 rounded-full">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Creation Failed</h2>
              <p className="text-red-400 text-sm">{error}</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setError('');
                  // Retry logic here
                }}
                className="w-full bg-white text-black font-medium py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Try Again
              </button>
              <Link href="/">
              <button
                
                className="w-full bg-transparent text-white font-medium py-3 px-6 rounded-lg border border-white/20 hover:bg-white/10 transition-colors"
              >
                Back to Home
              </button>
              </Link>
            </div>
          </div>
        )}

        {/* Initial Form (when not loading and no success/error) */}
        {!loading && !success && !error && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white text-center">Create New Wallet</h1>
            
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                createWallet(formData.get('wallet_name'), formData.get('wallet_type'));
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Wallet Name
                </label>
                <input
                  type="text"
                  name="wallet_name"
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/40 transition-colors"
                  placeholder="Enter wallet name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Wallet Type
                </label>
                <select
                  name="wallet_type"
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40 transition-colors"
                >
                  <option value="solana" className='text-black'>Solana</option>
                  <option value="ethereum" className='text-black'>Ethereum</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-white text-black font-medium py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Create Wallet
              </button>
              <Link href="/">
              <button
                type="button"
                className="w-full bg-transparent text-white font-medium py-3 px-6 rounded-lg border border-white/20 hover:bg-white/10 transition-colors"
              >
                Back to Home
              </button>
              </Link>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

// Add these styles to your global CSS or Tailwind config
/*
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
*/
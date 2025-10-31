"use client"
import React, { useState, useEffect, useContext } from "react";
import { Eye, EyeOff, Plus, Wallet, Copy, Check } from "lucide-react";
import { AuthContext } from "./context/AuthContext";

export default function Home() {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleKeys, setVisibleKeys] = useState({});
  const [passwordInputs, setPasswordInputs] = useState({});
  const [copiedStates, setCopiedStates] = useState({});
  const [verifyingPassword, setVerifyingPassword] = useState({});
  const{userData}=useContext(AuthContext)

  useEffect(() => {
    fetchWalletInfo();
  }, []);

  const fetchWalletInfo = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/get-wallet-info',{
        method:"POST",
        headers: {
            Authorization: `Bearer ${userData.token}`,
            "Content-Type": "application/json",
          }, 
      });
      const result= await response.json();
      console.log(result)
      if (!result.success) {
        throw new Error('Failed to fetch wallet information');
      }
      
      console.log(result.wallets)
      setWallets(result.wallets || []);
    } catch (err) {
      console.log(err)
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle password submission for revealing private key
  const handlePasswordSubmit = async (walletId, password) => {
    try {
      setVerifyingPassword(prev => ({ ...prev, [walletId]: true }));
      
      // Call API to verify password and get private key
      const response = await fetch('/api/verify-wallet-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletId, password }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        // Update the wallet with the private key
        setWallets(prev => prev.map(wallet => 
          wallet._id === walletId 
            ? { ...wallet, privateKey: data.privateKey }
            : wallet
        ));
        setVisibleKeys(prev => ({ ...prev, [walletId]: true }));
        setPasswordInputs(prev => {
          const updated = { ...prev };
          delete updated[walletId];
          return updated;
        });
      } else {
        alert(data.message || "Incorrect password");
      }
    } catch (err) {
      alert("Failed to verify password");
    } finally {
      setVerifyingPassword(prev => ({ ...prev, [walletId]: false }));
    }
  };

  // Toggle private key visibility
  const toggleKeyVisibility = (walletId) => {
    if (visibleKeys[walletId]) {
      // Hide the key
      setVisibleKeys(prev => ({ ...prev, [walletId]: false }));
      // Clear the private key from state for security
      setWallets(prev => prev.map(wallet => 
        wallet._id === walletId 
          ? { ...wallet, privateKey: undefined }
          : wallet
      ));
    } else {
      // Show password input
      setPasswordInputs(prev => ({ ...prev, [walletId]: '' }));
    }
  };

  // Copy to clipboard function
  const copyToClipboard = async (text, walletId, field) => {
    try {
      await navigator.clipboard.writeText(text);
      const copyKey = `${walletId}-${field}`;
      setCopiedStates(prev => ({ ...prev, [copyKey]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [copyKey]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Format address for display (show first and last characters)
  const formatAddress = (address, isVisible = true) => {
    if (!address) return '';
    if (!isVisible) return '••••••••••••••••••••••••';
    if (address.length <= 20) return address;
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  // Get wallet type icon/color
  const getWalletTypeStyles = (walletType) => {
    switch (walletType) {
      case 'solana':
        return {
          bgColor: 'bg-gradient-to-br from-purple-600 to-blue-600',
          textColor: 'text-purple-400',
          borderColor: 'border-purple-500/20',
          icon: '◎', // Solana symbol
        };
      case 'ethereum':
        return {
          bgColor: 'bg-gradient-to-br from-blue-600 to-indigo-600',
          textColor: 'text-blue-400',
          borderColor: 'border-blue-500/20',
          icon: 'Ξ', // Ethereum symbol
        };
      default:
        return {
          bgColor: 'bg-gradient-to-br from-gray-600 to-gray-700',
          textColor: 'text-gray-400',
          borderColor: 'border-gray-500/20',
          icon: '₿',
        };
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header with Add Wallet Button */}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-700">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Wallet className="w-8 h-8" />
            My Wallets
          </h1>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Plus className="w-5 h-5" />
            Add Wallet
          </button>
        </div>

        {/* Wallet Stats */}
        {wallets.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="text-gray-400 text-sm mb-1">Total Wallets</div>
              <div className="text-2xl font-bold">{wallets.length}</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="text-gray-400 text-sm mb-1">Solana Wallets</div>
              <div className="text-2xl font-bold text-purple-400">
                {wallets.filter(w => w.walletType === 'solana').length}
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="text-gray-400 text-sm mb-1">Ethereum Wallets</div>
              <div className="text-2xl font-bold text-blue-400">
                {wallets.filter(w => w.walletType === 'ethereum').length}
              </div>
            </div>
          </div>
        )}

        {/* Wallets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wallets.map((wallet) => {
            const styles = getWalletTypeStyles(wallet.walletType);
            return (
              <div
                key={wallet._id}
                className={`bg-gray-800 rounded-xl p-6 border ${styles.borderColor} hover:border-gray-600 transition-all duration-200 hover:shadow-lg`}
              >
                {/* Wallet Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full ${styles.bgColor} flex items-center justify-center text-white text-xl font-bold`}>
                      {styles.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{wallet.name}</h3>
                      <span className={`text-sm ${styles.textColor} capitalize`}>
                        {wallet.walletType}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Creation Date */}
                <div className="mb-4 text-xs text-gray-500">
                  Created: {formatDate(wallet.createdAt)}
                </div>

                {/* Public Key */}
                <div className="mb-4">
                  <label className="text-xs text-gray-400 uppercase tracking-wider">Public Key</label>
                  <div className="mt-1 flex items-center justify-between bg-gray-700/50 rounded-lg px-3 py-2">
                    <span className="font-mono text-sm truncate">
                      {formatAddress(wallet.publicKey)}
                    </span>
                    <button
                      onClick={() => copyToClipboard(wallet.publicKey, wallet._id, 'public')}
                      className="ml-2 text-gray-400 hover:text-white transition-colors"
                      title="Copy public key"
                    >
                      {copiedStates[`${wallet._id}-public`] ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Private Key */}
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider">Private Key</label>
                  
                  {/* Password Input (shown when eye is clicked but key not yet visible) */}
                  {passwordInputs[wallet._id] !== undefined && !visibleKeys[wallet._id] && (
                    <div className="mt-2 mb-2">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handlePasswordSubmit(wallet._id, passwordInputs[wallet._id]);
                        }}
                        className="flex gap-2"
                      >
                        <input
                          type="password"
                          placeholder="Enter password"
                          value={passwordInputs[wallet._id]}
                          onChange={(e) => setPasswordInputs(prev => ({
                            ...prev,
                            [wallet._id]: e.target.value
                          }))}
                          className="flex-1 bg-gray-700 text-white px-3 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                          disabled={verifyingPassword[wallet._id]}
                        />
                        <button
                          type="submit"
                          disabled={verifyingPassword[wallet._id]}
                          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          {verifyingPassword[wallet._id] ? '...' : 'Unlock'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setPasswordInputs(prev => {
                            const updated = { ...prev };
                            delete updated[wallet._id];
                            return updated;
                          })}
                          className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          Cancel
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Private Key Display */}
                  <div className="mt-1 flex items-center justify-between bg-gray-700/50 rounded-lg px-3 py-2">
                    <span className="font-mono text-sm truncate">
                      {visibleKeys[wallet._id] && wallet.privateKey
                        ? formatAddress(wallet.privateKey)
                        : '••••••••••••••••••••••••'}
                    </span>
                    <div className="flex items-center gap-2 ml-2">
                      {visibleKeys[wallet._id] && wallet.privateKey && (
                        <button
                          onClick={() => copyToClipboard(wallet.privateKey, wallet._id, 'private')}
                          className="text-gray-400 hover:text-white transition-colors"
                          title="Copy private key"
                        >
                          {copiedStates[`${wallet._id}-private`] ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      )}
                      <button
                        onClick={() => toggleKeyVisibility(wallet._id)}
                        className="text-gray-400 hover:text-white transition-colors"
                        title={visibleKeys[wallet._id] ? "Hide private key" : "Show private key"}
                      >
                        {visibleKeys[wallet._id] ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {wallets.length === 0 && (
          <div className="text-center py-12">
            <Wallet className="w-16 h-16 mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No wallets found</h3>
            <p className="text-gray-400 mb-6">Get started by adding your first wallet</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2 transition-colors">
              <Plus className="w-5 h-5" />
              Add Your First Wallet
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
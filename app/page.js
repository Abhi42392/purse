"use client";
import React, { useState, useEffect, useContext } from "react";
import { Plus, Wallet, Copy, Check } from "lucide-react";
import { AuthContext } from "./context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Loading from "./components/Loading";
import Logout from "./components/Logout";

export default function Home() {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedStates, setCopiedStates] = useState({});
  const { userData } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    fetchWalletInfo();
  }, []);

  const fetchWalletInfo = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/get-wallet-info", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userData.token}`,
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      console.log(result);
      if (!result.success) {
        throw new Error("Failed to fetch wallet information");
      }

      console.log(result.wallets);
      setWallets(result.wallets || []);
    } catch (err) {
      console.log(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Copy to clipboard function
  const copyToClipboard = async (text, walletId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates((prev) => ({ ...prev, [walletId]: true }));
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [walletId]: false }));
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Format address for display (show first and last characters)
  const formatAddress = (address) => {
    if (!address) return "";
    if (address.length <= 20) return address;
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  // Get wallet type icon/color
  const getWalletTypeStyles = (walletType) => {
    switch (walletType) {
      case "solana":
        return {
          bgColor: "bg-gradient-to-br from-purple-600 to-blue-600",
          textColor: "text-purple-400",
          borderColor: "border-purple-500/20",
          icon: "◎", // Solana symbol
        };
      case "ethereum":
        return {
          bgColor: "bg-gradient-to-br from-blue-600 to-indigo-600",
          textColor: "text-blue-400",
          borderColor: "border-blue-500/20",
          icon: "Ξ", // Ethereum symbol
        };
      default:
        return {
          bgColor: "bg-gradient-to-br from-gray-600 to-gray-700",
          textColor: "text-gray-400",
          borderColor: "border-gray-500/20",
          icon: "₿",
        };
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Handle wallet click
  const handleWalletClick = (walletId) => {
    router.push(`/wallet/${walletId}`);
  };

  if (loading) {
    return <Loading />;
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
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-700 gap-3">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Wallet className="w-8 h-8" />
            Purse
          </h1>
          <div className="flex-1"></div>
          <Link href="/add-wallet">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <Plus className="w-5 h-5" />
              <p className="hidden sm:block">Add Wallet</p>
            </button>
          </Link>
          <Logout />
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
                {wallets.filter((w) => w.walletType === "solana").length}
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="text-gray-400 text-sm mb-1">Ethereum Wallets</div>
              <div className="text-2xl font-bold text-blue-400">
                {wallets.filter((w) => w.walletType === "ethereum").length}
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
                onClick={() => handleWalletClick(wallet._id)}
                className={`bg-gray-800 rounded-xl p-6 border ${styles.borderColor} hover:border-gray-600 transition-all duration-200 hover:shadow-lg cursor-pointer`}
              >
                {/* Wallet Header */}
                <div className="flex items-start justify-between mb-4 relative">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-full ${styles.bgColor} flex items-center justify-center text-white text-xl font-bold`}
                    >
                      {styles.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{wallet.name}</h3>
                      <span
                        className={`text-sm ${styles.textColor} capitalize`}
                      >
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
                  <label className="text-xs text-gray-400 uppercase tracking-wider">
                    Public Key
                  </label>
                  <div className="mt-1 flex items-center justify-between bg-gray-700/50 rounded-lg px-3 py-2">
                    <span className="font-mono text-sm truncate">
                      {formatAddress(wallet.publicKey)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent wallet click
                        copyToClipboard(wallet.publicKey, wallet._id);
                      }}
                      className="ml-2 text-gray-400 hover:text-white transition-colors"
                      title="Copy public key"
                    >
                      {copiedStates[wallet._id] ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
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
            <p className="text-gray-400 mb-6">
              Get started by adding your first wallet
            </p>
            <Link href="/add-wallet">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2 transition-colors">
                <Plus className="w-5 h-5" />
                Add Your First Wallet
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

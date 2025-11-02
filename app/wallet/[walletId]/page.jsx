"use client";
import React, { useState, useEffect, useContext } from "react";
import { Eye, EyeOff, Copy, Check, Wallet, ArrowLeft } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Loading from "../../components/Loading";

export default function WalletDetail() {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleKey, setVisibleKey] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [copiedStates, setCopiedStates] = useState({});
  const [verifyingPassword, setVerifyingPassword] = useState(false);
  const [balance, setBalance] = useState(0);
  const { userData } = useContext(AuthContext);
  const params = useParams();
  const router = useRouter();
  const walletId = params.walletId;

  useEffect(() => {
    if (walletId) {
      fetchWalletDetails();
    }
  }, [walletId]);

  const fetchBalance = async (walletType, publicKey) => {
    try {
      if (walletType === "solana") {
        const res = await fetch(process.env.NEXT_PUBLIC_SOLANA_RPC_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "getBalance",
            params: ["Eg4F6LW8DD3SvFLLigYJBFvRnXSBiLZYYJ3KEePDL95Q"],
          }),
        });
        const data = await res.json();
        if (data.result && data.result.value !== undefined) {
          const balance = data.result.value / 1_000_000_000;
          const tokenSymbol = "SOL";
          setBalance(balance);
        }
      }
      return 0;
    } catch (error) {
      console.error("Error:", error);
      return 0;
    }
  };
  const fetchWalletDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/wallet/${walletId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userData.token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      fetchBalance(result?.wallet?.walletType, result?.wallet?.publicKey);
      console.log(result);

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to fetch wallet information");
      }

      setWallet(result.wallet);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      setVerifyingPassword(true);

      const response = await fetch("/api/show-private-key", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userData.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ walletId, password: passwordInput }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setWallet((prev) => ({ ...prev, privateKey: data.privateKey }));
        setVisibleKey(true);
        setShowPasswordInput(false);
        setPasswordInput("");
      } else {
        alert(data.message || "Incorrect password");
      }
    } catch (err) {
      alert("Failed to verify password");
    } finally {
      setVerifyingPassword(false);
    }
  };

  const toggleKeyVisibility = () => {
    if (visibleKey) {
      // Hide the key
      setVisibleKey(false);
      // Clear the private key from state for security
      setWallet((prev) => ({ ...prev, privateKey: undefined }));
      setShowPasswordInput(false);
      setPasswordInput("");
    } else {
      // Show password input
      setShowPasswordInput(true);
    }
  };

  // Copy to clipboard function
  const copyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates((prev) => ({ ...prev, [field]: true }));
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [field]: false }));
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Format address for display
  const formatAddress = (address, showFull = false) => {
    if (!address) return "";
    if (showFull || address.length <= 20) return address;
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
          icon: "◎",
        };
      case "ethereum":
        return {
          bgColor: "bg-gradient-to-br from-blue-600 to-indigo-600",
          textColor: "text-blue-400",
          borderColor: "border-blue-500/20",
          icon: "Ξ",
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
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">Error: {error}</div>
          <Link href="/">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
              Back to Wallets
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center">
        <div className="text-white">Wallet not found</div>
      </div>
    );
  }

  const styles = getWalletTypeStyles(wallet.walletType);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Wallets
          </button>
        </div>

        {/* Wallet Details Card */}
        <div
          className={`bg-gray-800 rounded-xl p-8 border ${styles.borderColor}`}
        >
          {/* Wallet Header */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-4">
              <div
                className={`w-16 h-16 rounded-full ${styles.bgColor} flex items-center justify-center text-white text-2xl font-bold`}
              >
                {styles.icon}
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-1">{wallet.name}</h1>
                <span className={`text-lg ${styles.textColor} capitalize`}>
                  {wallet.walletType} Wallet
                </span>
              </div>
            </div>
            <p className="font-bold text-3xl">{balance} SOL</p>
          </div>

          {/* Wallet Information */}
          <div className="space-y-6">
            {/* Creation Date */}
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider">
                Created On
              </label>
              <div className="mt-1 text-lg">{formatDate(wallet.createdAt)}</div>
            </div>

            {/* Public Key */}
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider">
                Public Key / Address
              </label>
              <div className="mt-2 flex items-center justify-between bg-gray-700/50 rounded-lg px-4 py-3">
                <span className="font-mono text-sm md:text-base break-all">
                  {wallet.publicKey}
                </span>
                <button
                  onClick={() => copyToClipboard(wallet.publicKey, "public")}
                  className="ml-3 text-gray-400 hover:text-white transition-colors "
                  title="Copy public key"
                >
                  {copiedStates.public ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Private Key */}
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider">
                Private Key
              </label>

              {/* Password Input */}
              {showPasswordInput && !visibleKey && (
                <form onSubmit={handlePasswordSubmit} className="mt-3 mb-3">
                  <div className="flex gap-2">
                    <input
                      type="password"
                      placeholder="Enter password to view private key"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                      disabled={verifyingPassword}
                    />
                    <button
                      type="submit"
                      disabled={verifyingPassword || !passwordInput}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      {verifyingPassword ? "Verifying..." : "Unlock"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordInput(false);
                        setPasswordInput("");
                      }}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Private Key Display */}
              <div className="mt-2 flex items-center justify-between bg-gray-700/50 rounded-lg px-4 py-3">
                <span className="font-mono text-sm md:text-base break-all">
                  {visibleKey && wallet.privateKey
                    ? wallet.privateKey
                    : "••••••••••••••••••••••••••••••••••••••••••••"}
                </span>
                <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                  {visibleKey && wallet.privateKey && (
                    <button
                      onClick={() =>
                        copyToClipboard(wallet.privateKey, "private")
                      }
                      className="text-gray-400 hover:text-white transition-colors"
                      title="Copy private key"
                    >
                      {copiedStates.private ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </button>
                  )}
                  <button
                    onClick={toggleKeyVisibility}
                    className="text-gray-400 hover:text-white transition-colors"
                    title={visibleKey ? "Hide private key" : "Show private key"}
                  >
                    {visibleKey ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {visibleKey && (
                <div className="mt-2 text-xs text-yellow-500">
                  ⚠️ Never share your private key with anyone. Store it
                  securely.
                </div>
              )}
            </div>

            {/* Additional Wallet Info */}
            {wallet.walletType === "solana" && (
              <div className="mt-6 p-4 bg-purple-900/20 rounded-lg border border-purple-500/20">
                <p className="text-sm text-purple-300">
                  This is a Solana wallet. You can use it to store SOL and SPL
                  tokens.
                </p>
              </div>
            )}

            {wallet.walletType === "ethereum" && (
              <div className="mt-6 p-4 bg-blue-900/20 rounded-lg border border-blue-500/20">
                <p className="text-sm text-blue-300">
                  This is an Ethereum wallet. You can use it to store ETH and
                  ERC-20 tokens.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4 justify-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            Send
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            Receive
          </button>
          <button className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            Transaction History
          </button>
        </div>
      </div>
    </div>
  );
}

import React from "react";

export default function DisplayMnemonic({words}) {
  const [copied, setCopied] = React.useState(false);
  const wordList = words.split(" ")

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(wordList.join(" "));
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch (e) {
      console.error("Copy failed", e);
      alert("Copy failed. Please copy manually.");
    }
  };
  

  return (
    <div className="fixed inset-0 z-10   bg-black text-white">
      <div className="mx-auto flex h-full max-w-3xl flex-col items-center justify-center gap-6 p-6">
        {/* Header + Copy */}
        <div className="flex w-full items-center justify-between">
          <h1 className="text-xl font-semibold tracking-wide">Your Recovery Phrase</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={copyAll}
              className="rounded-2xl border border-white/40 px-4 py-2 text-sm font-medium hover:border-white focus:outline-none focus:ring-2 focus:ring-white/60"
              aria-live="polite"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        {/* Grid of 12 words: 3 per row */}
        <div className="grid w-full grid-cols-3 gap-4">
          {wordList.map((w, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-2xl border border-white/20 px-4 py-3 text-base"
            >
              <span className="opacity-70 mr-3 tabular-nums">{i + 1}.</span>
              <span className="flex-1 select-text text-center font-medium">{w}</span>
            </div>
          ))}
        </div>

        {/* Footer actions */}
        <div className="mt-2 flex w-full items-center justify-end gap-3">
          <Link
           href="/add-wallet"
            className="rounded-2xl border border-white px-5 py-2.5 text-sm font-semibold hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-white/60"
          >
            Add Wallet
          </Link>
        </div>

        {/* Security note (optional, still white on black) */}
        <p className="mt-2 text-center text-xs opacity-60">
          Never share this phrase. Anyone with it can access your wallet.
        </p>
      </div>
    </div>
  );
}

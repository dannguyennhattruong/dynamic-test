"use client";

import { useUnifiedChainContext } from "@/lib/UnifiedChainProvider";
import { ChainSelector } from "./ChainSelector";

export default function ChainPage() {
  const { chain, address, balance } = useUnifiedChainContext();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6 space-y-6">
        <h1 className="text-xl font-bold text-center">
          Dynamic Multichain Wallet
        </h1>

        {/* Chain switch */}
        <ChainSelector />

        {/* Wallet info */}
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-semibold">Chain:</span>{" "}
            <span>{chain?.name}</span>
          </div>

          <div>
            <span className="font-semibold">Address:</span>
            <div className="break-all text-gray-600 mt-1">
              {address ?? "Not connected"}
            </div>
          </div>

          <div>
            <span className="font-semibold">Balance:</span>
            <div className="text-lg font-mono">
              {balance}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

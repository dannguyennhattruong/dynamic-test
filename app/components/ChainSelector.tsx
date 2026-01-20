"use client";

import { useUnifiedChainContext } from "@/lib/UnifiedChainProvider";
import { UNIFIED_CHAINS } from "../types/chains";

export function ChainSelector() {
  const { chain, switchChain } = useUnifiedChainContext();

  return (
    <div className="flex gap-2 justify-center">
      {UNIFIED_CHAINS.map((c) => (
        <button
          key={c.id}
          onClick={() => switchChain(c)}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
            chain?.id === c.id
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
}

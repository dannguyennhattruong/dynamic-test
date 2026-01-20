import { Chain } from "viem";
import { mainnet, bsc, polygon, arbitrum, optimism, base, avalanche, tron } from "viem/chains";

export type UnifiedChain = "EVM" | "SOLANA" | "TRON";

export const UNIFIED_CHAINS: Chain[] = [
    mainnet, bsc, polygon, arbitrum, optimism, base, avalanche, tron
];
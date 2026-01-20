"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useDynamicContext, Wallet } from "@dynamic-labs/sdk-react-core";
import { ethers } from "ethers";
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { isEthereumWallet } from "@dynamic-labs/ethereum";
import { isSolanaWallet } from "@dynamic-labs/solana";
import type { ISolana } from "@dynamic-labs/solana-core";
import {
  mainnet,
  bsc,
  polygon,
  arbitrum,
  optimism,
  base,
  avalanche,
  tron,
  Chain,
} from "viem/chains";

/* ---------------- TYPES ---------------- */

interface UnifiedChainContextType {
  chain: Chain | null;
  address: string;
  balance: string;
  switchChain: (chain: Chain) => void;
  getAddress: () => string | null;
  getBalance: () => Promise<string>;
  sendNativeToken: (to: string, amount: string) => Promise<string>;
  refreshBalance: () => Promise<void>;
}

export function isTronWallet(
  wallet: Wallet<any> | null
): wallet is Wallet<any> & {
  sendTrx: (to: string, amount: number) => Promise<any>;
} {
  return (
    !!wallet &&
    wallet.chain === "TRON" &&
    typeof (wallet as any).sendTrx === "function"
  );
}

/* ---------------- CONTEXT ---------------- */

const UnifiedChainContext = createContext<UnifiedChainContextType | null>(null);

const chains = [
  mainnet,
  bsc,
  polygon,
  arbitrum,
  optimism,
  base,
  avalanche,
  tron,
] as const;

/* ---------------- PROVIDER ---------------- */

export function UnifiedChainProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { primaryWallet } = useDynamicContext();
  const [chain, setChain] = useState<Chain | null>(null);
  const [address, setAddress] = useState<string>("");
  const [balance, setBalance] = useState("0");

  useEffect(() => {
    if (!primaryWallet) {
      setAddress("");
      return;
    }
    setAddress(primaryWallet.address);
  }, [primaryWallet, chain]);

  const refreshBalance = useCallback(async () => {
    if (!primaryWallet) {
      setBalance("0");
      return;
    }

    try {
      const bal = await primaryWallet.getBalance();
      setBalance(bal as string);
    } catch (e) {
      console.error("getBalance error", e);
      setBalance("0");
    }
  }, [primaryWallet]);

  useEffect(() => {
    refreshBalance();
  }, [refreshBalance, chain]);

  /* ---------------- BASIC ---------------- */

  const switchChain = async (c: Chain) => {
    setChain(c);
    const chain = chains.find((f) => f.name === c.toString());
    primaryWallet?.switchNetwork(chain?.id!);
    await refreshBalance();
  };

  const getAddress = () => {
    return primaryWallet?.address ?? null;
  };

  /* ---------------- BALANCE ---------------- */

  const getBalance = async (): Promise<string> => {
    if (!primaryWallet) throw new Error("Wallet not connected");

    const balance = await primaryWallet.getBalance();
    setBalance(balance as string);
    return balance as string;
  };

  /* ---------------- SEND NATIVE ---------------- */

  const sendNativeToken = async (to: string, amount: string): Promise<any> => {
    if (!primaryWallet || !isEthereumWallet(primaryWallet)) return;

    /* ---- EVM ---- */
    if (chain?.name !== "Solana") {
      const walletClient = await primaryWallet.getWalletClient();

      const tx = await walletClient.sendTransaction({
        to: `0x${to.replace("0x", "")}`,
        value: ethers.parseEther(amount),
      });

      return tx;
    }

    /* ---- SOLANA ---- */
    if (chain?.name === "Solana") {
      if (!primaryWallet || !isSolanaWallet(primaryWallet)) {
        return;
      }

      const connection: Connection = await primaryWallet.getConnection();
      const cluster = connection.rpcEndpoint.includes("devnet")
        ? "devnet"
        : "mainnet";

      const fromKey = new PublicKey(primaryWallet.address);
      const toKey = new PublicKey(to);
      const amountInLamports = Number(amount) * 1000000000;
      const transferTransaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: fromKey,
          lamports: amountInLamports,
          toPubkey: toKey,
        })
      );
      const blockhash = await connection.getLatestBlockhash();
      transferTransaction.recentBlockhash = blockhash.blockhash;
      transferTransaction.feePayer = fromKey;
      const signer: ISolana = await primaryWallet.getSigner();

      const res = await signer.signAndSendTransaction(transferTransaction);

      return res.signature;
    }

    // /* ---- TRON ---- */
    if (isTronWallet(primaryWallet)) {
      const res = await primaryWallet.sendTrx(to, Number(amount));
      await refreshBalance();
      return res.txid;
    }

    throw new Error("Unsupported chain");
  };

  //   const handleSendTrx = async () => {
  //     if (!primaryWallet) {
  //         console.error("Wallet not connected");
  //         return;
  //       }
  //     if (!isTronWallet(primaryWallet)) {
  //       console.error('Not a Tron wallet');
  //       return;
  //     }

  //     try {
  //       // Send 10 TRX
  //       const result = await primaryWallet.sendTrx('TRecipientAddress...', 10);
  //       console.log('Transaction sent:', result.txid);
  //     } catch (error) {
  //       console.error('Transaction failed:', error);
  //     }
  //   };

  /* ---------------- PROVIDE ---------------- */

  return (
    <UnifiedChainContext.Provider
      value={{
        chain,
        address,
        balance,
        refreshBalance,
        switchChain,
        getAddress,
        getBalance,
        sendNativeToken,
      }}
    >
      {children}
    </UnifiedChainContext.Provider>
  );
}

/* ---------------- HOOK ---------------- */

export function useUnifiedChainContext() {
  const ctx = useContext(UnifiedChainContext);
  if (!ctx) {
    throw new Error(
      "useUnifiedChainContext must be used inside UnifiedChainProvider"
    );
  }
  return ctx;
}

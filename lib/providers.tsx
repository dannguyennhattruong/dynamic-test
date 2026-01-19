"use client";

import { LiFiProvider } from "@/lib/lifi-provider";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import type { CreateConnectorFn } from "wagmi";
import { config } from "./wagmi";
import { SolanaWalletConnectors } from "@dynamic-labs/solana";

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  const connectors: CreateConnectorFn[] = [];

  return (
    <DynamicContextProvider
      theme="auto"
      settings={{
        environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID!,
        walletConnectors: [EthereumWalletConnectors, SolanaWalletConnectors],
      }}
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <DynamicWagmiConnector>
            <LiFiProvider wagmiConfig={config} connectors={connectors}>
              {children}
            </LiFiProvider>
          </DynamicWagmiConnector>
        </QueryClientProvider>
      </WagmiProvider>
    </DynamicContextProvider>
  );
}
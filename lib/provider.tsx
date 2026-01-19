"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import type { CreateConnectorFn } from "wagmi";
import {
  DynamicContextProvider,
  EthereumWalletConnectors,
  DynamicWagmiConnector,
} from "@/lib/dynamic";
import { ThemeProvider } from "@/app/components/ThemeProvider";
import { LiFiProvider } from "./LifiProvider";
import { config } from "./wagmi";
import { GlobalWalletExtension } from "@dynamic-labs/global-wallet";
export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  const connectors: CreateConnectorFn[] = [];

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <DynamicContextProvider
        theme="auto"
        // settings={{
        //   environmentId:
        //     // replace with your own environment ID
        //     process.env.NEXT_PUBLIC_DYNAMIC_ENV_ID!,
        //   walletConnectors: [EthereumWalletConnectors],
        //   walletConnectorExtensions: [GlobalWalletExtension]
        // }}
        
        settings={{
          environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENV_ID!,
          walletConnectors: [EthereumWalletConnectors],
          walletConnectorExtensions:
            typeof window !== "undefined" ? [GlobalWalletExtension] : [],
          initialAuthenticationMode: "connect-only",
          flowNetwork : "testnet"
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
    </ThemeProvider>
  );
}

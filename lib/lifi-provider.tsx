"use client";

import { config as lifiConfig } from "@lifi/sdk";
import { useSyncWagmiConfig } from "@lifi/wallet-management";
import { useQuery } from "@tanstack/react-query";
import { type FC, type PropsWithChildren, useEffect, useState } from "react";
import type { Config, CreateConnectorFn } from "wagmi";
import { initializeLiFiConfig, loadLiFiChains } from "./lifi";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

interface LiFiProviderProps extends PropsWithChildren {
  wagmiConfig: Config;
  connectors: CreateConnectorFn[];
}

export const LiFiProvider: FC<LiFiProviderProps> = ({
  children,
  wagmiConfig,
  connectors,
}) => {
  const { sdkHasLoaded } = useDynamicContext();
  const [isInitialized, setIsInitialized] = useState(false);

  const {
    data: chains,
    error: chainsError,
    isLoading: chainsLoading,
  } = useQuery({
    queryKey: ["lifi-chains"] as const,
    queryFn: async () => {
      const chains = await loadLiFiChains();

      if (chains.length > 0) {
        lifiConfig.setChains(chains);
      }
      return chains;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: 1000,
    enabled: sdkHasLoaded,
  });

  useEffect(() => {
    if (sdkHasLoaded && !isInitialized) {
      try {
        initializeLiFiConfig(wagmiConfig);
        setIsInitialized(true);
      } catch {
        setIsInitialized(false);
      }
    }
  }, [sdkHasLoaded, wagmiConfig, isInitialized]);

  useSyncWagmiConfig(wagmiConfig, connectors, chains);

  if (chainsLoading || !sdkHasLoaded || !isInitialized) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100px",
          fontSize: "14px",
          opacity: 0.7,
        }}
      >
        {!sdkHasLoaded
          ? "Loading Dynamic SDK..."
          : chainsLoading
          ? "Loading LI.FI chains..."
          : "Initializing LI.FI..."}
      </div>
    );
  }

  if (chainsError) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100px",
          fontSize: "14px",
          color: "#ef4444",
        }}
      >
        Failed to load LI.FI chains. Please refresh the page.
      </div>
    );
  }

  return <>{children}</>;
};
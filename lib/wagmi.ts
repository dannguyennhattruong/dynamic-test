import { createConfig, http } from "wagmi";
import {
  arbitrum,
  avalanche,
  base,
  mainnet,
  optimism,
  polygon,
  bsc,
  tron
} from "wagmi/chains";

const chains = [mainnet, bsc, polygon, arbitrum, optimism, base, avalanche, tron] as const;

export const config = createConfig({
  chains,
  multiInjectedProviderDiscovery: false,
  ssr: true,
  transports: {
    [bsc.id]: http(),
    [tron.id]: http(),
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
    [base.id]: http(),
    [avalanche.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}

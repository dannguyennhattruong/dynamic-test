import { createConfig, http } from "wagmi";
import {
  arbitrum,
  avalanche,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
  bsc,
  tron,
} from "wagmi/chains";

const chains = [mainnet, polygon, arbitrum, optimism, base, avalanche, tron] as const;

// export const config = createConfig({
//   chains,
//   multiInjectedProviderDiscovery: false,
//   ssr: true,
//   transports: {
//     [mainnet.id]: http(),
//     [polygon.id]: http(),
//     [arbitrum.id]: http(),
//     [optimism.id]: http(),
//     [base.id]: http(),
//     [avalanche.id]: http(),
//   },
// });
export const config = createConfig({
  chains,
  multiInjectedProviderDiscovery: false,
  ssr: true,
  transports: {
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

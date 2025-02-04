"use client";

import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultConfig,
  RainbowKitProvider,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserProvider, ethers } from "ethers";
import { createContext, PropsWithChildren, useContext, useMemo } from "react";
import { Config, useAccount, useConnectorClient, WagmiProvider } from "wagmi";
import { localhost, sepolia } from "wagmi/chains";
import theme from "@/app/theme";

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!;

const config = getDefaultConfig({
  appName: "My Web3 App",
  projectId,
  chains: process.env.NEXT_PUBLIC_CHAINS!.split(",").reduce((acc, chain) => {
    if (chain === "localhost") acc.push(localhost);
    if (chain === "sepolia") acc.push(sepolia);
    return acc;
  }, [] as any) as unknown as Config["chains"],
});

const queryClient = new QueryClient();

export default function WalletConfigProvider({ children }: PropsWithChildren) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={lightTheme({
            accentColor: theme.palette.grey[700],
          })}
        >
          <WalletContextProvider>{children}</WalletContextProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

const WalletContext = createContext<{
  account: string | null;
  provider: ethers.BrowserProvider | null;
} | null>(null);

function WalletContextProvider({ children }: PropsWithChildren) {
  const { address } = useAccount();
  const client = useConnectorClient<Config>();
  const provider = useMemo(() => {
    if (!client.data) return null;
    const { chain, transport } = client.data;
    const network = {
      chainId: chain.id,
      name: chain.name,
      ensAddress: chain.contracts?.ensRegistry?.address,
    };
    const provider = new BrowserProvider(transport, network);
    return provider;
  }, [client]);

  return (
    <WalletContext.Provider value={{ account: address ?? null, provider }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWalletContext() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error(
      "useWalletContext must be used within a WalletContextProvider"
    );
  }
  return context;
}

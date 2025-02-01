"use client";

import { ethers } from "ethers";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type WalletContextType = {
  account: string | null;
  provider: ethers.BrowserProvider | null;
  disconnect: () => void;
  connect: () => void;
};

const WalletContext = createContext<WalletContextType | null>(null);

export default function WalletContextProvider({ children }: PropsWithChildren) {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);

  const disconnect = useCallback(() => {
    setAccount(null);
    setProvider(null);
  }, []);

  const connect = useCallback(async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const browserProvider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await browserProvider.send("eth_requestAccounts", []);
        const network = await browserProvider.getNetwork();

        const expectedChainId = parseInt(
          process.env.NEXT_PUBLIC_CHAIN_ID || "1337", // Default to local if not specified
          10
        );

        if (network.chainId !== BigInt(expectedChainId)) {
          alert("Please switch to the correct network in MetaMask.");
          return;
        }

        setProvider(browserProvider);
        setAccount(accounts[0]);

        window.ethereum.on("accountsChanged", (accounts: string[]) => {
          setAccount(accounts.length > 0 ? accounts[0] : null);
        });

        window.ethereum.on("chainChanged", (chainId: string) => {
          if (parseInt(chainId, 16) !== expectedChainId) {
            alert("Please switch to the correct network in MetaMask.");
            disconnect();
          }
        });
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      alert("MetaMask is not installed. Please install it to use this app.");
    }
  }, [disconnect]);

  useEffect(() => {
    connect();
  }, [connect]);

  return (
    <WalletContext.Provider value={{ account, provider, disconnect, connect }}>
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

"use client";

import { ethers } from "ethers";
import { createContext, PropsWithChildren, useContext, useState } from "react";

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

  const disconnect = () => {
    setAccount(null);
    setProvider(null);
  };

  const connect = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const browserProvider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await browserProvider.send("eth_requestAccounts", []);
        const network = await browserProvider.getNetwork();

        const expectedChainId = BigInt(
          process.env.NEXT_PUBLIC_CHAIN_ID || "1337" // Default to local chain if not specified
        );

        if (network.chainId !== expectedChainId) {
          alert("Please switch to the correct network in MetaMask.");
          return;
        }

        setProvider(browserProvider);
        setAccount(accounts[0]);

        const handleAccountsChanged = (accounts: string[]) => {
          setAccount(accounts.length > 0 ? accounts[0] : null);
        };

        const handleChainChanged = (chainId: string) => {
          if (BigInt(chainId) !== expectedChainId) {
            alert("Please switch to the correct network in MetaMask.");
            disconnect();
          }
        };

        window.ethereum.on("accountsChanged", handleAccountsChanged);
        window.ethereum.on("chainChanged", handleChainChanged);

        return () => {
          window.ethereum.removeListener(
            "accountsChanged",
            handleAccountsChanged
          );
          window.ethereum.removeListener("chainChanged", handleChainChanged);
        };
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      alert("MetaMask is not installed. Please install it to use this app.");
    }
  };

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

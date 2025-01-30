"use client";

import { ethers } from "ethers";
import { createContext, PropsWithChildren, useContext, useState } from "react";

type WalletContextType = {
  account: string | null;
  disconnect: () => void;
  connect: () => void;
};

const WalletContext = createContext<WalletContextType | null>(null);

export default function WalletContextProvider({ children }: PropsWithChildren) {
  const [account, setAccount] = useState<string | null>(null);
  const [, setProvider] = useState<ethers.BrowserProvider | null>(null);

  const disconnect = () => {
    setAccount(null);
    setProvider(null);
  };

  const connect = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      alert("MetaMask is not installed. Please install it to use this app.");
    }
  };

  return (
    <WalletContext.Provider value={{ account, disconnect, connect }}>
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

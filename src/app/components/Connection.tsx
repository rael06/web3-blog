"use client";

import { useWalletContext } from "../contexts/WalletContext";

export default function WalletConnection() {
  const { account, disconnect, connect } = useWalletContext();

  return (
    <div>
      {account ? (
        <>
          <p>Connected as: {account}</p>
          <button onClick={disconnect}>Disconnect</button>
        </>
      ) : (
        <button onClick={connect}>Connect Wallet</button>
      )}
    </div>
  );
}

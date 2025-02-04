import { z } from "zod";

const allowedChains = ["sepolia", "localhost"] as const;

const schema = z.object({
  NEXT_PUBLIC_BLOG_CONTRACT_ADDRESS: z
    .string()
    .min(1, "Blog contract address is required."),
  NEXT_BLOCKCHAIN_RPC_URL: z.string().url("Invalid RPC URL."),
  NEXT_IPFS_API_URL: z.string().url("Invalid IPFS API URL."),
  NEXT_PUBLIC_IPFS_GET_URL: z.string().url("Invalid IPFS GET URL."),
  NEXT_IS_IPFS_PIN_ENABLED: z
    .enum(["true", "false"])
    .transform((val) => val === "true"),
  NEXT_PUBLIC_BLOCKCHAIN_EXPLORER_URL: z
    .string()
    .url("Invalid blockchain explorer URL."),
  NEXT_PUBLIC_CHAIN_ID: z.string().min(1, "Chain ID is required."),
  NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID: z
    .string()
    .min(1, "Wallet Connect Project ID is required."),
  NEXT_PUBLIC_CHAINS: z
    .string()
    .transform((value) => value.split(",").map((chain) => chain.trim()))
    .refine(
      (chains) =>
        chains.every((chain) =>
          allowedChains.includes(chain as (typeof allowedChains)[number])
        ),
      {
        message: "Invalid chain name detected.",
      }
    ),
});

export function getEnvVars() {
  const env = schema.parse(process.env);
  return {
    BLOG_CONTRACT_ADDRESS: env.NEXT_PUBLIC_BLOG_CONTRACT_ADDRESS,
    BLOCKCHAIN_RPC_URL: env.NEXT_BLOCKCHAIN_RPC_URL,
    IPFS_API_URL: env.NEXT_IPFS_API_URL,
    IPFS_GET_URL: env.NEXT_PUBLIC_IPFS_GET_URL,
    IS_IPFS_PIN_ENABLED: env.NEXT_IS_IPFS_PIN_ENABLED,
    BLOCKCHAIN_EXPLORER_URL: env.NEXT_PUBLIC_BLOCKCHAIN_EXPLORER_URL,
    CHAIN_ID: env.NEXT_PUBLIC_CHAIN_ID,
    WALLET_CONNECT_PROJECT_ID: env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
    CHAINS: env.NEXT_PUBLIC_CHAINS,
  };
}

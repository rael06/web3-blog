import { z } from "zod";

const schema = z.object({
  NEXT_PUBLIC_BLOG_CONTRACT_ADDRESS: z.string(),
  NEXT_PUBLIC_BLOCKCHAIN_RPC_URL: z.string(),
  NEXT_PUBLIC_CORS_ORIGIN: z.string(),
  NEXT_IPFS_API_URL: z.string(),
  NEXT_PUBLIC_IPFS_GET_URL: z.string(),
  NEXT_IS_IPFS_PIN_ENABLED: z.string(),
});

function getEnvVars() {
  const env = schema.parse(process.env);
  return {
    BLOG_CONTRACT_ADDRESS: env.NEXT_PUBLIC_BLOG_CONTRACT_ADDRESS,
    BLOCKCHAIN_RPC_URL: env.NEXT_PUBLIC_BLOCKCHAIN_RPC_URL,
    CORS_ORIGIN: env.NEXT_PUBLIC_CORS_ORIGIN,
    IPFS_API_URL: env.NEXT_IPFS_API_URL,
    IPFS_GET_URL: env.NEXT_PUBLIC_IPFS_GET_URL,
    IS_IPFS_PIN_ENABLED: env.NEXT_IS_IPFS_PIN_ENABLED === "true",
  };
}

export const serverEnvVars = getEnvVars();

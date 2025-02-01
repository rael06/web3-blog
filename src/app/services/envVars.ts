import { z } from "zod";

const schema = z.object({
  NEXT_PUBLIC_BLOG_CONTRACT_ADDRESS: z.string(),
  NEXT_PUBLIC_BLOCKCHAIN_RPC_URL: z.string(),
  NEXT_PUBLIC_CORS_ORIGIN: z.string(),
});

function getEnvVars() {
  const env = schema.parse(process.env);
  return {
    BLOG_CONTRACT_ADDRESS: env.NEXT_PUBLIC_BLOG_CONTRACT_ADDRESS,
    BLOCKCHAIN_RPC_URL: env.NEXT_PUBLIC_BLOCKCHAIN_RPC_URL,
    CORS_ORIGIN: env.NEXT_PUBLIC_CORS_ORIGIN,
  };
}

export const envVars = getEnvVars();

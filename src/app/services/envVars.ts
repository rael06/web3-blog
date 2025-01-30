import { z } from "zod";

const schema = z.object({
  NEXT_PUBLIC_BLOG_CONTRACT_ADDRESS: z.string(),
  NEXT_PUBLIC_BLOG_CONTRACT_OWNER_ADDRESS: z.string(),
  NEXT_PUBLIC_BLOG_CONTRACT_OWNER_PK: z.string(),
  NEXT_PUBLIC_BLOCKCHAIN_RPC_URL: z.string(),
});

function getEnvVars() {
  const env = schema.parse(process.env);
  return {
    BLOG_CONTRACT_ADDRESS: env.NEXT_PUBLIC_BLOG_CONTRACT_ADDRESS,
    BLOG_CONTRACT_OWNER_ADDRESS: env.NEXT_PUBLIC_BLOG_CONTRACT_OWNER_ADDRESS,
    BLOG_CONTRACT_OWNER_PK: env.NEXT_PUBLIC_BLOG_CONTRACT_OWNER_PK,
    BLOCKCHAIN_RPC_URL: env.NEXT_PUBLIC_BLOCKCHAIN_RPC_URL,
  };
}

export const envVars = getEnvVars();

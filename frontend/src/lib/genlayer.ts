import { createClient } from "genlayer-js";

const RPC_URL =
  process.env.NEXT_PUBLIC_GENLAYER_RPC_URL || "https://studio.genlayer.com/api";
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";

let clientInstance: ReturnType<typeof createClient> | null = null;

function getClient() {
  if (!clientInstance) {
    clientInstance = createClient({
      endpoint: RPC_URL,
    });
  }
  return clientInstance;
}

export function getContract() {
  const client = getClient();
  return {
    read: async (method: string, args: unknown[]) => {
      const result = await client.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        functionName: method,
        args,
      });
      return result;
    },
    write: async (method: string, args: unknown[]) => {
      const hash = await client.writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        functionName: method,
        args,
        value: BigInt(0),
      });
      const receipt = await client.waitForTransactionReceipt({ hash });
      return receipt;
    },
  };
}

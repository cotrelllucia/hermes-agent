import { GenLayerClient } from "genlayer-js";

export default async function main(client: GenLayerClient<any>) {
  const contractPath = "contracts/truth_lens.py";

  console.log("Deploying TruthLens contract...");

  const receipt = await client.deployContract({
    contractPath,
    args: [],
  });

  console.log(`TruthLens deployed successfully!`);
  console.log(`Contract Address: ${receipt.contractAddress}`);
  console.log(
    `\nAdd this to your frontend/.env as NEXT_PUBLIC_CONTRACT_ADDRESS=${receipt.contractAddress}`
  );

  return receipt;
}

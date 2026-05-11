import { defineConfig } from "genlayer-js/config";

export default defineConfig({
  contracts: {
    truthLens: {
      path: "contracts/truth_lens.py",
    },
  },
  deploy: {
    script: "deploy/deployScript.ts",
  },
});

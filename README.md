# TruthLens - Decentralized AI Fact-Checker

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/license/mit/)
[![GenLayer](https://img.shields.io/badge/Built%20on-GenLayer-blue)](https://genlayer.com)

**TruthLens** is a decentralized fact-checking application built on [GenLayer](https://genlayer.com). It leverages GenLayer's Intelligent Contracts to verify claims using AI-powered web analysis with validator consensus.

## How It Works

1. **Submit a Claim** — Users submit a statement they want verified, optionally providing a source URL
2. **Web Data Fetching** — The contract fetches relevant web content directly (no oracles needed)
3. **AI Analysis** — LLM validators analyze the evidence and determine the verdict
4. **Consensus** — Multiple validators must agree on the verdict through GenLayer's equivalence principle
5. **On-Chain Storage** — Verified results are stored permanently on-chain

## Key GenLayer Features Demonstrated

| Feature | Usage in TruthLens |
|---------|-------------------|
| **LLM Calls** (`gl.nondet.exec_prompt`) | Analyzing web content to determine claim veracity |
| **Web Access** (`gl.nondet.web.get/render`) | Fetching source pages and search results |
| **Equivalence Principle** (`run_nondet_unsafe`) | Custom validator ensures leader and validator agree on verdict |
| **State Management** (`TreeMap`) | Storing verified claims on-chain |

## Architecture

```
truthlens/
├── contracts/
│   └── truth_lens.py          # Intelligent Contract (Python)
├── deploy/
│   └── deployScript.ts        # GenLayer CLI deploy script
├── frontend/                  # Next.js 15 frontend
│   ├── src/
│   │   ├── app/               # App router pages
│   │   ├── components/        # React components
│   │   └── lib/               # GenLayerJS client integration
│   └── .env.example
├── test/
│   └── test_truth_lens.py     # Integration tests (pytest + gltest)
├── genlayer.config.ts         # GenLayer project configuration
├── requirements.txt           # Python test dependencies
└── package.json               # Project scripts
```

## Quick Start

### Prerequisites

- [GenLayer CLI](https://github.com/genlayerlabs/genlayer-cli) installed globally: `npm install -g genlayer`
- A running GenLayer Studio ([hosted](https://studio.genlayer.com/) or [local](https://docs.genlayer.com/developers/intelligent-contracts/tooling-setup))
- Node.js 18+
- Python 3.8+

### 1. Deploy the Contract

```bash
# Set your network
genlayer network studionet

# Deploy the contract
genlayer deploy
```

Note the contract address from the output.

### 2. Run the Frontend

```bash
cd frontend
cp .env.example .env
# Edit .env and set NEXT_PUBLIC_CONTRACT_ADDRESS to the deployed address

npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Run Tests

```bash
# Install test dependencies
pip install -r requirements.txt

# Run integration tests (requires GenLayer Studio running)
gltest
```

## Contract Methods

### Write Methods

| Method | Parameters | Description |
|--------|-----------|-------------|
| `verify_claim` | `claim_text: str, source_url: str` | Verify a claim against a specific source URL |
| `verify_claim_multi_source` | `claim_text: str` | Verify a claim using web search (auto-discovers sources) |

### View Methods

| Method | Parameters | Description |
|--------|-----------|-------------|
| `get_claim` | `claim_id: int` | Get a specific claim result by ID |
| `get_claim_count` | — | Get total number of verified claims |
| `get_recent_claims` | `count: int` | Get the N most recent verifications |

## Verdicts

- **SUPPORTED** — The claim is supported by the evidence found
- **REFUTED** — The claim contradicts the evidence found  
- **INSUFFICIENT_EVIDENCE** — Not enough information to make a determination

## Technology Stack

- **Contract**: Python (GenVM SDK)
- **Frontend**: Next.js 15, TypeScript, TailwindCSS, Radix UI
- **SDK**: GenLayerJS (TypeScript)
- **Testing**: pytest, gltest
- **Deployment**: GenLayer CLI

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `gltest`
5. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) for details.

## Links

- [GenLayer Documentation](https://docs.genlayer.com/)
- [GenLayer Studio](https://studio.genlayer.com/)
- [GenLayer Builder Program](https://portal.genlayer.foundation/)
- [GenLayerJS SDK](https://github.com/genlayerlabs/genlayer-js)

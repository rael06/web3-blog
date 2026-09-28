# Web3 Blog

Welcome to the Web3 Blog—a decentralized application (dApp) that allows users to create and read blog posts with metadata stored on IPFS and content identifiers (CIDs) stored on the Ethereum blockchain. This project serves as a proof of concept to practice Web3 technologies and is deployed on the Sepolia testnet.

## Features

- **Decentralized Storage**: Blog post metadata is stored on the InterPlanetary File System (IPFS), ensuring decentralized and immutable storage.
- **Blockchain Integration**: IPFS CIDs are stored on the Ethereum blockchain, providing a verifiable and tamper-proof record of your posts.
- **User-Friendly Interface**: Create and read posts through a simple and intuitive interface built with React and Material-UI.
- **Wallet Connectivity**: Users can connect their wallets via MetaMask to create posts, while reading posts is accessible without a wallet connection.

## Technologies Used

- **Frontend**: Developed using TypeScript with Next.js 15 and Material-UI (MUI) for a dynamic user interface.
- **Backend**: Smart contracts are written in Solidity and deployed using Hardhat on the Sepolia testnet.
- **Storage**: Utilizes IPFS with the Kubo client for decentralized storage of metadata.
- **Deployment**: The application is containerized using Docker and deployed on a Virtual Private Server (VPS) by GitHub Actions. The VPS runs an IPFS node.

## Getting Started

### Prerequisites

- **Node.js**: Ensure you have Node.js installed version 23+. [Download Node.js](https://nodejs.org/)
- **MetaMask**: Install the MetaMask extension in your browser. [Get MetaMask](https://metamask.io/)

### Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/rael06/web3-blog.git
   cd web3-blog
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Set Up hardhat environment**:

   - Create a `.env` file in the root of hardhat directory.
   - Run a local blockchain with `npx hardhat node`

   - Add the following variables:

     ```
     LOCAL_BLOG_CONTRACT_OWNER_PK=your_wallet_private_key # Important, find it on MetaMask importing the first account of the npx hardhat node logs, then click on show private key
     LOCAL_RPC_URL=http://127.0.0.1:8545
     BLOG_CONTRACT_ADDRESS=fill it once you have deployed the contract
     SEPOLIA_BLOG_CONTRACT_OWNER_PK=your_wallet_private_key # Just leave it empty if you only run locally
     SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your_infura_project_id # Just leave it empty if you only run locally
     ETHERSCAN_API_KEY=your_etherscan_api_key # Just leave it empty, it is not used if you only run locally
     ```

   - Run `npx hardhat run --network localhost scripts/deploy.ts` to deploy the contract locally.

4. **Set Up Environment Variables**:

   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```
     NEXT_PUBLIC_BLOG_CONTRACT_ADDRESS=the address of the deployed contract
     NEXT_BLOCKCHAIN_RPC_URL=http://127.0.0.1:8545
     NEXT_IPFS_API_URL=http://localhost:5001
     NEXT_PUBLIC_IPFS_GET_URL=http://localhost:8080/ipfs
     NEXT_IS_IPFS_PIN_ENABLED=true
     NEXT_PUBLIC_BLOCKCHAIN_EXPLORER_URL=https://sepolia.etherscan.io
     NEXT_PUBLIC_CHAIN_ID=1337
     NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id
     NEXT_PUBLIC_CHAINS=localhost
     ```

5. **Start the Development Server**:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`.

## Usage

### Connecting Your Wallet

To create a post, connect your wallet via MetaMask with some SepoliaETH. If you need SepoliaETH:

1. **Create a Wallet**: Set up a wallet using MetaMask.
2. **Obtain SepoliaETH**: Use the [Sepolia Testnet Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia) to get test ETH.

### Creating a Post

1. **Connect Wallet**: Click on the "Connect Wallet" button and authorize the connection in MetaMask.
2. **Navigate to Create Post**: Use the navigation menu to go to the "Create Post" page.
3. **Fill in Details**: Enter the title, body, category, and optionally upload an image.
4. **Publish**: Click "Create Post" and confirm the transaction in MetaMask.

### Reading Posts

All posts are accessible from the homepage. Click on any post to read its content.

## Deployment

The blog runs on the VPS at `https://web3-blog.rael-calitro.ovh`, deployed with [Kamal 2](https://kamal-deploy.org) (`config/deploy.yml`). GitHub Actions (`.github/workflows/ci-cd.yml`) lints and type-checks every push and pull request, and on `main`:

- starts the IPFS node accessory `ipfs-node` if it is missing (repository in `/var/www/ipfs` on the VPS, swarm port 4001 public, API and gateway on localhost only);
- builds the image on the runner (the RPC URL is a build secret, never stored in the image) and sends it to the VPS through the SSH tunnel (Kamal local registry), as the `kamal` user with a restricted key;
- starts the new container (read-only, no capabilities), waits for `/` to answer, then switches the traffic of `kamal-proxy`: no downtime. If the new container never gets healthy, the previous one keeps serving.

Traffic path: Cloudflare → tunnel `vps-edge` → `cloudflared` → `kamal-proxy` → blog; the blog pins posts through `http://ipfs-node:5001`.

**Settings and secrets** live in the GitHub environment `production` (Settings → Environments), restricted to `main`; `HOST`, `PORT` and `NEXT_IPFS_API_URL` are fixed in `config/deploy.yml`:

| Kind | Names |
| --- | --- |
| Variables | `NEXT_PUBLIC_BLOG_CONTRACT_ADDRESS`, `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`, `NEXT_PUBLIC_IPFS_GET_URL`, `NEXT_PUBLIC_BLOCKCHAIN_EXPLORER_URL`, `NEXT_PUBLIC_CHAIN_ID`, `NEXT_PUBLIC_CHAINS`, `NEXT_IS_IPFS_PIN_ENABLED` |
| Secrets | `NEXT_BLOCKCHAIN_RPC_URL`; connection: `KAMAL_SSH_KEY`, `VPS_HOST`, `VPS_SSH_PORT`, `VPS_KNOWN_HOSTS` |

- To apply a change without a commit: Actions → CI/CD → Run workflow on `main`.
- Variables appear in the public workflow logs; anything sensitive goes in a secret.
- A new setting needs its line in `config/deploy.yml` (and `.kamal/secrets` for a secret) and in the deploy job of the workflow.
- The repository variable `DEPLOY_ENABLED` (`true`/`false`) turns deployments on or off.
- Rollback: `kamal app containers -q` lists the versions kept on the VPS, `kamal rollback <version>` switches back (see `docs/runbooks/workstation.md` in `rael06/vps`).

## Contributing

As an open-source project, feedback is welcome! Feel free to explore the codebase, report issues, or share your thoughts.

## License

This project is licensed under the MIT License.

---

Built with ❤️ by Rael CALITRO

Github: https://github.com/rael06  
Linkedin: https://www.linkedin.com/in/rael-calitro-4a519a187/  
Website: https://rael-calitro.ovh/

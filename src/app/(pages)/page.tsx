import { Container, Box, Typography, Grid2 as Grid } from "@mui/material";
import Link from "next/link";

export default function Home() {
  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to the Web3 Blog
        </Typography>
        <Typography variant="body1">
          This is a personal dApp project where you can create and read blog
          posts. Metadata is stored on IPFS, and the IPFS CID is stored
          on-chain. The application runs on the Sepolia testnet as it is a
          modest proof of concept only to practice web3.
        </Typography>
        <Typography variant="body1">
          To create a post, connect your wallet via MetaMask with some
          SepoliaETH. Reading posts is accessible without a wallet connection.
        </Typography>
        <Typography variant="body1">
          If you need SepoliaETH, create a wallet via MetaMask and use the
          faucet:
          <Box component="span" sx={{ ml: 1 }}>
            <Link
              href="https://cloud.google.com/application/web3/faucet/ethereum/sepolia"
              target="_blank"
              rel="noopener"
            >
              https://cloud.google.com/application/web3/faucet/ethereum/sepolia
            </Link>
          </Box>
        </Typography>
      </Box>
      <Box sx={{ my: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Project Infrastructure and Technologies
        </Typography>
        <Typography variant="body1">
          This project is built with a focus on decentralization and modern web
          technologies:
        </Typography>
        <Grid container spacing={2} mt={2}>
          <Grid size={12}>
            <Typography variant="h6" component="h3">
              Frontend
            </Typography>
            <Typography variant="body1">
              Developed using Typescript with Next.js 15 and Material-UI (MUI)
              for a dynamic user interface.
            </Typography>
          </Grid>
          <Grid size={12}>
            <Typography variant="h6" component="h3">
              Backend
            </Typography>
            <Typography variant="body1">
              Smart contracts are written in Solidity and deployed using Hardhat
              on the Sepolia testnet.
            </Typography>
          </Grid>
          <Grid size={12}>
            <Typography variant="h6" component="h3">
              Storage
            </Typography>
            <Typography variant="body1">
              Utilizes IPFS with the Kubo client for decentralized storage of
              metadata.
            </Typography>
          </Grid>
          <Grid size={12}>
            <Typography variant="h6" component="h3">
              Deployment
            </Typography>
            <Typography variant="body1">
              The application is containerized using Docker and deployed on a
              VPS (via CI/CD pipelines). The VPS runs an IPFS node.
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ my: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Open Source Collaboration
        </Typography>
        <Typography variant="body1">
          As an open-source project, feedbacks are welcome! Feel free to explore
          the codebase and report issues or share thoughts.
        </Typography>
        <Typography variant="body1">Built with ❤️ by Rael CALITRO</Typography>
      </Box>
    </Container>
  );
}

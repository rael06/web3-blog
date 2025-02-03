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
          on-chain. The application runs on the Sepolia testnet to minimize
          costs.
        </Typography>
        <Typography variant="body1">
          To create a post, connect your wallet via MetaMask with some
          SepoliaETH. Reading posts is accessible without a wallet connection.
        </Typography>
        <Typography variant="body1">
          If you need SepoliaETH, create a wallet via MetaMask and use the
          faucet:
          <Link
            href="https://cloud.google.com/application/web3/faucet/ethereum/sepolia"
            target="_blank"
            rel="noopener"
          >
            Sepolia ETH Faucet
          </Link>
        </Typography>
      </Box>
      <Grid container spacing={4}>
        <Grid size={12}>
          <Typography variant="h6" component="h2" gutterBottom>
            Decentralized Storage
          </Typography>
          <Typography variant="body1">
            All post metadata is stored on IPFS, ensuring decentralized and
            immutable storage.
          </Typography>
        </Grid>
        <Grid size={12}>
          <Typography variant="h6" component="h2" gutterBottom>
            Blockchain Integration
          </Typography>
          <Typography variant="body1">
            IPFS CIDs are stored on-chain, providing a verifiable and
            tamper-proof record of your posts.
          </Typography>
        </Grid>
        <Grid size={12}>
          <Typography variant="h6" component="h2" gutterBottom>
            User-Friendly Interface
          </Typography>
          <Typography variant="body1">
            Create and read posts with ease through a simple and intuitive
            interface built with React and Material-UI.
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
}

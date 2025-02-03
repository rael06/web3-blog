"use client";

import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "next/link";
import Image from "next/image";
import { useWalletContext } from "@/app/contexts/WalletContext";

const Header: React.FC = () => {
  const { account, connect, disconnect } = useWalletContext();

  return (
    <AppBar position="static">
      <Toolbar>
        {/* Left Section: Logo and Navigation */}
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <Image src="/next.svg" alt="Blockchain Logo" width={40} height={40} />
          <Box sx={{ display: "flex", ml: 2 }}>
            <Button color="inherit" component={Link} href="/">
              Home
            </Button>
            <Button color="inherit" component={Link} href="/posts">
              Posts
            </Button>
          </Box>
        </Box>

        {/* Right Section: Wallet Information */}
        <Box>
          {account ? (
            <>
              <Typography
                variant="body1"
                component="span"
                sx={{ marginRight: 2 }}
              >
                {`${account.slice(0, 6)}...${account.slice(-4)}`}
              </Typography>
              <Button color="inherit" onClick={disconnect}>
                Disconnect
              </Button>
            </>
          ) : (
            <Button color="inherit" onClick={connect}>
              Connect Wallet
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

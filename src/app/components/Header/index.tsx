"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "next/link";
import Image from "next/image";

const Header: React.FC = () => {
  return (
    <AppBar position="static" component={"header"}>
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <Image src="/logo.jpeg" alt="Web3 blog logo" width={40} height={40} />
          <Box sx={{ display: "flex", ml: 2 }}>
            <Button color="inherit" component={Link} href="/">
              Home
            </Button>
            <Button color="inherit" component={Link} href="/posts">
              Posts
            </Button>
          </Box>
        </Box>

        <Box>
          <ConnectButton />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

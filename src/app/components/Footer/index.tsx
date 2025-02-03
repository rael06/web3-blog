import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <AppBar position="static" component={"footer"}>
      <Toolbar>
        <Typography variant="body1">Built by Rael CALITRO</Typography>
        <Box component="span" sx={{ ml: 2 }}>
          <Link href="https://github.com/rael06/web3-blog" target="_blank">
            Github
          </Link>
        </Box>
        <Box component="span" sx={{ ml: 2 }}>
          <Link
            href="https://www.linkedin.com/in/rael-calitro-4a519a187/"
            target="_blank"
          >
            Linkedin
          </Link>
        </Box>
        <Box component="span" sx={{ ml: 2 }}>
          <Link href="https://rael-calitro.ovh/" target="_blank">
            Website
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Footer;

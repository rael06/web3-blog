import type { Metadata } from "next";
import "./globals.css";
import WalletContextProvider from "@/app/contexts/WalletContext";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../theme";
import { Roboto } from "next/font/google";
import Header from "../components/Header";
import { Box, CssBaseline } from "@mui/material";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
  preload: true,
});

export const metadata: Metadata = {
  title: "Web3-blog",
  description: "A web3 blog to create posts on chain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.variable}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <WalletContextProvider>
              <Header />
              <Box
                component={"main"}
                sx={{
                  p: 2,
                  height: "calc(100vh - (64px + 64px))", // Adjust based on header's height and footer's height
                  overflow: "auto",
                }}
              >
                {children}
              </Box>
            </WalletContextProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

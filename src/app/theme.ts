"use client";
import { createTheme } from "@mui/material/styles";

// Color constants
const NEUTRAL_GRAY = "#4a4a4a";
const LIGHT_NEUTRAL_GRAY = "#9e9e9e";
const LIGHT_GRAY_BACKGROUND = "#f5f5f5";
const WHITE = "#ffffff";
const DARK_GRAY_TEXT = "#333333";
const MEDIUM_GRAY_TEXT = "#666666";

const theme = createTheme({
  palette: {
    primary: {
      main: NEUTRAL_GRAY,
      light: LIGHT_NEUTRAL_GRAY,
    },
    secondary: {
      main: LIGHT_NEUTRAL_GRAY,
    },
    background: {
      default: LIGHT_GRAY_BACKGROUND,
      paper: WHITE,
    },
    text: {
      primary: DARK_GRAY_TEXT,
      secondary: MEDIUM_GRAY_TEXT,
    },
  },
  typography: {
    fontFamily: "var(--font-roboto)",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: LIGHT_NEUTRAL_GRAY,
          },
        },
      },
    },
  },
});

export default theme;

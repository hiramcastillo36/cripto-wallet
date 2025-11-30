import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#003049", // Cosmos Blue
    },
    secondary: {
      main: "#C1121F", // Crimson Blaze
    },
    error: {
      main: "#780000", // Gochujang Red
    },
    info: {
      main: "#669BBC", // Blue Marble
    },
    warning: {
      main: "#FADBD4", // Varden
    },
    background: {
      default: "#f5f5f5",
    },
    text: {
      primary: "#1a1a1a",
      secondary: "#555",
    },
  },
  typography: {
    fontFamily: "Inter, Roboto, sans-serif",
  },
});

export default theme;

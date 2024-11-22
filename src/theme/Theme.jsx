import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    text: {
      primary: "#333333",
      secondary: "#4A4647",
      tertiary: "#2C2829",
    },
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",

    h1: {
      fontSize: "24px",
      fontWeight: 600,
    },
    h2: {
      fontSize: "22px",
      fontWeight: 600,
    },
    h3: {
      fontSize: "20px",
      fontWeight: 600,
    },
    h4: {
      fontSize: "18px",// fixed
      fontWeight: 600,
    },
    h5: {
      fontSize: "16px",
      fontWeight: 600,
    },
    h6: {
      fontSize: "14px",
      fontWeight: 500,//FIXED
    },
    h7: {
      fontSize: "14px",
      fontWeight: 400,//FIXED
    },
    h8: {
      fontSize: "12px",
      fontWeight: 400,
    },
    h9: {
      fontSize: "10px",
      fontWeight: 600,
    },
  },
});

export default theme;

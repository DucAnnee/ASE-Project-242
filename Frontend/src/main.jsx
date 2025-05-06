import {
  createTheme,
  StyledEngineProvider,
  ThemeProvider,
} from "@mui/material";
import { RouterProvider } from "react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// import "@fontsource/roboto/300.css";
// import "@fontsource/roboto/400.css";
// import "@fontsource/roboto/500.css";
// import "@fontsource/roboto/700.css";
import "@fontsource/be-vietnam-pro/300.css";
import "@fontsource/be-vietnam-pro/400.css";
import "@fontsource/be-vietnam-pro/500.css";
import "@fontsource/be-vietnam-pro/700.css";

import router from "./routers/router.jsx";
import { AuthProvider } from './contexts/AuthContext.jsx'

const theme = createTheme({
  palette: {
    primary: {
      main: "#1488DB",
      light: "#BFE4ED",
      dark: "#083657",
    },
    secondary: {
      main: "#1488db",
    },
  },
  typography: {
    fontFamily: "Be Vietnam Pro",
  },
});
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <RouterProvider router={router} />
        </ThemeProvider>
      </StyledEngineProvider>
    </AuthProvider>
  </StrictMode>
);

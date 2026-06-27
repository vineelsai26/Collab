import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import App from "./Components/App/App";
import Docs from "./Components/Docs/Docs";
import Login from "./Components/Login/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Logout from "./Components/Logout/Logout";
import { StyledEngineProvider } from "@mui/material/styles";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@vstack/ui/styles.css";

const root = document.getElementById("root");
const queryClient = new QueryClient();
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim();
const ReactQueryDevtools = import.meta.env.DEV
  ? lazy(() =>
      import("@tanstack/react-query-devtools").then((mod) => ({
        default: mod.ReactQueryDevtools,
      })),
    )
  : null;

const app = (
  <StyledEngineProvider injectFirst>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/docs/:pageId" element={<Docs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </BrowserRouter>
  </StyledEngineProvider>
);

ReactDOM.createRoot(root!).render(
  <QueryClientProvider client={queryClient}>
    {googleClientId ? (
      <GoogleOAuthProvider clientId={googleClientId}>{app}</GoogleOAuthProvider>
    ) : (
      app
    )}
    {ReactQueryDevtools ? (
      <Suspense fallback={null}>
        <ReactQueryDevtools />
      </Suspense>
    ) : null}
  </QueryClientProvider>,
);

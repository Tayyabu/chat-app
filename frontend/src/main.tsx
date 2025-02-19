import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import SocketContextProvider from "./context/SocketContext.tsx";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const client = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={client}>
      <SocketContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SocketContextProvider>
    </QueryClientProvider>
  </StrictMode>
);

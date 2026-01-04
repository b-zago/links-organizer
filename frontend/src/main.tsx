import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { UserContextProvider } from "./context/UserContext.tsx";
import { DataContextProvider } from "./context/DataContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <UserContextProvider>
        <DataContextProvider>
          <App />
        </DataContextProvider>
      </UserContextProvider>
    </BrowserRouter>
  </StrictMode>
);

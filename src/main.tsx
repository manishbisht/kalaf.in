import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Clarity from "@microsoft/clarity";
import "./tokens.css";
import "./index.css";
import App from "./App";
import { ENV } from "./env";

if (ENV.clarityProjectId) {
    Clarity.init(ENV.clarityProjectId);
}

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App />
    </StrictMode>
);

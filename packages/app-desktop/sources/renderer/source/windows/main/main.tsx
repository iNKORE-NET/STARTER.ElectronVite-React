import "source/styles/main.css";

import React from "react";
import ReactDOM from "react-dom/client";
import AppWrapper from "source/common/app-wrapper";
import { HashRouter } from "react-router";

import { Router } from "./routes"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render
(
    <React.StrictMode>
        <AppWrapper>
            <HashRouter>
                <Router/>
            </HashRouter>
        </AppWrapper>
    </React.StrictMode>
);

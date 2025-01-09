import "source/styles/main.css";

import React from "react";
import ReactDOM from "react-dom/client";
import AppWrapper from "source/common/app-wrapper";
import { HashRouter } from "react-router";
import HelloView from "./view";

// I'm too lazy to add the router to this window, you can do it yourself anyway, it's simple.

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render
(
    <React.StrictMode>
        <AppWrapper>
            <HashRouter>
                <HelloView/>
            </HashRouter>
        </AppWrapper>
    </React.StrictMode>
);
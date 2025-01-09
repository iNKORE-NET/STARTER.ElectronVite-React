import Versions from "source/components/Versions";
import electronLogo from "/images/electron.svg";
import React, { Fragment } from "react";

import CSS from "./index.module.css";

import { Link as RouterLink } from "react-router";
import { Helmet } from "react-helmet-async";

const HomePage: React.FunctionComponent = () =>
{
    const ipcHandle = (): void => window.electron.ipcRenderer.send("ping");

    const onNewWindow = (): void =>
    {
        window.electron.ipcRenderer.send("new-window", { });
    }

    return (
        <Fragment>
            <Helmet>
                <title>Welcome To The App</title>
            </Helmet>
            <div className={`${CSS.container} main-bg`}>
                <img alt="logo" className="logo" src={electronLogo} />
                <div className="creator">Powered by electron-vite</div>
                <div className="text">
                    Build an Electron app with <span className="react">React</span>
                    &nbsp;and <span className="ts">TypeScript</span>
                </div>
                <p className="tip">
                    Please try pressing <code>F12</code> to open the devTool
                </p>
                <div className="actions">
                    <div className="action">
                        <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">
                            Documentation
                        </a>
                    </div>
                    <div className="action">
                        <a target="_blank" rel="noreferrer" onClick={ipcHandle}>
                            Send IPC
                        </a>
                    </div>
                    <div className="action">
                        <RouterLink to="/about">About</RouterLink>
                    </div>
                    <div className="action">
                        <a target="_blank" rel="noreferrer" onClick={onNewWindow}>
                            Create New Window
                        </a>
                    </div>
                </div>
                <Versions/>
            </div>
        </Fragment>
    )
}

export default HomePage;

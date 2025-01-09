import { Fragment } from "react/jsx-runtime";
import CSS from "./index.module.css";
import { Link as RouterLink } from "react-router";
import { Helmet } from "react-helmet-async";

const AboutPage: React.FunctionComponent = () =>
{
    return (
        <Fragment>
            <Helmet>
                <title>The About Page</title>
            </Helmet>
            <div className={CSS.container}>
                <h1>About</h1>
                <p className={CSS.description}>
                    <br/>
                    This is a template for making desktop applications with Electron-Vite and other technologies, made with ❤️‍🩹 by <a href="https://www.inkore.net" target="_blank" rel="noreferrer">iNKORE Studios</a> starring <a href="https://github.com/NotYoojun" target="_blank" rel="noreferrer">NotYoojun</a>
                    <br/>
                    <br/>
                    I'm just way too lazy to do the rest of the work, so I'm just gonna leave this here, cause who's gonna read this anyways? However, since this app is created successfully, you got a whole world of possibilities!
                </p>

                <div className="actions">
                        <div className="action">
                            <RouterLink to="/">Go Back</RouterLink>
                        </div>
                    </div>
            </div>
        </Fragment>
    )
}

export default AboutPage;
import { Fragment } from "react";
import { HelmetProvider } from "react-helmet-async";

export type AppWrapperProps = 
{
    children?: React.ReactNode;
}

/**
 * The common outside wrapper for every window in the application.
 * This component should contain the common providers and other stuff that EVERY window should have.
 */
const AppWrapper: React.FunctionComponent<AppWrapperProps> = ({ children }) =>
{
    return (
        <Fragment>
            <HelmetProvider>
                {children}
            </HelmetProvider>
        </Fragment>
    )
}

export default AppWrapper;
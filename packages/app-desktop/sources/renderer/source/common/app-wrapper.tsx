import { Fragment } from "react";

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
            {children}
        </Fragment>
    )
}

export default AppWrapper;
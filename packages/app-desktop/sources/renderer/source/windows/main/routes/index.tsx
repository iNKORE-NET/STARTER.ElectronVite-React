import { Route, Routes } from "react-router";

import HomePage from "../views/home";
import AboutPage from "../views/about";

export const Router: React.FunctionComponent = () =>
{
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage/>} />
        </Routes>
    )
}
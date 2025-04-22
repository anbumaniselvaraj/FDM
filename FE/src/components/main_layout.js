// components/MainLayout.js
import React from "react";
import Sidebar from "./sidebar";
import { BrowserRouter } from "react-router-dom";

const MainLayout = ({ children }) => {
    return (
        <div style={{ display: "flex" }}>

            <Sidebar />

            <main style={{ flexGrow: 1, padding: "16px" }}>
                {children}
            </main>
        </div>
    );
};

export default MainLayout;

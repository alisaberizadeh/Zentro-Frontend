import React from 'react'
import Cookies from "js-cookie";
import { Navigate } from 'react-router-dom';

function Authcheck({ children }) {
    const userData = Cookies.get("user");
    const user = userData ? JSON.parse(userData) : null;

    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
}

export default Authcheck
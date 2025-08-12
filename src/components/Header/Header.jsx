import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import Logo from "../../assets/logo.png";

const Header = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = () => {
            setIsAuthenticated(!!localStorage.getItem("token"));
        };

        window.addEventListener("storage", checkAuth);

        return () => {
            window.removeEventListener("storage", checkAuth);
        };
    }, []);

    const handleLogout = () => {
        console.log("Logging out..."); // Debugging
        localStorage.removeItem("token"); // Remove token
        setIsAuthenticated(false); // Update UI
        navigate("/signin"); // Redirect to sign-in page
        setTimeout(() => {
            window.location.reload(); // Ensure fresh state
        }, 100);
    };

    return (
        <div className="header">
            <img src={Logo} alt="Logo" className="logo" />

            {isAuthenticated && (
                <button onClick={handleLogout} className="logout-btn">
                    Logout
                </button>
            )}
        </div>
    );
};

export default Header;

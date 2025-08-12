import React from 'react';
import "./Home.css";
import Dashbody from "../../components/Dashbody/Dashbody";
import { Link, useNavigate } from 'react-router-dom';
import logo from "../../assets/logo.png"; // Assuming logo is in src/assets

const InsidePage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Logging out..."); // Debugging
    localStorage.removeItem("token"); // Remove token
    navigate("/signin"); // Redirect to sign-in page
    setTimeout(() => {
      window.location.reload(); // Ensure fresh state
    }, 100);
  };

  return (
    <>
      <div className="inside-page-container">
        <header className="inside-page-header">
          <div className="header-left">
            <img src={logo} alt="Logo" className="logo-img" />
            <div className="welcome-message">
              <h1>Welcome back, [User Name]!</h1>
            </div>
          </div>
          <nav className="nav-links">
            <Link to="/home" className="nav-link">Home</Link>
            <Link to="/features" className="nav-link">Features</Link>
            <button onClick={handleLogout} className="nav-link logout-btn">Logout</button> 
          </nav>
        </header>

        <main className="main-content">
          <Dashbody />
        </main>
      </div>
    </>
  );
};

export default InsidePage;

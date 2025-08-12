import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LogoHeader.css";
import Logo from "../../assets/logo.png";
import Bars from "../../assets/bars.png";

const LogoHeader = () => {
  const navigate = useNavigate();
  const mobile = window.innerWidth <= 768;
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="logo-header">
      <img src={Logo} alt="logo" className="logo" />

      {menuOpen === false && mobile === true ? (
        <div
          style={{
            backgroundColor: "var(--appColor)",
            padding: "0.5rem",
            borderRadius: "5px",
          }}
          onClick={() => setMenuOpen(true)}
        >
          <img src={Bars} style={{ width: "1.5rem", height: "1.5rem" }} alt="menu" />
        </div>
      ) : (
        <ul className="logoheader-header-menu">
          <li onClick={() => { navigate("/home"); setMenuOpen(false); }}>
            Home
          </li>
          <li onClick={() => { navigate("/features"); setMenuOpen(false); }}>
            Features
          </li>
          <li onClick={() => { navigate("/home"); setMenuOpen(false); }}>
            Logout
          </li>
        </ul>
      )}
    </div>
  );
};

export default LogoHeader;

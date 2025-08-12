"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../App.css";
import "./SignIn.css";
import LogoHeader from "../../components/LogoHeader/LogoHeader";

const SignIn = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "", name: "" });
  const navigate = useNavigate(); // Hook for navigation

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isRegister ? "http://localhost:5000/auth/register" : "http://localhost:5000/auth/login";

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem("token", data.token);
            console.log("Stored Token:", localStorage.getItem("token")); // Debugging
            navigate("/features");
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error("Error:", error);
    }
};

  return (
    <>
      <LogoHeader />
      <div className="signin-container">
        <h2>{isRegister ? "Register" : "Sign In"}</h2>
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              className="signin-input"
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className="signin-input"
          />
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            className="signin-input"
          />
          <button type="submit" className="signin-btn">
            {isRegister ? "Register" : "Sign In"}
          </button>
        </form>
        <p className="toggle-text">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <span onClick={() => setIsRegister(!isRegister)} className="toggle-link">
            {isRegister ? "Sign In" : "Register"}
          </span>
        </p>
      </div>
    </>
  );
};

export default SignIn;

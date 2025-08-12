import React from "react";
import Hero from "../../components/Hero/Hero";
import Programs from "../../components/Programs/Programs"; // Import Programs from components folder
import Join from "../../components/Join/Join";        // Import Join from components folder
import Footer from "../../components/Footer/Footer"; 
import "./Homes.css";  // Optional: Any specific styling for the home page.

const Homes = () => {
  return (
    <div className="home">
      <Hero />       {/* The Hero Section */}
      <Programs />   {/* The Programs Section */}
      <Join />       {/* The Join Section */}
      <Footer />     {/* The Footer Section */}
    </div>
  );
};

export default Homes;

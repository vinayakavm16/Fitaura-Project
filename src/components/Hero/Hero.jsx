import React from "react";
import "./Hero.css";
import Header from "../Header/Header";

import hero_image from "../../assets/hero_image.png";
import hero_image_back from "../../assets/hero_image_back.png";
import Heart from "../../assets/heart.png";
import Calories from "../../assets/calories.png";

import { motion } from "framer-motion";
import NumberCounter from "number-counter";

import { useNavigate } from "react-router-dom";

const Hero = () => {
  const transition = { type: "spring", duration: 3 };
  const mobile = window.innerWidth <= 768 ? true : false;
  const navigate = useNavigate();


  return (
    <div className="hero" id="home">
      <div className="blur hero-blur"></div>
      <div className="left-h">
        {/* The Header */}
        <Header />

        {/* the best ad */}
        <div className="the-best-ad">
          <motion.div
            initial={{ left: mobile ? "178px" : "290px" }}
            whileInView={{ left: "8px" }}
            transition={{ ...transition, type: "tween" }}
          ></motion.div>
          <span>ai powered fitness at your fingertips</span>
        </div>

        {/* Hero Heading */}
        <div className="hero-text">
          <div>
            <span className="stroke-text">stay  </span>
            <span> fit</span>
          </div>

          <div>
            <span>stay well</span>
          </div>

          <div>
            <span>
              We're here to guide you in tracking and improving your health, helping you live your best life.
            </span>
          </div>
        </div>

        {/* figures */}
        <div className="figures">
          <div>
            <span>
              <NumberCounter end={100} start={50} delay="4" preFix="+" />
            </span>
            <span>Health assessments</span>
          </div>
          <div>
            <span>
              <NumberCounter end={25} start={0} delay="2" preFix="+" />
            </span>
            <span>fitness programs</span>
          </div>
          <div>
            <span>
              <NumberCounter end={50} start={0} delay="4" preFix="+" />
            </span>
            <span>Nutrition plans</span>
          </div>
        </div>

        {/* hero buttons */}
        <div className="hero-buttons">
          <button className="btn">Get Started</button>
          <button className="btn">Learn More</button>
        </div>
      </div>

      <div className="right-h">
      <button className="btn" onClick={() => navigate("/signin")}>
      Join Now
    </button>

        <motion.div
          className="heart-rate"
          initial={{ right: "-1rem" }}
          whileInView={{ right: "4rem" }}
          transition={transition}
        >
          <img src={Heart} alt="Heart" />
          <span>Avg Heart Rate</span>
          <span>60 to 100 bpm</span>
        </motion.div>

        {/* hero images */}
        <img src={hero_image} alt="hero_image" className="hero-image" />

        <motion.img
          src={hero_image_back}
          alt="hero_image_back"
          className="hero-image-back"
          initial={{ right: "11rem" }}
          whileInView={{ right: "20rem" }}
          transition={transition}
        />
        {/* Calories */}
        <motion.div
          className="calories"
          initial={{ right: "37rem" }}
          whileInView={{ right: "28rem" }}
          transition={transition}
        >
          <img src={Calories} alt="Calories" />
          <div>
            <span>Avg BP Level</span>
            <span>&lt; 120/80</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
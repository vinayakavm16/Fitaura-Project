import React from "react";
import "./Programs.css";
import { programsData } from "../../data/programsData";
// import RightArrow from "../../assets/rightArrow.png";

const Programs = () => {
  return (
    <div className="Programs" id="programs">
      {/* header */}
      <div className="programs-header">
        <span className="stroke-text">Explore our</span>
        <span className="normal-text">Features</span>
        <span className="stroke-text">to guide you</span>
      </div>

      <div className="programs-categories">
        {programsData.map((program, index) => (
          <div className="category" key={program.id || index}>
            {program.image}
            <span>{program.heading}</span>
            <span>{program.details}</span>

            {/* <div className="join-now">
              <span>Join Now</span>
              <img src={RightArrow} alt="" />
            </div> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Programs;

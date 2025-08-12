import React from "react";
import "./Nutrition.css";
import LogoHeader from "../../components/LogoHeader/LogoHeader";
import { useNavigate } from "react-router-dom";

const Nutrition = () => {
    const navigate = useNavigate();

    return (
        <>
            <LogoHeader />
            <div className="div-head">
                <h2>Nutrition & Meal Recommendations</h2>
            </div>
            <div className="nutrition-body">
                <div
                    className="nutrition-box"
                    onClick={() => navigate("/meal-plans")}
                >
                    <h3>Personalized Meal Plans</h3>
                    <p>Get daily/weekly meal plans based on your goals and dietary preferences.</p>
                </div>
            </div>
        </>
    );
};

export default Nutrition;

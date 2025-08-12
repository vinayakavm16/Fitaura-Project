import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Features.css";
import "../../App.css";
import LogoHeader from "../../components/LogoHeader/LogoHeader";

const Features = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.log("Unauthorized access detected! Redirecting to Sign In.");
            navigate("/signin", { replace: true });
        }
    }, [navigate]);

    return (
        <>
            <LogoHeader />
            <div className='div-head'>
                <h2>Checkout our FEATURES!</h2>
            </div>
            <div className="features-dashbody">
                <div className="box" onClick={() => navigate('/nutrition')}>
                      <h3>Nutrition and Meal Recommendations</h3> 
                </div>

                <div className="box" onClick={() => navigate('/symptoms')}>
                    <h3>Symptom Checker & Health Recommendations</h3>
                </div>
                <div className="box" onClick={() => navigate('/workoutplan')}>
                    <h3>Workout Plan Generator</h3>
               </div>
            </div>
        </>
    );
};

export default Features;

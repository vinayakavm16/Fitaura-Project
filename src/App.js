import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Homes from "./pages/Homes/Homes";
import SignIn from "./pages/SignIn/SignIn";
import Home from "./pages/Home/Home";
import Symptoms from "./pages/Symptoms/Symptoms";
import Features from "./pages/Features/Features";
import Nutrition from "./pages/Nutrition/Nutrition";
import MealPlans from "./pages/MealPlans/MealPlans";
import WorkoutPlan from "./pages/WorkoutPlan/WorkoutPlan"; // ✅ NEW: Workout Plan Page

import "./App.css";

const ProtectedRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

    useEffect(() => {
        const checkAuth = () => {
            setIsAuthenticated(!!localStorage.getItem("token"));
        };
        window.addEventListener("storage", checkAuth);
        return () => window.removeEventListener("storage", checkAuth);
    }, []);

    return isAuthenticated ? <Outlet /> : <Navigate to="/signin" replace />;
};

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Homes />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/home" element={<Home />} />
                <Route path="/symptoms" element={<Symptoms />} />
                <Route path="/nutrition" element={<Nutrition />} />
                <Route path="/meal-plans" element={<MealPlans />} />

                {/* ✅ Protected Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/features" element={<Features />} />
                    <Route path="/workoutplan" element={<WorkoutPlan />} /> {/* ✅ NEW */}
                </Route>
            </Routes>
        </Router>
    );
};

export default App;

import React, { useState } from "react";
import axios from "axios";
import "../../App.css";
import "./MealPlans.css";
import LogoHeader from "../../components/LogoHeader/LogoHeader";

const MealPlans = () => {
  const [goal, setGoal] = useState("");
  const [preference, setPreference] = useState("");
  const [weight, setWeight] = useState("");
  const [allergies, setAllergies] = useState("");
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPlan(null);

    try {
      const res = await axios.post("http://localhost:5000/mealplan", {
        goal,
        preference,
        weight: Number(weight),
        allergies: allergies.split(",").map((a) => a.trim().toLowerCase()),
      });

      setPlan(res.data.plan);
    } catch (err) {
      console.error("❌ Failed to fetch meal plan", err);
      setError("Failed to fetch meal plan. Please check your input and try again.");
    }
  };

  return (
    <>
      <LogoHeader />
      <div className="mealplans-head">
        <h2>Your Personalized Meal Plan</h2>
      </div>

      <div className="mealplans-form">
        <form onSubmit={handleSubmit}>
          <label>
            Your Goal:
            <select value={goal} onChange={(e) => setGoal(e.target.value)} required>
              <option value="">--Select--</option>
              <option value="Weight Loss">Weight Loss</option>
              <option value="Muscle Gain">Muscle Gain</option>
              <option value="Maintain Weight">Maintain Weight</option>
            </select>
          </label>

          <label>
            Dietary Preference:
            <select value={preference} onChange={(e) => setPreference(e.target.value)} required>
              <option value="">--Select--</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="non-vegetarian">Non-Vegetarian</option>
            </select>
          </label>

          <label>
            Weight (kg):
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g. 70"
              required
            />
          </label>

          <label>
            Allergies (comma-separated):
            <input
              type="text"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="e.g. peanuts, dairy"
            />
          </label>

          <button type="submit">Generate Plan</button>
        </form>

        {error && <p className="error-message">{error}</p>}

        {plan && (
          <div className="mealplans-results">
            {/* Nutrient summary */}
            {plan.nutrients && (
              <div className="nutrient-summary">
                <h3>Daily Nutrient Summary</h3>
                <ul>
                  <li>Calories: {plan.nutrients.calories.toFixed(0)} kcal</li>
                  <li>Protein: {plan.nutrients.protein.toFixed(1)} g</li>
                  <li>Carbs: {plan.nutrients.carbohydrates.toFixed(1)} g</li>
                  <li>Fat: {plan.nutrients.fat.toFixed(1)} g</li>
                </ul>
              </div>
            )}

            {/* Individual meals */}
            {plan.meals && plan.meals.length > 0 && (
              <div className="meals-list">
                <h3>Today's Meals</h3>
                <ul>
                  {plan.meals.map((meal) => (
                    <li key={meal.id}>
                      <strong>{meal.title}</strong>  
                      <br />
                      Ready in: {meal.readyInMinutes} min | Servings: {meal.servings}
                      {meal.sourceUrl && (
                        <>
                          <br />
                          <a href={meal.sourceUrl} target="_blank" rel="noopener noreferrer">
                            View Recipe
                          </a>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default MealPlans;

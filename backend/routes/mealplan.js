import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// ✅ Spoonacular API configuration
const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY; // Store securely in .env
const SPOONACULAR_API_URL = "https://api.spoonacular.com/mealplanner/generate";

// ✅ Goal-to-calorie mapping
const goalToCalories = {
  "Weight Loss": 1600,
  "Maintain Weight": 2000,
  "Muscle Gain": 2500,
};

// ✅ POST /mealplan route
router.post("/", async (req, res) => {
  const { goal, preference, allergies, weight } = req.body;

  console.log("🏃 POST /mealplan invoked:", req.body);

  if (!goal || !preference || !Array.isArray(allergies)) {
    return res.status(400).json({ error: "Missing required fields: goal, preference, allergies" });
  }

  const targetCalories = weight
    ? Math.round(weight * (goal === "Weight Loss" ? 13 : goal === "Muscle Gain" ? 17 : 15))
    : goalToCalories[goal] || 2000;

  const diet =
    preference === "Vegetarian" || preference === "Vegan"
      ? preference.toLowerCase()
      : ""; // Spoonacular accepts lowercase diet names

  try {
    const response = await axios.get(SPOONACULAR_API_URL, {
      params: {
        timeFrame: "day",
        targetCalories,
        diet,
        exclude: allergies.join(","),
        apiKey: SPOONACULAR_API_KEY,
      },
    });

    console.log("✅ Received data from Spoonacular");

    const { meals, nutrients } = response.data;

    const plan = {
      meals,
      nutrients,
    };

    res.json({ plan });
  } catch (error) {
    console.error("❌ Error fetching meal plan:", error.response?.data || error.message);
    res.status(500).json({
      error: "Error fetching meal plan. Please try again later.",
    });
  }
});

export default router;

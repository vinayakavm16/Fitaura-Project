// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Route imports
import authRoutes from "./routes/auth.js";
import predictRoutes from "./routes/predict.js";
import mealPlanRoutes from "./routes/mealplan.js";
import workoutPlanRoutes from "./routes/workoutplan.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Health check route
app.get("/", (_req, res) => {
  res.send("✅ API is running");
});

// Mount routers
app.use("/auth", authRoutes);
app.use("/predict", predictRoutes);
app.use("/mealplan", mealPlanRoutes);
app.use("/workoutplan", workoutPlanRoutes);

// Global error handler
app.use((err, _req, res, _next) => {
  console.error("⚠️ Unhandled Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

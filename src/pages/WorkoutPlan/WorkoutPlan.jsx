import React, { useState } from "react";
import axios from "axios";
import "./WorkoutPlan.css";

const WorkoutPlan = () => {
  const [input, setInput] = useState({
    goal: "",
    level: "",
    equipment: "",
    duration: 30,
    muscleGroup: "",
  });

  const [plan, setPlan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const equipmentMapping = {
    "Bodyweight": "body only",
    "Dumbbells": "dumbbell",
    "Gym Machine": "machine",
  };

  const muscleGroups = ["chest", "back", "biceps", "triceps", "shoulders"];

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setPlan([]);

    const equipmentName = equipmentMapping[input.equipment];

    if (!equipmentName) {
      setError("Invalid equipment selected.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/workoutplan", {
        goal: input.goal,
        fitnessLevel: input.level,
        equipment: equipmentName,
        sessionTime: input.duration,
        muscleGroup: input.muscleGroup,
      });

      setPlan(response.data.exercises || []);
    } catch (err) {
      console.error("Error message:", err.message);
      if (err.response) {
        console.error("Status code:", err.response.status);
        console.error("Response payload:", err.response.data);
      } else if (err.request) {
        console.error("No response received:", err.request);
      } else {
        console.error("Axios setup error:", err);
      }

      setError("Failed to generate workout plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Group exercises by muscle
  const groupedExercises = plan.reduce((acc, exercise) => {
    if (!acc[exercise.muscle]) {
      acc[exercise.muscle] = [];
    }
    acc[exercise.muscle].push(exercise);
    return acc;
  }, {});

  return (
    <div className="workout-container">
      <form className="workout-form" onSubmit={handleSubmit}>
        <h3>Workout Plan Generator</h3>

        <label>
          Goal:
          <select name="goal" value={input.goal} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="Fat Loss">Fat Loss</option>
            <option value="Muscle Gain">Muscle Gain</option>
            <option value="Endurance">Endurance</option>
          </select>
        </label>

        <label>
          Level:
          <select name="level" value={input.level} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </label>

        <label>
          Equipment:
          <select name="equipment" value={input.equipment} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="Bodyweight">Bodyweight</option>
            <option value="Dumbbells">Dumbbells</option>
            <option value="Gym Machine">Gym Machine</option>
          </select>
        </label>

        <label>
          Muscle Group:
          <select name="muscleGroup" value={input.muscleGroup} onChange={handleChange} required>
            <option value="">Select Muscle Group</option>
            {muscleGroups.map((muscle) => (
              <option key={muscle} value={muscle}>
                {muscle.charAt(0).toUpperCase() + muscle.slice(1)}
              </option>
            ))}
          </select>
        </label>

        <label>
          Duration (mins):
          <input
            type="number"
            name="duration"
            value={input.duration}
            onChange={handleChange}
            min="15"
            max="90"
            required
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate Plan"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {plan.length > 0 && (
        <div className="workout-output">
          <h4>Your Workout Plan</h4>
          <div className="workout-columns">
            {Object.entries(groupedExercises).map(([muscle, exercises]) => (
              exercises.length > 0 && (
                <div key={muscle}>
                  <h5>{muscle.charAt(0).toUpperCase() + muscle.slice(1)}</h5>
                  <ul>
                    {exercises.map((exercise, idx) => (
                      <li key={idx}>
                        <strong>{exercise.name}</strong>:{" "}
                        {exercise.instructions?.replace(/(<([^>]+)>)/gi, "")}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutPlan;

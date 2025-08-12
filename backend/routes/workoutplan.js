import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Map fitness levels to difficulty levels for API request
const fitnessToDifficulty = {
  Beginner: "beginner",
  Intermediate: "intermediate",
  Advanced: "expert",
};

// Predefined back exercises as a fallback
const fallbackBackExercises = [
  {
    name: "Bent-Over Barbell Row",
    type: "strength",
    muscle: "back",
    equipment: "barbell",
    difficulty: "intermediate",
    instructions:
      "Stand with feet shoulder-width apart, holding a barbell with an overhand grip. Bend at the hips and knees slightly, keeping your back straight. Pull the barbell towards your lower chest, squeezing your shoulder blades together. Lower the barbell back to the starting position.",
  },
  {
    name: "Lat Pulldown",
    type: "strength",
    muscle: "back",
    equipment: "machine",
    difficulty: "beginner",
    instructions:
      "Sit at a lat pulldown machine with your thighs secured under the pads. Grasp the bar with a wide overhand grip. Pull the bar down towards your upper chest, squeezing your shoulder blades together. Slowly return the bar to the starting position.",
  },
  {
    name: "Seated Cable Row",
    type: "strength",
    muscle: "back",
    equipment: "machine",
    difficulty: "beginner",
    instructions:
      "Sit at a cable row machine with your feet on the platform and knees slightly bent. Grasp the handle with both hands. Pull the handle towards your torso, keeping your back straight and squeezing your shoulder blades together. Slowly return to the starting position.",
  },
  {
    name: "Inverted Row",
    type: "strength",
    muscle: "back",
    equipment: "body only",
    difficulty: "beginner",
    instructions:
      "Set a bar at waist height and lie underneath it. Grasp the bar with an overhand grip, hands shoulder-width apart. Keep your body straight and pull your chest up to the bar. Lower yourself back down with control.",
  },
  {
    name: "Superman",
    type: "stretching",
    muscle: "back",
    equipment: "body only",
    difficulty: "beginner",
    instructions:
      "Lie face down on the floor with arms extended in front of you. Simultaneously lift your arms, chest, and legs off the ground. Hold for a few seconds, then lower back down.",
  },
  {
    name: "One-Arm Dumbbell Row",
    type: "strength",
    muscle: "back",
    equipment: "dumbbell",
    difficulty: "beginner",
    instructions:
      "Place your right knee and hand on a bench, holding a dumbbell in your left hand. Keep your back straight and pull the dumbbell towards your torso, squeezing your shoulder blade. Lower the dumbbell back down. Repeat on the other side.",
  },
  {
    name: "Deadlift",
    type: "strength",
    muscle: "back",
    equipment: "barbell",
    difficulty: "intermediate",
    instructions:
      "Stand with feet hip-width apart, barbell over mid-foot. Bend at the hips and knees to grip the barbell. Keep your back straight and lift the bar by extending your hips and knees. Lower the bar back to the ground with control.",
  },
  {
    name: "Resistance Band Pull-Apart",
    type: "strength",
    muscle: "back",
    equipment: "resistance band",
    difficulty: "beginner",
    instructions:
      "Hold a resistance band with both hands at shoulder height. Pull the band apart by moving your hands outward, squeezing your shoulder blades together. Return to the starting position with control.",
  },
];

router.post("/", async (req, res) => {
  const { goal, fitnessLevel, equipment, sessionTime, muscleGroup } = req.body;
  console.log("🔥 Received POST /workoutplan with body:", req.body);

  // Set difficulty based on fitness level
  const difficulty = fitnessToDifficulty[fitnessLevel] || "beginner";

  try {
    // Equipment mapping to match API format
    const equipmentMap = {
      "body only": "body only",
      dumbbell: "dumbbell",
      barbell: "barbell",
      kettlebell: "kettlebell",
      machine: "machine",
    };

    // Get the mapped equipment name
    const equipmentName = equipmentMap[equipment];
    if (!equipmentName) {
      console.error("❌ Invalid equipment type:", equipment);
      return res.status(400).json({ error: "Invalid equipment type" });
    }

    console.log(`🔧 Using equipment: ${equipmentName}`);

    // Initialize an array to store all exercises
    const allExercises = [];

    // Check if muscle group was provided, otherwise default to 'chest'
    const selectedMuscles = muscleGroup ? [muscleGroup] : ["chest"];

    // Loop over the selected muscles
    for (const muscle of selectedMuscles) {
      console.log(`📡 Fetching exercises for muscle group: ${muscle}`);

      try {
        const response = await axios.get(
          "https://api.api-ninjas.com/v1/exercises",
          {
            params: {
              muscle,
              difficulty,
              equipment: equipmentName,
            },
            headers: {
              "X-Api-Key": process.env.API_NINJAS_KEY,
            },
          }
        );

        // Ensure data is returned
        if (response.data && response.data.length > 0) {
          console.log(`✅ Exercises found for ${muscle}:`, response.data.length);
          allExercises.push(...response.data);
        } else {
          console.log(`❌ No exercises found for ${muscle}`);
          // Fallback: Push predefined exercises for back
          if (muscle.toLowerCase() === "back") {
            console.log("🔁 Using fallback back exercises");
            allExercises.push(...fallbackBackExercises);
          } else {
            allExercises.push({
              name: `No exercises found for ${muscle}`,
              type: "N/A",
              muscle: muscle,
              equipment: equipmentName,
              difficulty: difficulty,
              instructions:
                "No exercises available for this muscle group at the moment.",
            });
          }
        }
      } catch (apiError) {
        console.error(`❌ API error for muscle group ${muscle}:`, apiError.message);
        // Fallback: Push predefined exercises for back
        if (muscle.toLowerCase() === "back") {
          console.log("🔁 Using fallback back exercises due to API error");
          allExercises.push(...fallbackBackExercises);
        } else {
          allExercises.push({
            name: `No exercises found for ${muscle}`,
            type: "N/A",
            muscle: muscle,
            equipment: equipmentName,
            difficulty: difficulty,
            instructions:
              "No exercises available for this muscle group at the moment.",
          });
        }
      }
    }

    // Remove duplicate exercises based on the exercise name
    const uniqueExercises = Array.from(
      new Map(allExercises.map((ex) => [ex.name, ex])).values()
    );

    // Limit to top 10 exercises and format the output
    const top10 = uniqueExercises.slice(0, 10).map((ex) => ({
      name: ex.name,
      type: ex.type,
      muscle: ex.muscle,
      equipment: ex.equipment,
      difficulty: ex.difficulty,
      instructions: ex.instructions,
    }));

    console.log(`✅ Returning ${top10.length} exercises`);

    // Send the generated workout plan as a response
    res.json({
      goal,
      fitnessLevel,
      sessionTime,
      exercises: top10,
    });
  } catch (err) {
    console.error("❌ Workout Plan Error:", err.message);
    console.error("Error details:", err.response || err.request || err);
    res.status(500).json({ error: "Failed to generate workout plan" });
  }
});

export default router;

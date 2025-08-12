// routes/predict.js
import express from "express";
import { exec } from "child_process";
const router = express.Router();

router.post("/", (req, res) => {
  const input = req.body;

  const inputStr = JSON.stringify(input)
    .replace(/"/g, '\\"')  // Escape double quotes for safe shell usage
    .replace(/\n/g, "");   // Remove newlines (just in case)

    const command = `python ../ml_model/predict.py "${inputStr}"`;


  exec(command, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({
        error: "Prediction failed",
        details: error.message,
        raw: stdout || stderr,
      });
    }

    // Some models/scripts might print warnings. Let's extract the JSON from the last line.
    const lines = stdout.trim().split("\n");
    const lastLine = lines[lines.length - 1];

    try {
      const result = JSON.parse(lastLine);
      res.json(result);
    } catch (parseErr) {
      res.status(500).json({
        error: "JSON parse error",
        raw: stdout,
      });
    }
  });
});

export default router;

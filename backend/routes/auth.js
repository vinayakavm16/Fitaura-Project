import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js"; // For MongoDB
// import db from "../server.js"; // For MySQL

const router = express.Router();

// User Registration
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // MongoDB Method:
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    
    // MySQL Method (Uncomment if using MySQL)
    // const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    // db.query(sql, [name, email, hashedPassword], (err, result) => {
    //   if (err) return res.status(500).send(err);
    // });

    res.status(201).json({ message: "User Registered" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // MongoDB Method:
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // MySQL Method (Uncomment if using MySQL)
    // const sql = "SELECT * FROM users WHERE email = ?";
    // db.query(sql, [email], async (err, results) => {
    //   if (err) return res.status(500).send(err);
    //   const user = results[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, "secret", { expiresIn: "1h" });
    res.json({ token });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

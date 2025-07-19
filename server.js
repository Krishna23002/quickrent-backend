const bcrypt = require("bcrypt");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const PORT = 3000;

// MongoDB URI
const MONGODB_URI = "mongodb+srv://tryandglowshop:try&glow@quickrentcluster.jrzmgrl.mongodb.net/?retryWrites=true&w=majority&appName=QuickRentCluster"; // your working one

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Schemas
const propertySchema = new mongoose.Schema({
  title: String,
  type: String,
  location: String,
  price: Number,
  period: String,
  area: String,
  furnished: String,
  deposit: Number,
  description: String,
  amenities: [String],
  features: [String],
  ownerName: String,
  ownerPhone: String,
  image: String
});

const Property = mongoose.model("Property", propertySchema);

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String
});

const User = mongoose.model("User", userSchema);

// Signup Route
app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, phone });
    await newUser.save();

    res.status(201).json({ message: "Signup successful!" });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ error: "Server error during signup" });
  }
});

// Login Route
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt:", email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ No user found");
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);

    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const { name, phone } = user;
    res.status(200).json({ message: "Login successful", user: { name, email, phone } });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Server error during login" });
  }
});

// Property POST Route
app.post("/api/properties", async (req, res) => {
  try {
    console.log("Received Data:", req.body);
    const newProperty = new Property(req.body);
    await newProperty.save();
    res.status(201).json({ message: "Property saved successfully!" });
  } catch (error) {
    console.error("Error saving property:", error);
    res.status(500).json({ error: "Failed to save property." });
  }
});

// Get All Properties
app.get("/api/properties", async (req, res) => {
  try {
    const properties = await Property.find();
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch properties." });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
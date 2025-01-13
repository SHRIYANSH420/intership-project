const express = require("express");
const User = require("../models/user"); // Import the User model
const router = express.Router();

// Get All Users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving users." });
  }
});

// Get a Single User by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving user." });
  }
});

// Create a New User
router.post("/", async (req, res) => {
  const { id, name, age, hobbies } = req.body;

  if (!id || !name || !age || !hobbies) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const newUser = new User({ id, name, age, hobbies });
    await newUser.save();
    res.status(201).json({ message: "User created successfully." });
  } catch (err) {
    res.status(400).json({ message: "Error creating user.", error: err.message });
  }
});

// Update an Existing User
router.put("/:id", async (req, res) => {
  const { name, age, hobbies } = req.body;

  if (!name || !age || !hobbies) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const updatedUser = await User.findOneAndUpdate(
      { id: req.params.id },
      { name, age, hobbies },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({ message: "User updated successfully.", user: updatedUser });
  } catch (err) {
    res.status(400).json({ message: "Error updating user.", error: err.message });
  }
});

// Delete a User
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await User.findOneAndDelete({ id: req.params.id });

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({ message: "User deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user." });
  }
});

module.exports = router;

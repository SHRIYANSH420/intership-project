const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: { 
    type: String, 
    required: true, 
    unique: true 
  }, // Custom ID
  name: { 
    type: String, 
    required: [true, "Name is required"], // Custom error message
    trim: true // Removes unnecessary whitespace
  },
  age: { 
    type: Number, 
    required: [true, "Age is required"], 
    min: [0, "Age cannot be negative"] 
  },
  hobbies: { 
    type: [String], 
    required: [true, "At least one hobby is required"], 
    validate: {
      validator: (value) => Array.isArray(value) && value.length > 0,
      message: "Hobbies must be a non-empty array"
    }
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;

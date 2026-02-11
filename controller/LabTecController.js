import User from "../models/User.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

/**
 * Create a new Lab Tech
 */
export const createLabTech = async (req, res) => {
  const { name, email, password, branchname, branchcode, contact } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newLabTech = new User({
      name,
      email,
      password: hashedPassword,
      branchname,
      branchcode,
      contact,
      role: "lab_tech",
    });

    await newLabTech.save();

    res.status(201).json({ message: "Lab Tech created successfully!" });
  } catch (error) {
    console.error("Create Lab Tech Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get all Lab Techs
 */
export const getLabTechs = async (req, res) => {
  try {
    const labTechs = await User.find({ role: "lab_tech" }).select("-password");
    res.status(200).json(labTechs);
  } catch (error) {
    console.error("Get Lab Techs Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Delete a Lab Tech by ID
 */
export const deleteLabTech = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Lab Tech ID" });
    }

    const labTech = await User.findByIdAndDelete(id);

    if (!labTech) {
      return res.status(404).json({ message: "Lab Tech not found" });
    }

    res.status(200).json({ message: "Lab Tech deleted successfully" });
  } catch (error) {
    console.error("Delete Lab Tech Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

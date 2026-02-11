import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    branchname: { type: String, required: true },
    branchcode: { type: Number, required: true },
    contact: { type: String, required: true },
    role: { type: String, enum: ["admin", "lab_tech"] },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);

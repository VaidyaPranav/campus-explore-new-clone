import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true, required: true },
  password: { type: String }, // hashed password (optional)
  // other fields...
}, { timestamps: true });

export default mongoose.model("User", userSchema);

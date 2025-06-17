import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    color: { type: String, default: "#ffffff" },
    createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model("User", userSchema);
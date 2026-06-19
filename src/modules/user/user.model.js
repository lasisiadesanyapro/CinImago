import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      min: 1,
      max: 250,
    },
    lastName: {
      type: String,
      required: true,
      min: 1,
      max: 250,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 8,
      max: 200,
      select: false,
    },
    passwordVersion: {
      type: Number,
      required: true,
      default: 0,
      select: false,
    },
    jwtVersion: {
      type: Number,
      required: true,
      default: 0,
      select: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
    },
    role: {
      type: String,
      default: "user",
    },
    resetToken: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    resetTokenExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);
export default User;

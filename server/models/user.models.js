import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // NEW FIELDS
    age: { type: Number, default: null },
    gender: { type: String, enum: ["male", "female", "other"], default: null },
    phone: { type: String, default: null },
    city: { type: String, default: null },
    height: { type: Number, default: null }, // cm
    weight: { type: Number, default: null }, // kg
    sportsInterest: { type: String, default: null },
    fitnessGoal: { type: String, default: null },

    isProfileComplete: { type: Boolean, default: false },

    refreshToken: { type: String },
  },
  { timestamps: true }
);

// Password hashing
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return 
  this.password = await bcrypt.hash(this.password, 10);
 
});

// Compare password
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generate tokens
userSchema.methods.generateAccessToken = function () {
  return jwt.sign({ _id: this._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};

export const User = mongoose.model("User", userSchema);

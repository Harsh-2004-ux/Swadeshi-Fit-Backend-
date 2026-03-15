import { asyncHandler } from "../utils/Asynchandler.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// Generate access token
const generateAccessAndRefereshTokens = async (userId) => {
  try {
    console.log("🔹 Generating tokens for userId:", userId);

    const user = await User.findById(userId);
    console.log("🔹 User found in DB:", user);

    if (!user) {
      throw new Error("User not found while generating tokens");
    }

    const accessToken = user.generateAccessToken();
    console.log("🔹 Access token generated:", accessToken);

    const refreshToken = user.generateRefreshToken();
    console.log("🔹 Refresh token generated:", refreshToken);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    console.log("🔹 Refresh token saved to DB");

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("❌ Token generation error:", error);
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};


// Generate refresh token
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken || req.query.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Please login first");
  }
  try {
    const decoded = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decoded._id);
    if (!user) {
      throw new ApiError(401, "User not found");
    }
    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Invalid refresh token");
    }
    const option = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
      user._id
    );
    return res
      .status(200)
      .cookie("accessToken", accessToken, option)
      .cookie("refreshToken", refreshToken, option)
      .json(
        new ApiResponse(
          200,
          {
            user: { _id: user._id, name: user.name, email: user.email },
            accessToken,
            refreshToken,
          },
          "Access token refreshed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, error.message);
  }

});

// Register a new user
const RegisterUser = asyncHandler(async (req, res, next) => {
  console.log("🔹 Signup request body:", req.body);

  const { name, email, password } = req.body;

  if (
    [name, email, password].some(
      (field) => typeof field !== "string" || field.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({ email: email.trim().toLowerCase() });
  console.log("🔹 Check if user already exists:", existedUser);

  if (existedUser) {
    throw new ApiError(400, "User already exists with this email");
  }

  const user = await User.create({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password: password.trim(),
  });
  console.log("🔹 User created:", user);

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  console.log("🔹 Created user data:", createdUser);

  if (!createdUser) {
    throw new ApiError(500, "User not created");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, "User created successfully", createdUser));
});


// login user
const loginUser = asyncHandler(async (req, res, next) => {
  console.log("🔹 Login request body:", req.body);

  const { email, password } = req.body;

  if (
    [email, password].some(
      (field) => typeof field !== "string" || field.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() });
  console.log("🔹 User found in DB:", user);

  if (!user) {
    throw new ApiError(400, "User does not exist with this email");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);
  console.log("🔹 Password correct?", isPasswordCorrect);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Incorrect password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );

  const userData = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  console.log("🔹 User data for response:", userData);
  console.log("🔹 Tokens to send:", { accessToken, refreshToken });

  const option = {
    httpOnly: true,
    secure: false,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json(
      new ApiResponse(
        200,
        { user: userData, accessToken, refreshToken },
        "User logged In Successfully"
      )
    );
});


// logout user

const logoutUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: { refreshToken: 1 },
    },
    {
      new: true,
    }
  );
  const option = {
    httpOnly: true,
    secure: false,
  };
  return res
    .status(200)
    .clearCookie("accessToken", option)
    .clearCookie("refreshToken", option)
    .json(new ApiResponse(200, {}, "User logged Out"));
});
// UPDATE PROFILE
const updateProfile = asyncHandler(async (req, res) => {
    const {
        age,
        gender,
        phone,
        city,
        height,
        weight,
        sportsInterest,
        fitnessGoal
    } = req.body;

    const userId = req.user._id;

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
            age,
            gender,
            phone,
            city,
            height,
            weight,
            sportsInterest,
            fitnessGoal,
            isProfileComplete: true
        },
        { new: true }
    ).select("-password -refreshToken");

    return res.status(200).json(
        new ApiResponse(200, updatedUser, "Profile updated successfully")
    );
});
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select(
    "-password -refreshToken"
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User profile fetched successfully"));
});
export {
  RegisterUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  updateProfile,
  getUserProfile
};

import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import fs from "fs";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isStudentEmail = (email) => {
  const domain = email.split("@")[1];
  return domain?.toLowerCase().endsWith("edu.np");
};

const registerUser = asyncHandler(async (req, res) => {
  let { fullName, email, password, confirmPassword, role } = req.body;

  // 1. Presence check
  if (
    [fullName, email, password, confirmPassword, role].some((f) => !f?.trim())
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // 2. Normalize values early
  role = role.toLowerCase();
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedFullName = fullName.trim();

  // 3. Role validation
  if (!["student", "client"].includes(role)) {
    throw new ApiError(400, "Invalid role");
  }

  // 4. Email format validation
  if (!EMAIL_REGEX.test(normalizedEmail)) {
    throw new ApiError(400, "Invalid email format");
  }

  // 5. Student email restriction
  if (role === "student" && !isStudentEmail(normalizedEmail)) {
    throw new ApiError(400, "Students must use .edu.np email");
  }

  // 6. Password checks
  if (password !== confirmPassword) {
    throw new ApiError(400, "Passwords do not match");
  }

  if (password.length < 8) {
    throw new ApiError(400, "Password must be at least 6 characters");
  }

  // 7. Duplicate user check
  const existedUser = await User.findOne({ email: normalizedEmail });
  if (existedUser) {
    throw new ApiError(409, "Email already exists");
  }

  // 9. Create user
  const user = await User.create({
    fullName: normalizedFullName,
    email: normalizedEmail,
    password,
    role,
  });

  // 10. Fetch safe user (no sensitive data)
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "User creation failed");
  }

  // 11. Response
  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

export { registerUser };

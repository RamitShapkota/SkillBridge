import { StudentProfile } from "../models/studentProfile.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getStudentProfile = asyncHandler(async (req, res) => {
  const profile = await StudentProfile.findOne({ user: req.user._id });

  if (!profile) {
    throw new ApiError(404, "Student profile not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, profile, "Student profile fetched successfully"));
});

const updateStudentProfile = asyncHandler(async (req, res) => {
  const { bio, education, university, skills, github, linkedin, portfolio } =
    req.body || {};

  const updateData = {};

  if (bio !== undefined) updateData.bio = bio;
  if (education !== undefined) updateData.education = education;
  if (university !== undefined) updateData.university = university;
  if (skills !== undefined) updateData.skills = skills;
  if (github !== undefined) updateData.github = github;
  if (linkedin !== undefined) updateData.linkedin = linkedin;
  if (portfolio !== undefined) updateData.portfolio = portfolio;

  if (Object.keys(updateData).length === 0) {
    throw new ApiError(400, "No profile fields provided");
  }

  const profile = await StudentProfile.findOneAndUpdate(
    { user: req.user._id },
    {
      $set: updateData,
      $setOnInsert: { user: req.user._id },
    },
    {
      returnDocument: "after",
      upsert: true,
      runValidators: true,
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, profile, "Profile updated successfully."));
});

export { getStudentProfile, updateStudentProfile };

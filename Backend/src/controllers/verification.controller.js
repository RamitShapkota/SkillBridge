import { Verification } from "../models/verification.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const submitStudentVerification = asyncHandler(async (req, res) => {
  const { university, studentId } = req.body || {};

  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }

  if (req.user.role !== "student") {
    throw new ApiError(403, "Only students can submit student verification");
  }

  if (!university?.trim() || !studentId?.trim()) {
    throw new ApiError(400, "College name and student ID are required");
  }

  const collegeIdCardLocalPath = req.files?.idCard?.[0]?.path;
  const studentSelfieLocalPath = req.files?.selfie?.[0]?.path;

  if (!collegeIdCardLocalPath || !studentSelfieLocalPath) {
    throw new ApiError(400, "College ID card and student selfie are required");
  }

  const existingVerification = await Verification.findOne({
    user: req.user._id,
  });

  if (existingVerification?.status === "pending") {
    throw new ApiError(409, "Verification request is already pending");
  }

  if (existingVerification?.status === "approved") {
    throw new ApiError(409, "Student verification is already approved");
  }

  if (existingVerification?.status === "rejected") {
    throw new ApiError(
      409,
      "Rejected verification must be updated instead of submitted again"
    );
  }

  const collegeIdCard = await uploadOnCloudinary(collegeIdCardLocalPath);

  if (!collegeIdCard?.url) {
    throw new ApiError(500, "College ID card upload failed");
  }

  const studentSelfie = await uploadOnCloudinary(studentSelfieLocalPath);

  if (!studentSelfie?.url) {
    throw new ApiError(500, "Student selfie upload failed");
  }

  const verification = await Verification.create({
    user: req.user._id,
    type: "student",
    status: "pending",
    collegeName: university.trim(),
    studentId: studentId.trim(),
    collegeIdCard: collegeIdCard.url,
    studentSelfie: studentSelfie.url,
    submittedAt: new Date(),
    verifiedBy: null,
    verifiedAt: null,
    rejectionReason: "",
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        verification,
        "Student verification submitted successfully"
      )
    );
});

const submitClientVerification = asyncHandler(async (req, res) => {
});

const getVerificationStatus = asyncHandler(async (req, res) => {
});

const updateVerification = asyncHandler(async (req, res) => {
});

export {
  submitStudentVerification,
  submitClientVerification,
  getVerificationStatus,
  updateVerification,
};

import { Job } from "../models/job.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createJob = asyncHandler(async (req, res) => {
  const {
    title,
    category,
    description,
    requirements,
    skills,
    budget,
    duration,
    deadline,
    complexity,
    files,
  } = req.body || {};

  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }

  if (req.user.role !== "client") {
    throw new ApiError(403, "Only clients can create jobs");
  }

  if (!title?.trim()) {
    throw new ApiError(400, "Job title is required");
  }

  if (!category?.trim()) {
    throw new ApiError(400, "Category is required");
  }

  if (!description?.trim() || description.trim().length < 20) {
    throw new ApiError(400, "Description must be at least 20 characters");
  }

  if (!requirements?.trim()) {
    throw new ApiError(400, "Client requirements are required");
  }

  if (budget === undefined || budget === null || String(budget).trim() === "") {
    throw new ApiError(400, "Budget is required");
  }

  const numericBudget = Number(budget);

  if (Number.isNaN(numericBudget) || numericBudget < 0) {
    throw new ApiError(400, "Budget must be a valid amount");
  }

  if (!duration?.trim()) {
    throw new ApiError(400, "Duration is required");
  }

  if (!deadline) {
    throw new ApiError(400, "Deadline is required");
  }

  const deadlineDate = new Date(deadline);

  if (Number.isNaN(deadlineDate.getTime())) {
    throw new ApiError(400, "Deadline must be a valid date");
  }

  if (!complexity?.trim()) {
    throw new ApiError(400, "Complexity is required");
  }

  if (!["small", "medium"].includes(complexity)) {
    throw new ApiError(400, "Complexity must be small or medium");
  }

  if (skills !== undefined && !Array.isArray(skills)) {
    throw new ApiError(400, "Skills must be an array");
  }

  if (files !== undefined && !Array.isArray(files)) {
    throw new ApiError(400, "Files must be an array");
  }

  const attachments = Array.isArray(files)
    ? files
        .map((file) => {
          if (typeof file === "string") return file.trim();
          return file?.name?.trim() || "";
        })
        .filter(Boolean)
    : [];

  const job = await Job.create({
    client: req.user._id,
    title: title.trim(),
    category: category.trim(),
    description: description.trim(),
    requirements: requirements.trim(),
    skills: Array.isArray(skills) ? skills : [],
    budget: numericBudget,
    duration: duration.trim(),
    deadline: deadlineDate,
    complexity,
    attachments,
    status: "open",
  });

  return res
    .status(201)
    .json(new ApiResponse(201, job, "Job created successfully"));
});

const getClientJobs = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }

  if (req.user.role !== "client") {
    throw new ApiError(403, "Only clients can view their jobs");
  }

  const jobs = await Job.find({
    client: req.user._id,
  }).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, jobs, "Client jobs fetched successfully"));
});

const getAllOpenJobs = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }

  if (req.user.role !== "student") {
    throw new ApiError(403, "Only students can browse open jobs");
  }

  const jobs = await Job.find({
    status: "open",
  })
    .populate("client", "fullName avatar")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, jobs, "Open jobs fetched successfully"));
});

const getJobById = asyncHandler(async (req, res) => {
});

const updateJob = asyncHandler(async (req, res) => {
});

const cancelJob = asyncHandler(async (req, res) => {
});

export {
  createJob,
  getClientJobs,
  getAllOpenJobs,
  getJobById,
  updateJob,
  cancelJob,
};

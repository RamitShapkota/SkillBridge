import { Job } from "../models/job.model.js";
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const cancelJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  if (!mongoose.isValidObjectId(jobId)) {
    throw new ApiError(400, "Invalid job id");
  }

  const job = await Job.findById(jobId);

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  if (job.client.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only cancel your own jobs");
  }

  job.status = "cancelled";
  await job.save();

  return res
    .status(200)
    .json(new ApiResponse(200, job, "Job cancelled successfully"));
});

export { cancelJob };

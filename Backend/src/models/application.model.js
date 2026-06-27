import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    coverMessage: {
      type: String,
      required: true,
      trim: true,
    },

    estimatedCompletionTime: {
      type: String,
      required: true,
      trim: true,
    },

    whySuitable: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },

    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// One student can apply only once to the same job
applicationSchema.index(
  { job: 1, student: 1 },
  { unique: true }
);

export const Application = mongoose.model(
  "Application",
  applicationSchema
);
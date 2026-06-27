import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    requirements: {
      type: String,
      required: true,
      trim: true,
    },

    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    budget: {
      type: Number,
      required: true,
      min: 0,
    },

    duration: {
      type: String,
      required: true,
      trim: true,
    },

    deadline: {
      type: Date,
      required: true,
    },

    complexity: {
      type: String,
      enum: ["beginner", "intermediate"],
      required: true,
    },

    attachments: [
      {
        type: String,
        trim: true,
      },
    ],

    status: {
      type: String,
      enum: ["open", "closed", "cancelled"],
      default: "open",
    },
  },
  {
    timestamps: true,
  }
);

export const Job = mongoose.model("Job", jobSchema);

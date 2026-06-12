import mongoose from "mongoose";

const studentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    profilePhoto: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      trim: true,
      default: "",
    },

    education: {
      type: String,
      trim: true,
      default: "",
    },

    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    portfolioLink: {
      type: String,
      trim: true,
      default: "",
    },

    githubLink: {
      type: String,
      trim: true,
      default: "",
    },

    linkedinLink: {
      type: String,
      trim: true,
      default: "",
    },

    availability: {
      type: String,
      enum: [
        "available",
        "busy",
        "not_available",
      ],
      default: "available",
    },

    verificationStatus: {
      type: String,
      enum: [
        "pending",
        "verified",
        "rejected",
      ],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export const StudentProfile = mongoose.model(
  "StudentProfile",
  studentProfileSchema
);
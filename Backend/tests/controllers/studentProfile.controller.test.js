import { describe, expect, it, jest, beforeEach } from "@jest/globals";
import { runController } from "../setup/testHelpers.js";

const StudentProfile = {
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn(),
};

jest.unstable_mockModule("../../src/models/studentProfile.model.js", () => ({
  StudentProfile,
}));

const { getStudentProfile, updateStudentProfile } = await import(
  "../../src/controllers/studentProfile.controller.js"
);

describe("Student Profile Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("gets the logged-in student's profile", async () => {
    const profile = { _id: "profile-1", user: "user-1", bio: "Student bio" };
    StudentProfile.findOne.mockResolvedValue(profile);

    const { res, next } = await runController(getStudentProfile, {
      user: { _id: "user-1" },
    });

    expect(StudentProfile.findOne).toHaveBeenCalledWith({ user: "user-1" });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 200,
        data: profile,
        message: "Student profile fetched successfully",
        success: true,
      })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("returns resource not found when the student profile does not exist", async () => {
    StudentProfile.findOne.mockResolvedValue(null);

    const { next } = await runController(getStudentProfile, {
      user: { _id: "user-1" },
    });

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 404,
        message: "Student profile not found",
      })
    );
  });

  it("updates student profile fields", async () => {
    const updatedProfile = {
      _id: "profile-1",
      user: "user-1",
      bio: "Updated bio",
      skills: ["JavaScript"],
    };
    StudentProfile.findOneAndUpdate.mockResolvedValue(updatedProfile);

    const { res, next } = await runController(updateStudentProfile, {
      user: { _id: "user-1" },
      body: {
        bio: "Updated bio",
        skills: ["JavaScript"],
      },
    });

    expect(StudentProfile.findOneAndUpdate).toHaveBeenCalledWith(
      { user: "user-1" },
      {
        $set: { bio: "Updated bio", skills: ["JavaScript"] },
        $setOnInsert: { user: "user-1" },
      },
      {
        returnDocument: "after",
        upsert: true,
        runValidators: true,
      }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 200,
        data: updatedProfile,
        message: "Profile updated successfully.",
      })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("returns validation error when no student profile fields are provided", async () => {
    const { next } = await runController(updateStudentProfile, {
      user: { _id: "user-1" },
      body: {},
    });

    expect(StudentProfile.findOneAndUpdate).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: "No profile fields provided",
      })
    );
  });

  it("passes unexpected student profile database errors to next", async () => {
    StudentProfile.findOne.mockRejectedValue(new Error("Database failed"));

    const { next } = await runController(getStudentProfile, {
      user: { _id: "user-1" },
    });

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: "Database failed" }));
  });
});

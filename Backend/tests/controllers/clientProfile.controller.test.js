import { describe, expect, it, jest, beforeEach } from "@jest/globals";
import { runController } from "../setup/testHelpers.js";

const ClientProfile = {
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn(),
};

jest.unstable_mockModule("../../src/models/clientProfile.model.js", () => ({
  ClientProfile,
}));

const { getClientProfile, updateClientProfile } = await import(
  "../../src/controllers/clientProfile.controller.js"
);

describe("Client Profile Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("gets the logged-in client's profile", async () => {
    const profile = { _id: "profile-1", user: "user-1", companyName: "ABC Ltd" };
    ClientProfile.findOne.mockResolvedValue(profile);

    const { res, next } = await runController(getClientProfile, {
      user: { _id: "user-1" },
    });

    expect(ClientProfile.findOne).toHaveBeenCalledWith({ user: "user-1" });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 200,
        data: profile,
        message: "Client profile fetched successfully",
      })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("returns resource not found when the client profile does not exist", async () => {
    ClientProfile.findOne.mockResolvedValue(null);

    const { next } = await runController(getClientProfile, {
      user: { _id: "user-1" },
    });

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 404,
        message: "Client profile not found",
      })
    );
  });

  it("updates client profile fields", async () => {
    const updatedProfile = {
      _id: "profile-1",
      user: "user-1",
      companyName: "ABC Ltd",
      website: "https://example.com",
    };
    ClientProfile.findOneAndUpdate.mockResolvedValue(updatedProfile);

    const { res, next } = await runController(updateClientProfile, {
      user: { _id: "user-1" },
      body: {
        companyName: "ABC Ltd",
        website: "https://example.com",
      },
    });

    expect(ClientProfile.findOneAndUpdate).toHaveBeenCalledWith(
      { user: "user-1" },
      {
        $set: { companyName: "ABC Ltd", website: "https://example.com" },
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

  it("returns validation error when no client profile fields are provided", async () => {
    const { next } = await runController(updateClientProfile, {
      user: { _id: "user-1" },
      body: {},
    });

    expect(ClientProfile.findOneAndUpdate).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: "No profile fields provided",
      })
    );
  });

  it("passes unexpected client profile database errors to next", async () => {
    ClientProfile.findOne.mockRejectedValue(new Error("Database failed"));

    const { next } = await runController(getClientProfile, {
      user: { _id: "user-1" },
    });

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: "Database failed" }));
  });
});

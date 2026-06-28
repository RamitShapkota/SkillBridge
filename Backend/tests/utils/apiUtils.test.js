import { describe, expect, it, jest } from "@jest/globals";
import { ApiError } from "../../src/utils/ApiError.js";
import { ApiResponse } from "../../src/utils/ApiResponse.js";
import { asyncHandler } from "../../src/utils/asyncHandler.js";

describe("ApiError", () => {
  it("stores status code, message and error details", () => {
    const error = new ApiError(400, "Invalid input", ["email is required"]);

    expect(error).toBeInstanceOf(Error);
    expect(error.statusCode).toBe(400);
    expect(error.message).toBe("Invalid input");
    expect(error.success).toBe(false);
    expect(error.errors).toEqual(["email is required"]);
    expect(error.isOperational).toBe(true);
  });
});

describe("ApiResponse", () => {
  it("creates a success response for a valid status code", () => {
    const response = new ApiResponse(200, { id: "user-1" }, "Done");

    expect(response).toEqual({
      statusCode: 200,
      data: { id: "user-1" },
      message: "Done",
      success: true,
    });
  });

  it("marks response as unsuccessful for error status codes", () => {
    const response = new ApiResponse(404, null, "Not found");

    expect(response.success).toBe(false);
  });
});

describe("asyncHandler", () => {
  it("calls the wrapped controller", async () => {
    const req = {};
    const res = {};
    const next = jest.fn();
    const controller = jest.fn().mockResolvedValue("done");

    asyncHandler(controller)(req, res, next);
    await new Promise((resolve) => setImmediate(resolve));

    expect(controller).toHaveBeenCalledWith(req, res, next);
    expect(next).not.toHaveBeenCalled();
  });

  it("passes unexpected errors to next", async () => {
    const next = jest.fn();
    const error = new Error("Database failed");

    asyncHandler(async () => {
      throw error;
    })({}, {}, next);
    await new Promise((resolve) => setImmediate(resolve));

    expect(next).toHaveBeenCalledWith(error);
  });
});

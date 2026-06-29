import { beforeEach, describe, expect, test, jest } from "@jest/globals";
import { createMockResponse } from "../setup/testHelpers.js";

const jwtVerify = jest.fn();
const User = {
  findById: jest.fn(),
};

jest.unstable_mockModule("jsonwebtoken", () => ({
  default: {
    verify: jwtVerify,
  },
}));

jest.unstable_mockModule("../../src/models/user.model.js", () => ({
  User,
}));

const { verifyJWT } = await import("../../src/middlewares/auth.middleware.js");

const runMiddleware = async (req) => {
  const res = createMockResponse();
  const next = jest.fn();

  verifyJWT(req, res, next);
  await new Promise((resolve) => setImmediate(resolve));

  return { next };
};

describe("verifyJWT Middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("allows a request with a valid JWT", async () => {
    const user = {
      _id: "user-1",
      email: "student@example.com",
      role: "student",
    };
    jwtVerify.mockReturnValue({ _id: "user-1" });
    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(user),
    });

    const req = {
      cookies: {},
      header: jest.fn().mockReturnValue("Bearer valid-token"),
    };

    const { next } = await runMiddleware(req);

    expect(jwtVerify).toHaveBeenCalledWith("valid-token", "test-access-secret");
    expect(User.findById).toHaveBeenCalledWith("user-1");
    expect(req.user).toEqual(user);
    expect(next).toHaveBeenCalledWith();
  });

  test("returns unauthorized when the token is missing", async () => {
    const req = {
      cookies: {},
      header: jest.fn(),
    };

    const { next } = await runMiddleware(req);

    expect(jwtVerify).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 401,
        message: "Invalid token format",
      })
    );
  });

  test("returns unauthorized when the token is invalid", async () => {
    jwtVerify.mockImplementation(() => {
      throw new Error("jwt malformed");
    });

    const req = {
      cookies: {},
      header: jest.fn().mockReturnValue("Bearer invalid-token"),
    };

    const { next } = await runMiddleware(req);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 401,
        message: "jwt malformed",
      })
    );
  });
});

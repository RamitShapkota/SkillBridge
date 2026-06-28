import { beforeEach, describe, expect, it, jest } from "@jest/globals";
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

  return { res, next };
};

describe("verifyJWT Middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("authorizes a request with a valid bearer token", async () => {
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

  it("authorizes a request with an access token cookie", async () => {
    const user = {
      _id: "user-1",
      role: "client",
    };
    jwtVerify.mockReturnValue({ _id: "user-1" });
    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(user),
    });

    const req = {
      cookies: { accessToken: "cookie-token" },
      header: jest.fn(),
    };
    const { next } = await runMiddleware(req);

    expect(jwtVerify).toHaveBeenCalledWith("cookie-token", "test-access-secret");
    expect(req.user).toEqual(user);
    expect(next).toHaveBeenCalledWith();
  });

  it("returns unauthorized when token is missing", async () => {
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

  it("returns unauthorized when jwt verification fails", async () => {
    jwtVerify.mockImplementation(() => {
      throw new Error("jwt expired");
    });

    const req = {
      cookies: {},
      header: jest.fn().mockReturnValue("Bearer expired-token"),
    };
    const { next } = await runMiddleware(req);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 401,
        message: "jwt expired",
      })
    );
  });

  it("returns unauthorized when decoded user is not found", async () => {
    jwtVerify.mockReturnValue({ _id: "missing-user" });
    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });

    const req = {
      cookies: {},
      header: jest.fn().mockReturnValue("Bearer valid-token"),
    };
    const { next } = await runMiddleware(req);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 401,
        message: "Invalid Access Token",
      })
    );
  });
});

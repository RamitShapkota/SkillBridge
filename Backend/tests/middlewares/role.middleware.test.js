import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { createMockResponse } from "../setup/testHelpers.js";
import { authorizeRoles } from "../../src/middlewares/role.middleware.js";

const runMiddleware = async (middleware, req) => {
  const res = createMockResponse();
  const next = jest.fn();

  middleware(req, res, next);
  await new Promise((resolve) => setImmediate(resolve));

  return { next };
};

describe("authorizeRoles Middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("allows users with an accepted role", async () => {
    const middleware = authorizeRoles("student", "client");

    const { next } = await runMiddleware(middleware, {
      user: { role: "student" },
    });

    expect(next).toHaveBeenCalledWith();
  });

  it("returns unauthorized when there is no authenticated user", async () => {
    const middleware = authorizeRoles("student");

    const { next } = await runMiddleware(middleware, {});

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 401,
        message: "User not authenticated",
      })
    );
  });

  it("returns forbidden when user role is not allowed", async () => {
    const middleware = authorizeRoles("admin");

    const { next } = await runMiddleware(middleware, {
      user: { role: "student" },
    });

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 403,
        message: "Access denied. student is not allowed to access this route",
      })
    );
  });
});

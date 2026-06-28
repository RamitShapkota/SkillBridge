import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { runController } from "../setup/testHelpers.js";

const User = {
  findOne: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  create: jest.fn(),
};

const PendingRegistration = {
  findOne: jest.fn(),
  deleteOne: jest.fn(),
};

const uploadOnCloudinary = jest.fn();
const mailVerify = jest.fn();
const sendMail = jest.fn();
const createTransport = jest.fn(() => ({
  verify: mailVerify,
  sendMail,
}));

jest.unstable_mockModule("../../src/models/user.model.js", () => ({
  User,
  PendingRegistration,
}));

jest.unstable_mockModule("../../src/utils/cloudinary.js", () => ({
  uploadOnCloudinary,
}));

jest.unstable_mockModule("nodemailer", () => ({
  default: {
    createTransport,
  },
}));

const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  changeCurrentPassword,
  updateAccountDetails,
  updateUserAvatar,
} = await import("../../src/controllers/user.controller.js");

const mockSelectQuery = (data) => ({
  select: jest.fn().mockResolvedValue(data),
});

describe("Authentication Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("keeps register blocked until email verification is completed", async () => {
    const { next } = await runController(registerUser, {
      body: {
        fullName: "Test Student",
        email: "student@college.edu.np",
        password: "password123",
        role: "student",
      },
    });

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: "Please verify your email before registration.",
      })
    );
  });

  it("logs in a valid common user and returns tokens", async () => {
    const foundUser = {
      _id: "user-1",
      role: "student",
      isPasswordCorrect: jest.fn().mockResolvedValue(true),
    };
    const tokenUser = {
      _id: "user-1",
      generateAccessToken: jest.fn().mockResolvedValue("access-token"),
      generateRefreshToken: jest.fn().mockResolvedValue("refresh-token"),
      save: jest.fn().mockResolvedValue(),
    };
    const safeUser = {
      _id: "user-1",
      email: "student@example.com",
      role: "student",
    };

    User.findOne.mockResolvedValue(foundUser);
    User.findById
      .mockResolvedValueOnce(tokenUser)
      .mockReturnValueOnce(mockSelectQuery(safeUser));

    const { res, next } = await runController(loginUser, {
      body: {
        email: " STUDENT@EXAMPLE.COM ",
        password: "password123",
      },
    });

    expect(User.findOne).toHaveBeenCalledWith({ email: "student@example.com" });
    expect(foundUser.isPasswordCorrect).toHaveBeenCalledWith("password123");
    expect(tokenUser.save).toHaveBeenCalledWith({ validateBeforeSave: false });
    expect(res.cookie).toHaveBeenCalledWith(
      "accessToken",
      "access-token",
      expect.objectContaining({ httpOnly: true })
    );
    expect(res.cookie).toHaveBeenCalledWith(
      "refreshToken",
      "refresh-token",
      expect.objectContaining({ httpOnly: true })
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 200,
        message: "Login successful",
        data: {
          user: safeUser,
          accessToken: "access-token",
          refreshToken: "refresh-token",
        },
      })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("returns validation error when login fields are missing", async () => {
    const { next } = await runController(loginUser, {
      body: { email: "student@example.com" },
    });

    expect(User.findOne).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: "Email and password are required",
      })
    );
  });

  it("returns unauthorized when login password is invalid", async () => {
    User.findOne.mockResolvedValue({
      _id: "user-1",
      role: "student",
      isPasswordCorrect: jest.fn().mockResolvedValue(false),
    });

    const { next } = await runController(loginUser, {
      body: {
        email: "student@example.com",
        password: "wrong-password",
      },
    });

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 401,
        message: "Invalid email or password",
      })
    );
  });

  it("returns forbidden when an admin uses the common login", async () => {
    User.findOne.mockResolvedValue({
      _id: "admin-1",
      role: "admin",
    });

    const { next } = await runController(loginUser, {
      body: {
        email: "admin@example.com",
        password: "password123",
      },
    });

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 403,
        message: "Please use the Admin Login page.",
      })
    );
  });

  it("passes unexpected login errors to next", async () => {
    User.findOne.mockRejectedValue(new Error("Database failed"));

    const { next } = await runController(loginUser, {
      body: {
        email: "student@example.com",
        password: "password123",
      },
    });

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: "Database failed" }));
  });

  it("sends forgot password email for an existing user", async () => {
    const user = {
      email: "student@example.com",
      generatePasswordResetToken: jest.fn().mockReturnValue("plain-reset-token"),
      save: jest.fn().mockResolvedValue(),
    };
    User.findOne.mockResolvedValue(user);
    mailVerify.mockResolvedValue();
    sendMail.mockResolvedValue();

    const { res, next } = await runController(forgotPassword, {
      body: { email: " STUDENT@EXAMPLE.COM " },
    });

    expect(User.findOne).toHaveBeenCalledWith({ email: "student@example.com" });
    expect(user.generatePasswordResetToken).toHaveBeenCalled();
    expect(user.save).toHaveBeenCalledWith({ validateBeforeSave: false });
    expect(sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "student@example.com",
        subject: "Reset your SkillBridge password",
      })
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 200,
        message: "Password reset link sent to your email.",
      })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("returns validation error when forgot password email is missing", async () => {
    const { next } = await runController(forgotPassword, {
      body: {},
    });

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: "Email is required",
      })
    );
  });

  it("returns not found when forgot password email does not exist", async () => {
    User.findOne.mockResolvedValue(null);

    const { next } = await runController(forgotPassword, {
      body: { email: "missing@example.com" },
    });

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 404,
        message: "No account found with this email address.",
      })
    );
  });

  it("returns server error when forgot password email sending fails", async () => {
    const user = {
      email: "student@example.com",
      generatePasswordResetToken: jest.fn().mockReturnValue("plain-reset-token"),
      save: jest.fn().mockResolvedValue(),
    };
    User.findOne.mockResolvedValue(user);
    mailVerify.mockRejectedValue(new Error("SMTP failed"));

    const { next } = await runController(forgotPassword, {
      body: { email: "student@example.com" },
    });

    expect(user.passwordResetToken).toBe("");
    expect(user.passwordResetExpires).toBeUndefined();
    expect(user.save).toHaveBeenLastCalledWith({ validateBeforeSave: false });
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 500,
        message: "Password reset email could not be sent.",
      })
    );
  });

  it("resets password with a valid reset token", async () => {
    const user = {
      password: "old-password",
      passwordResetToken: "hashed-token",
      passwordResetExpires: Date.now() + 1000,
      save: jest.fn().mockResolvedValue(),
    };
    User.findOne.mockResolvedValue(user);

    const { res, next } = await runController(resetPassword, {
      params: { token: "plain-reset-token" },
      body: {
        password: "new-password",
        confirmPassword: "new-password",
      },
    });

    expect(User.findOne).toHaveBeenCalledWith(
      expect.objectContaining({
        passwordResetToken: expect.any(String),
        passwordResetExpires: { $gt: expect.any(Number) },
      })
    );
    expect(user.password).toBe("new-password");
    expect(user.passwordResetToken).toBe("");
    expect(user.passwordResetExpires).toBeUndefined();
    expect(user.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 200,
        message: "Password reset successfully.",
      })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("returns validation error when reset password fields are missing", async () => {
    const { next } = await runController(resetPassword, {
      params: { token: "plain-reset-token" },
      body: { password: "new-password" },
    });

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: "Password and confirm password are required",
      })
    );
  });

  it("returns invalid input when reset passwords do not match", async () => {
    const { next } = await runController(resetPassword, {
      params: { token: "plain-reset-token" },
      body: {
        password: "new-password",
        confirmPassword: "other-password",
      },
    });

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: "Passwords do not match",
      })
    );
  });

  it("returns invalid input when reset token is expired or missing", async () => {
    User.findOne.mockResolvedValue(null);

    const { next } = await runController(resetPassword, {
      params: { token: "plain-reset-token" },
      body: {
        password: "new-password",
        confirmPassword: "new-password",
      },
    });

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: "Reset token is invalid or expired.",
      })
    );
  });

  it("changes the logged-in user's password", async () => {
    const user = {
      isPasswordCorrect: jest.fn().mockResolvedValue(true),
      save: jest.fn().mockResolvedValue(),
    };
    User.findById.mockResolvedValue(user);

    const { res, next } = await runController(changeCurrentPassword, {
      user: { _id: "user-1" },
      body: {
        oldPassword: "old-password",
        newPassword: "new-password",
      },
    });

    expect(User.findById).toHaveBeenCalledWith("user-1");
    expect(user.isPasswordCorrect).toHaveBeenCalledWith("old-password");
    expect(user.password).toBe("new-password");
    expect(user.save).toHaveBeenCalledWith({ validateBeforeSave: false });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 200,
        message: "Password Change Successfully",
      })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("returns unauthorized when old password is wrong", async () => {
    User.findById.mockResolvedValue({
      isPasswordCorrect: jest.fn().mockResolvedValue(false),
    });

    const { next } = await runController(changeCurrentPassword, {
      user: { _id: "user-1" },
      body: {
        oldPassword: "wrong-password",
        newPassword: "new-password",
      },
    });

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 401,
        message: "Invalid old password",
      })
    );
  });

  it("updates account details with normalized values", async () => {
    const updatedUser = {
      _id: "user-1",
      fullName: "Test Student",
      email: "student@example.com",
    };
    User.findOne.mockResolvedValue(null);
    User.findByIdAndUpdate.mockReturnValue(mockSelectQuery(updatedUser));

    const { res, next } = await runController(updateAccountDetails, {
      user: { _id: "user-1" },
      body: {
        fullName: " Test Student ",
        email: " STUDENT@EXAMPLE.COM ",
      },
    });

    expect(User.findOne).toHaveBeenCalledWith({
      email: "student@example.com",
      _id: { $ne: "user-1" },
    });
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
      "user-1",
      {
        $set: {
          fullName: "Test Student",
          email: "student@example.com",
        },
      },
      { returnDocument: "after" }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 200,
        data: updatedUser,
        message: "Account details updated successfully",
      })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("returns validation error when account details are missing", async () => {
    const { next } = await runController(updateAccountDetails, {
      user: { _id: "user-1" },
      body: { fullName: "Test Student" },
    });

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: "All fields are required",
      })
    );
  });

  it("returns invalid input when account email format is wrong", async () => {
    const { next } = await runController(updateAccountDetails, {
      user: { _id: "user-1" },
      body: {
        fullName: "Test Student",
        email: "invalid-email",
      },
    });

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: "Invalid email format",
      })
    );
  });

  it("returns validation error when account email is already used", async () => {
    User.findOne.mockResolvedValue({ _id: "other-user" });

    const { next } = await runController(updateAccountDetails, {
      user: { _id: "user-1" },
      body: {
        fullName: "Test Student",
        email: "student@example.com",
      },
    });

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 409,
        message: "Email already registered.",
      })
    );
  });

  it("updates user avatar after mocked upload succeeds", async () => {
    const updatedUser = {
      _id: "user-1",
      avatar: "https://cdn.example.com/avatar.png",
    };
    uploadOnCloudinary.mockResolvedValue({
      url: "https://cdn.example.com/avatar.png",
    });
    User.findByIdAndUpdate.mockReturnValue(mockSelectQuery(updatedUser));

    const { res, next } = await runController(updateUserAvatar, {
      user: { _id: "user-1" },
      file: { path: "uploads/avatar.png" },
    });

    expect(uploadOnCloudinary).toHaveBeenCalledWith("uploads/avatar.png");
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
      "user-1",
      {
        $set: {
          avatar: "https://cdn.example.com/avatar.png",
        },
      },
      { returnDocument: "after" }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 200,
        data: updatedUser,
        message: "avatar is updated successfully",
      })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("returns validation error when avatar file is missing", async () => {
    const { next } = await runController(updateUserAvatar, {
      user: { _id: "user-1" },
    });

    expect(uploadOnCloudinary).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: "Avatar file is missing",
      })
    );
  });

  it("returns invalid input when avatar upload does not return a url", async () => {
    uploadOnCloudinary.mockResolvedValue(null);

    const { next } = await runController(updateUserAvatar, {
      user: { _id: "user-1" },
      file: { path: "uploads/avatar.png" },
    });

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: "problem while uploading on cloudinary",
      })
    );
  });
});

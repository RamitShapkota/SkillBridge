import { describe, expect, it } from "@jest/globals";
import { Verification } from "../../src/models/verification.model.js";

describe("Verification Model", () => {
  it("defines required user, type and status fields", () => {
    const userPath = Verification.schema.path("user");
    const typePath = Verification.schema.path("type");
    const statusPath = Verification.schema.path("status");

    expect(userPath.options.required).toBe(true);
    expect(userPath.options.unique).toBe(true);
    expect(typePath.options.required).toBe(true);
    expect(typePath.options.enum).toEqual(["student", "client"]);
    expect(statusPath.options.default).toBe("pending");
    expect(statusPath.options.enum).toEqual(["pending", "approved", "rejected"]);
  });

  it("keeps student and client document fields in the schema", () => {
    expect(Verification.schema.path("collegeName")).toBeDefined();
    expect(Verification.schema.path("studentId")).toBeDefined();
    expect(Verification.schema.path("collegeIdCard")).toBeDefined();
    expect(Verification.schema.path("studentSelfie")).toBeDefined();
    expect(Verification.schema.path("legalName")).toBeDefined();
    expect(Verification.schema.path("phone")).toBeDefined();
    expect(Verification.schema.path("citizenshipFront")).toBeDefined();
    expect(Verification.schema.path("citizenshipSelfie")).toBeDefined();
    expect(Verification.schema.path("companyRegistrationDocument")).toBeDefined();
  });
});

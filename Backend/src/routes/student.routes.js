import { Router } from "express";
import {
  getStudentProfile,
  updateStudentProfile,
} from "../controllers/studentProfile.controller.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
const studentRoles = authorizeRoles("student");

router
  .route("/profile")
  .get(verifyJWT, studentRoles, getStudentProfile)
  .put(verifyJWT, studentRoles, updateStudentProfile);

export default router;

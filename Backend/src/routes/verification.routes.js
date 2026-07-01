import { Router } from "express";
import {
  getVerificationStatus,
  submitClientVerification,
  submitStudentVerification,
  updateVerification,
} from "../controllers/verification.controller.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();
const studentRoles = authorizeRoles("student");
const clientRoles = authorizeRoles("client");

router
  .route("/student")
  .post(
    verifyJWT,
    studentRoles,
    upload.fields([
      { name: "idCard", maxCount: 1 },
      { name: "selfie", maxCount: 1 },
    ]),
    submitStudentVerification
  );

router
  .route("/client")
  .post(
    verifyJWT,
    clientRoles,
    upload.fields([
      { name: "citizenshipFront", maxCount: 1 },
      { name: "citizenshipSelfie", maxCount: 1 },
      { name: "companyRegistration", maxCount: 1 },
    ]),
    submitClientVerification
  );

router.route("/status").get(verifyJWT, getVerificationStatus);

router.route("/").patch(verifyJWT, updateVerification);

export default router;

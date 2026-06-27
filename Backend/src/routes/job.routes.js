import { Router } from "express";
import { cancelJob } from "../controllers/job.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();

router.route("/:jobId/cancel").patch(verifyJWT, authorizeRoles("client"), cancelJob);

export default router;

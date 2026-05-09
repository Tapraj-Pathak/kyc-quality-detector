import { Router } from "express";
import {
  createSubmission,
  getSubmissionStats,
  listSubmissions,
} from "../controllers/submissions.controller.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(listSubmissions));
router.get("/stats", asyncHandler(getSubmissionStats));
router.post("/", asyncHandler(createSubmission));

export default router;

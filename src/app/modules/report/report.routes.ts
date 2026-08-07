import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { reportControllers } from "./report.controller";
import { reportValidation } from "./report.validation";

const router = express.Router();

router.post(
  "/",
  auth(),
  validateRequest(reportValidation.createReportSchema),
  reportControllers.createReport,
);

export const reportRoutes = router;

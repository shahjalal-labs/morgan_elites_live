import express from "express";
import { liveControllers } from "./live.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/generate-token", auth(), liveControllers.generateToken);
router.post("/create/streaming", auth(), liveControllers.createLiveStreaming);
router.get("/get/streaming/:streamId", auth(), liveControllers.getStreamInfo);
router.post(
  "/close/streaming/:streamId",
  auth(),
  liveControllers.closeLiveStreaming
);

export const liveRoutes = router;

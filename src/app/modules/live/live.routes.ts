import express from "express";
import { liveControllers } from "./live.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/generate-token", auth(), liveControllers.generateToken);
router.post("/create/streaming", auth(), liveControllers.createLiveStreaming);
router.get("/get/streaming/:streamId", auth(), liveControllers.getStreamInfo);
router.post(
  "/start/streaming/:streamId",
  auth(),
  liveControllers.startLiveStreaming
);
router.post(
  "/close/streaming/:streamId",
  auth(),
  liveControllers.closeLiveStreaming
);
router.post(
  "/start/recording/:streamId",
  auth(),
  liveControllers.startRecording
);
router.post("/stop/recording/:streamId", auth(), liveControllers.stopRecording);
router.get(
  "/retrive/recording/:streamId",
  auth(),
  liveControllers.recordLinkRetrieve
);
router.patch(
  "/watch-count/:streamId",
  auth(),
  liveControllers.watchCountUpdate
);
router.get("/top-influencers/live", auth(), liveControllers.topInfluencersLive);
router.post("/webhook/recording", liveControllers.recordingWebhook);

export const liveRoutes = router;

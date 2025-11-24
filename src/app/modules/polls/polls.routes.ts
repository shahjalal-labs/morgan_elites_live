import express from "express";
import { pollsControllers } from "./polls.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/:streamId", auth(), pollsControllers.createPolls);
router.get("/", pollsControllers.getAllPollss);
router.get("/:streamId", auth(), pollsControllers.getPollsById);
router.post("/submit/vote/:pollsId", auth(), pollsControllers.submitVote);
router.get("/result/:streamId", auth(), pollsControllers.pollsResult);
router.patch("/:id", auth(), pollsControllers.updatePolls);
router.delete("/:id", auth(), pollsControllers.deletePolls);

export const pollsRoutes = router;

import express from "express";
import { eventControllers } from "./event.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/", auth(), eventControllers.createEvent);
router.get("/schedule/event", auth(), eventControllers.getScheduleEvents);
router.get("/all/event", auth(), eventControllers.allEvents);
router.get("/all/event/non-user", eventControllers.allEventsNonUser);
router.get("/all/recording", auth(), eventControllers.allRecordings);
router.get("/live/event", auth(), eventControllers.liveEvents);
router.get("/funding/event", auth(), eventControllers.getFundingEvents);
router.get("/my/event", auth(), eventControllers.getMyEvents);
router.get("/my/recording", auth(), eventControllers.myRecordings);
router.get("/user/event/:id", auth(), eventControllers.usersEvent);
router.get("/user/recording/:userId", auth(), eventControllers.usersRecording);
router.get("/schedule/event", auth(), eventControllers.getScheduleEvents);
router.get("/following/event", auth(), eventControllers.followingEvents);
router.get("/:id", eventControllers.getEventById);
router.patch("/:eventId", auth(), eventControllers.updateEvent);
router.delete("/:eventId", auth(), eventControllers.deleteEvent);
router.post("/like-unlike/:eventId", auth(), eventControllers.eventLikeUnlike);
router.post("/comment/:eventId", auth(), eventControllers.eventComment);
router.post("/reply-comment/:commentId", auth(), eventControllers.replyComment);
router.get("/comment/:eventId", auth(), eventControllers.getEventComments);

export const eventRoutes = router;

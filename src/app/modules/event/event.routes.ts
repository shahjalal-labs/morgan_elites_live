import express from "express";
import { eventControllers } from "./event.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/", auth(), eventControllers.createEvent);
router.get("/schedule/event", auth(), eventControllers.getScheduleEvents);
router.get("/funding/event", auth(), eventControllers.getFundingEvents);
router.get("/my-schedule/event", auth(), eventControllers.getMyScheduleEvents);
router.get("/my-funding/event", auth(), eventControllers.getMyFundingEvents);
router.get(
  "/user-schedule/event/:id",
  auth(),
  eventControllers.scheduleEventsOfUser
);
router.get(
  "/user-funding/event/:id",
  auth(),
  eventControllers.fundingEventsOfUser
);
router.get("/:id", eventControllers.getEventById);
router.patch("/:id", eventControllers.updateEvent);
router.delete("/:id", eventControllers.deleteEvent);
router.post("/like-unlike/:eventId", auth(), eventControllers.eventLikeUnlike);
router.post("/comment/:eventId", auth(), eventControllers.eventComment);
router.post("/reply-comment/:commentId", auth(), eventControllers.replyComment);
router.get("/comment/:eventId", auth(), eventControllers.getEventComments);

export const eventRoutes = router;

import express from "express";
import { eventControllers } from "./event.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/", auth(), eventControllers.createEvent);
router.get("/schedule/event", auth(), eventControllers.getScheduleEvents);
router.get("/funding/event", auth(), eventControllers.getFundingEvents);
router.get("/:id", eventControllers.getEventById);
router.patch("/:id", eventControllers.updateEvent);
router.delete("/:id", eventControllers.deleteEvent);
router.post("/like-unlike/:eventId", auth(), eventControllers.eventLikeUnlike);

export const eventRoutes = router;

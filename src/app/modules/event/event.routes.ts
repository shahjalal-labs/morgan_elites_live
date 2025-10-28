import express from "express";
import { eventControllers } from "./event.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/", auth(), eventControllers.createEvent);
router.get("/", eventControllers.getAllEvents);
router.get("/:id", eventControllers.getEventById);
router.patch("/:id", eventControllers.updateEvent);
router.delete("/:id", eventControllers.deleteEvent);

export const eventRoutes = router;

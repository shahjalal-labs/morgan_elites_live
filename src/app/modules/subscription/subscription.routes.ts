import express from "express";
import { subscriptionControllers } from "./subscription.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/", auth(), subscriptionControllers.createSubscription);
router.get("/", subscriptionControllers.getAllSubscriptions);
router.get("/:id", subscriptionControllers.getSubscriptionById);
router.patch("/:id", subscriptionControllers.updateSubscription);
router.delete("/:id", subscriptionControllers.deleteSubscription);

export const subscriptionRoutes = router;

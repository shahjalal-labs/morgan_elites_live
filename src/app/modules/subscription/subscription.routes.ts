import express from "express";
import { subscriptionControllers } from "./subscription.controller";

const router = express.Router();

router.post("/", subscriptionControllers.createSubscription);
router.get("/", subscriptionControllers.getAllSubscriptions);
router.get("/:id", subscriptionControllers.getSubscriptionById);
router.patch("/:id", subscriptionControllers.updateSubscription);
router.delete("/:id", subscriptionControllers.deleteSubscription);

export const subscriptionRoutes = router;

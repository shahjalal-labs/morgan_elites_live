import express from "express";
import { donationControllers } from "./donation.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/:eventId", auth(), donationControllers.createDonation);
router.post(
  "/connected/account",
  auth(),
  donationControllers.createConnectedAccount
);
router.get("/", donationControllers.getAllDonations);
router.get("/:id", donationControllers.getDonationById);
router.patch("/:id", donationControllers.updateDonation);
router.delete("/:id", donationControllers.deleteDonation);

export const donationRoutes = router;

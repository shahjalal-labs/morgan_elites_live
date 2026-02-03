import { donationServices } from "./donation.service";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";
import Stripe from "stripe";
import { stripe } from "../../../helpers/stripe";
import config from "../../../config";

const createDonation = catchAsync(async (req, res) => {
  const data = await donationServices.createDonation(
    req.body.amount,
    req.user.id,
    req.params.eventId,
  );
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "The donation session has been created successfully",
    data,
  });
});

const createConnectedAccount = catchAsync(async (req, res) => {
  const data = await donationServices.createConnectedAccount(req.user.id);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Connected account link created successfully",
    data,
  });
});

const stripeBalance = catchAsync(async (req, res) => {
  const data = await donationServices.stripeBalance(req.user.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Connected account balance retrived successfully",
    data,
  });
});

const instantPayout = catchAsync(async (req, res) => {
  const data = await donationServices.instantPayout(
    req.user.id,
    req.body.amount,
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Connected account intant payout successfully",
    data,
  });
});

export const stripeWebhookController = catchAsync(async (req, res) => {
  const sig = req.headers["stripe-signature"] as string;
  if (!sig) {
    sendResponse(res, {
      success: false,
      statusCode: 400,
      message: "Missing stripe signature",
    });
    return;
  }
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      config.stripe.webhook_secret as string,
      // "whsec_PWiYiv8emG1JjKfxOzaco5iG5Pp8E31D"
    );
  } catch (err: any) {
    sendResponse(res, {
      success: false,
      statusCode: 400,
      message: `Webhook error: ${err.message}`,
    });
    return;
  }
  await donationServices.stripeWebhookService(event);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Webhook processed",
  });
});

const getAllDonations = catchAsync(async (req, res) => {
  const result = await donationServices.getAllDonations();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "All donations has been retrived successfully",
    data: result,
  });
});

const getDonationById = catchAsync(async (req, res) => {
  const result = await donationServices.getDonationById(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "donation has been retrived successfully",
    data: result,
  });
});

const updateDonation = catchAsync(async (req, res) => {
  await donationServices.updateDonation(req.params.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "donation has been updated successfully",
  });
});

const deleteDonation = catchAsync(async (req, res) => {
  await donationServices.deleteDonation(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "donation has been deleted successfully",
  });
});

export const donationControllers = {
  createDonation,
  createConnectedAccount,
  stripeBalance,
  instantPayout,
  getAllDonations,
  getDonationById,
  updateDonation,
  deleteDonation,
};

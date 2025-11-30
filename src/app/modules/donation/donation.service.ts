import prisma from "../../../shared/prisma";
import { stripe } from "../../../helpers/stripe";
import Stripe from "stripe";
import ApiError from "../../../errors/ApiErrors";
import { sendSingleNotification } from "../notification/notification.services";

const createDonation = async (
  amount: number,
  userId: string,
  eventId: string
) => {
  const eventInfo = await prisma.event.findUnique({
    where: { id: eventId },
    select: {
      id: true,
      eventType: true,
      user: {
        select: {
          stripeAccountId: true,
        },
      },
    },
  });
  if (!eventInfo) throw new ApiError(404, "Event not found");
  if (!eventInfo.user.stripeAccountId)
    throw new ApiError(
      400,
      "This user does not have a connected Stripe account"
    );
  // Check capabilities
  const account = await stripe.accounts.retrieve(
    // eventInfo.user.stripeAccountId
    "acct_1RsFIE2XU2PLbtHE"
  );
  if (
    account.capabilities?.transfers !== "active" ||
    account.capabilities?.card_payments !== "active"
  ) {
    throw new ApiError(
      400,
      "Connected account onboarding incomplete. Need to finish onboarding."
    );
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",

    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Donation",
          },
          unit_amount: amount * 100,
        },
        quantity: 1,
      },
    ],
    metadata: {
      userId,
      eventId,
      paymentFor: eventInfo.eventType === "Funding" ? "Funding" : "Event",
    },

    payment_intent_data: {
      transfer_data: {
        destination: "acct_1RsFIE2XU2PLbtHE", // <-- connected account
        // destination: eventInfo.user.stripeAccountId as string, // <-- connected account
      },
    },

    success_url: `https://morgan.smtsigma.com/payment-success`,
    cancel_url: `https://morgan.smtsigma.com/payment-cancel`,
  });

  return {
    checkoutUrl: session.url,
  };
};

const stripeWebhookService = async (event: Stripe.Event) => {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(session);
      const userId = session.metadata?.userId!;
      const eventId = session.metadata?.eventId!;
      const amount = session.amount_total! / 100;
      const paymentFor = session.metadata?.paymentFor!;

      const donationInfo = await prisma.donation.create({
        data: {
          userId,
          eventId,
          amount: amount,
          status: "Completed",
          paymentFor: paymentFor === "Funding" ? "Funding" : "Event",
          method: "Card",
        },
        include: {
          event: {
            select: {
              title: true,
            },
          },
        },
      });

      if (!donationInfo) {
        throw new ApiError(404, "Donation not found for this session");
      }

      if (paymentFor === "Funding") {
        await sendSingleNotification(
          donationInfo.userId,
          "Donation Completed",
          `Thank you! Your donation to "${donationInfo.event.title}" has been completed successfully.`
        );
      } else {
        await sendSingleNotification(
          donationInfo.userId,
          "Join access in event",
          `Thank you! Your payment to "${donationInfo.event.title}" has been completed successfully.`
        );
      }

      break;
    }

    default:
      break;
  }
};

const createConnectedAccount = async (userId: string) => {
  const userInfo = await prisma.user.findUnique({ where: { id: userId } });
  if (!userInfo) throw new ApiError(404, "User not found");

  let stripeAccountId = userInfo.stripeAccountId as string;

  if (userInfo.stripeAccountId === null) {
    const account = await stripe.accounts.create({
      type: "express",
      country: "US",
      email: userInfo.email ?? "",
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });
    stripeAccountId = account.id;

    await prisma.user.update({
      where: { id: userId },
      data: { stripeAccountId: account.id },
    });
  }

  const link = await stripe.accountLinks.create({
    account: stripeAccountId,
    refresh_url: `https://test.com/onboarding/refresh`,
    return_url: `https://test.com/onboarding/complete`,
    type: "account_onboarding",
  });

  return link.url;
};

const stripeBalance = async (userId: string) => {
  const userInfo = await prisma.user.findUnique({ where: { id: userId } });
  if (!userInfo) throw new ApiError(404, "User not found");

  const balance = await stripe.balance.retrieve({
    // stripeAccount: userInfo.stripeAccountId as string,
    stripeAccount: "acct_1RsFIE2XU2PLbtHE",
  });

  const totalTransactions = await prisma.donation.count({
    where: { userId },
  });

  const completedTransactions = await prisma.donation.findMany({
    where: { userId, status: "Completed" },
    select: {
      id: true,
      status: true,
      amount: true,
      method: true,
      event: {
        select: {
          id: true,
          title: true,
          text: true,
        },
      },
      paymentFor: true,
    },
  });

  const pendingTransactions = await prisma.donation.count({
    where: { userId, status: "Pending" },
  });

  return {
    available: (balance.available[0]?.amount ?? 0) / 100,
    withdrawable: (balance.instant_available?.[0]?.amount ?? 0) / 100,
    pendingBalance: (balance.pending[0]?.amount ?? 0) / 100,
    totalTransactions,
    completedTransactions: completedTransactions.length,
    pendingTransactions,
    transactionHistory: completedTransactions,
  };
};

const instantPayout = async (userId: string, amount: number) => {
  const userInfo = await prisma.user.findUnique({ where: { id: userId } });
  if (!userInfo) throw new ApiError(404, "User not found");
  const payout = await stripe.payouts.create(
    {
      amount: amount * 100,
      currency: "usd",
      method: "instant",
    },
    {
      // stripeAccount: userInfo.stripeAccountId as string,
      stripeAccount: "acct_1RsFIE2XU2PLbtHE",
    }
  );

  await sendSingleNotification(
    userId,
    "Instant Payout Successful",
    `Your payout of $${amount} has been successfully deposited into your account.`
  );

  return payout;
};

const getAllDonations = async () => {
  const results = await prisma.donation.findMany();
  return results;
};

const getDonationById = async (id: string) => {
  const result = await prisma.donation.findUnique({ where: { id } });
  return result;
};

const updateDonation = async (id: string, data: any) => {
  await prisma.donation.update({ where: { id }, data });
  return;
};

const deleteDonation = async (id: string) => {
  await prisma.donation.delete({ where: { id } });
  return;
};

export const donationServices = {
  createDonation,
  createConnectedAccount,
  stripeWebhookService,
  stripeBalance,
  instantPayout,
  getAllDonations,
  getDonationById,
  updateDonation,
  deleteDonation,
};

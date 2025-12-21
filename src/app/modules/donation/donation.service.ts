import prisma from "../../../shared/prisma";
import { stripe } from "../../../helpers/stripe";
import Stripe from "stripe";
import ApiError from "../../../errors/ApiErrors";
import { sendSingleNotification } from "../notification/notification.services";
import { Platform } from "@prisma/client";

const createDonation = async (
  amount: number,
  userId: string,
  eventId: string
) => {
  const senderInfo = await prisma.user.findUnique({ where: { id: userId } });
  if (!senderInfo) throw new ApiError(404, "User not found");

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
    "acct_1Sep3UBPugK1aiPR"
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
        amount: Math.round(amount * 100 * 0.9), // platform takes 10% fee
        destination: "acct_1Sep3UBPugK1aiPR", // <-- connected account
        // destination: eventInfo.user.stripeAccountId as string, // <-- connected account
      },
    },

    success_url: `https://elites-livestream.com/payment-success`,
    cancel_url: `https://elites-livestream.com/payment-cancel`,
  });

  return {
    checkoutUrl: session.url,
  };
};

const stripeWebhookService = async (event: Stripe.Event) => {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;

      if (session.subscription) {
        const plan = session.metadata?.plan;
        const expiryAt = session.metadata?.expiryAt;
        const subscriptionId = session.subscription as string;

        const existingSubscription = await prisma.subscription.findUnique({
          where: { userId },
        });

        if (existingSubscription) {
          await stripe.subscriptions.cancel(
            existingSubscription.subscriptionId
          );
        }

        await prisma.subscription.upsert({
          where: { userId },
          update: {
            subscriptionId: subscriptionId,
            plan,
            platform: "Web",
            isActive: true,
            expiryAt: new Date(expiryAt!),
          },
          create: {
            subscriptionId: subscriptionId,
            userId: userId!,
            plan: plan!,
            platform: "Web",
            isActive: true,
            expiryAt: new Date(expiryAt!),
          },
        });

        await sendSingleNotification(
          userId!,
          "Subscription Activated",
          `Thank you! Your subscription has been activated successfully.`,
          "Subscription"
        );
        console.log("✅ Subscription active until:", expiryAt);
        break;
      }

      const eventId = session.metadata?.eventId!;
      const amount = session.amount_total! / 100;
      const paymentFor = session.metadata?.paymentFor!;

      const donationInfo = await prisma.donation.create({
        data: {
          userId: userId!,
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
          `Thank you! Your donation to "${donationInfo.event.title}" has been completed successfully.`,
          "Donation",
          eventId
        );
      } else {
        await sendSingleNotification(
          donationInfo.userId,
          "Join access in event",
          `Thank you! Your payment to "${donationInfo.event.title}" has been completed successfully.`,
          "JoinAccess",
          eventId
        );
      }

      break;
    }

    default:
      break;
  }
};

const inAppPurchaseWebhook = async (data: any) => {
  const userId = data.userId;
  const subscriptionId = data.subscriptionId;
  const plan = data.plan;
  const expiryAt = data.expiryAt;

  await prisma.subscription.upsert({
    where: { userId },
    update: {
      subscriptionId: subscriptionId,
      plan,
      platform: data.platform as Platform,
      isActive: true,
      expiryAt: new Date(expiryAt!),
    },
    create: {
      subscriptionId: subscriptionId,
      userId: userId!,
      plan: plan!,
      platform: data.platform as Platform,
      isActive: true,
      expiryAt: new Date(expiryAt!),
    },
  });

  await sendSingleNotification(
    userId!,
    "Subscription Activated",
    `Thank you! Your subscription has been activated successfully.`,
    "Subscription"
  );
  return;
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
    refresh_url: `https://elites-livestream.com/payment-success`,
    return_url: `https://elites-livestream.com/payment-success`,
    type: "account_onboarding",
  });

  return link.url;
};

const stripeBalance = async (userId: string) => {
  const userInfo = await prisma.user.findUnique({ where: { id: userId } });
  if (!userInfo) throw new ApiError(404, "User not found");

  const balance = await stripe.balance.retrieve({
    // stripeAccount: userInfo.stripeAccountId as string,
    stripeAccount: "acct_1Sep3UBPugK1aiPR",
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
      stripeAccount: "acct_1Sep3UBPugK1aiPR",
    }
  );

  await sendSingleNotification(
    userId,
    "Instant Payout Successful",
    `Your payout of $${amount} has been successfully deposited into your account.`,
    "Payout",
    payout.id
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

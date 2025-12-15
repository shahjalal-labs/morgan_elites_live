import { stripe } from "../../../helpers/stripe";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";

const createSubscription = async (
  plan: string,
  priceId: string,
  userId: string
) => {
  const userInfo = await prisma.user.findUnique({ where: { id: userId } });
  if (!userInfo) throw new Error("User not found");

  if (!userInfo.customerId) {
    const customer = await stripe.customers.create({
      email: userInfo.email,
      name: userInfo.firstName + " " + userInfo.lastName,
    });

    await prisma.user.update({
      where: { id: userId },
      data: { customerId: customer.id },
    });

    userInfo.customerId = customer.id;
  }
  const customerId = userInfo.customerId!;
  const expiryAt = new Date();
  expiryAt.setMonth(expiryAt.getMonth() + 1);

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    metadata: {
      userId,
      priceId,
      plan,
      expiryAt: expiryAt.toISOString(),
    },
    success_url: `https://elites-livestream.com/payment-success`,
    cancel_url: `https://elites-livestream.com/payment-cancel`,
  });

  return session.url;
};

const getAllSubscriptions = async () => {
  const results = await prisma.subscription.findMany();
  return results;
};

const getSubscriptionById = async (id: string) => {
  const result = await prisma.subscription.findUnique({ where: { id } });
  return result;
};

const updateSubscription = async (id: string, data: any) => {
  await prisma.subscription.update({ where: { id }, data });
  return;
};

const deleteSubscription = async (subscriptionId: string, userId: string) => {
  const response = await stripe.subscriptions.cancel(subscriptionId);
  if (response.status !== "canceled") {
    throw new ApiError(400, "Failed to cancel subscription in Stripe");
  }

  await prisma.subscription.delete({ where: { userId, subscriptionId } });
  return;
};

export const subscriptionServices = {
  createSubscription,
  // subscriptionWebhookHandler,
  getAllSubscriptions,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
};

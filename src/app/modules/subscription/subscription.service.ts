import { stripe } from "../../../helpers/stripe";
import prisma from "../../../shared/prisma";

const createSubscription = async (data: any) => {
  const priceId = "price_1SeUA3FQDM8OhwJH4ZiMWQ3T";
  const customerId = "cus_T9FUMghKfBkfOa";
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
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

const deleteSubscription = async (id: string) => {
  await prisma.subscription.delete({ where: { id } });
  return;
};

export const subscriptionServices = {
  createSubscription,
  getAllSubscriptions,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
};

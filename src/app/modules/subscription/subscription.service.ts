import Stripe from "stripe";
import { stripe } from "../../../helpers/stripe";
import prisma from "../../../shared/prisma";

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

// const subscriptionWebhookHandler = async (event: Stripe.Event) => {
//   switch (event.type) {
//     case "checkout.session.completed": {
//       const session = event.data.object as Stripe.Checkout.Session;
//       if (!session.subscription || !session.metadata) return;

//       const userId = session.metadata.userId;
//       const priceId = session.metadata.priceId;
//       const plan = session.metadata.plan;
//       const expiryAt = session.metadata.expiryAt;

//       await prisma.subscription.upsert({
//         where: { userId },
//         update: {
//           priceId,
//           plan,
//           isActive: true,
//           expiryAt: new Date(expiryAt),
//         },
//         create: {
//           userId,
//           priceId,
//           plan,
//           isActive: true,
//           expiryAt: new Date(expiryAt),
//         },
//       });

//       console.log("✅ Subscription active until:", expiryAt);
//       break;
//     }
//     case "customer.subscription.updated": {
//       const subscription = event.data.object as Stripe.Subscription;
//       console.log("Subscription updated:", subscription.id);
//       break;
//     }
//     case "customer.subscription.deleted": {
//       const subscription = event.data.object as Stripe.Subscription;
//       console.log("Subscription deleted:", subscription.id);
//       break;
//     }
//     default:
//       break;
//   }
// };

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
  // subscriptionWebhookHandler,
  getAllSubscriptions,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
};

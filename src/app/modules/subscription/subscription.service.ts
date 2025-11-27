import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const createSubscription = async (data: any) => {
  await prisma.subscription.create({ data });
  return
};

const getAllSubscriptions = async () => {
  const results = await prisma.subscription.findMany();
  return results
};

const getSubscriptionById = async (id: string) => {
  const result = await prisma.subscription.findUnique({ where: { id } });
  return result
};

const updateSubscription = async (id: string, data: any) => {
  await prisma.subscription.update({ where: { id }, data });
  return
};

const deleteSubscription = async (id: string) => {
  await prisma.subscription.delete({ where: { id } });
  return
};

export const subscriptionServices = {
  createSubscription,
  getAllSubscriptions,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
}
  
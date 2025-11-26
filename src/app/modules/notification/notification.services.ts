import ApiError from "../../../errors/ApiErrors";
import admin from "../../../helpers/firebaseAdmin";
import prisma from "../../../shared/prisma";

// Send notification to a single user
export const sendSingleNotification = async (
  userId: string,
  title: string,
  body: string
) => {
  const userInfo = await prisma.user.findUnique({ where: { id: userId } });
  if (!userInfo) return;
  if (!userInfo.fcmToken) {
    await prisma.notification.create({
      data: {
        userId,
        title,
        body,
      },
    });
    return;
  }

  const message = {
    notification: {
      title: title,
      body: body,
    },
    token: userInfo.fcmToken,
  };

  await prisma.notification.create({
    data: {
      userId,
      title,
      body,
    },
  });

  const response = await admin.messaging().send(message);
  return response;
};

const getNotifications = async (userId: string) => {
  const notifications = await prisma.notification.findMany({
    where: {
      userId,
    },
    orderBy: { createdAt: "desc" },
  });

  return notifications;
};

const getSingleNotification = async (
  userId: string,
  notificationId: string
) => {
  const notification = await prisma.notification.findUnique({
    where: {
      id: notificationId,
      userId,
    },
  });

  if (!notification) {
    throw new ApiError(404, "Notification not");
  }

  const updateNotification = await prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });

  return updateNotification;
};

export const notificationServices = {
  getNotifications,
  getSingleNotification,
};

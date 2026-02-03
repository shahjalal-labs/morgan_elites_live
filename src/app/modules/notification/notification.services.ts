import { NotificationType } from "@prisma/client";
import ApiError from "../../../errors/ApiErrors";
import admin from "../../../helpers/firebaseAdmin";
import prisma from "../../../shared/prisma";

// Send notification to a single user
export const sendSingleNotification = async (
  userId: string,
  title: string,
  body: string,
  type?: NotificationType,
  handlerId?: string,
  senderId?: string,
) => {
  const userInfo = await prisma.user.findUnique({ where: { id: userId } });
  if (!userInfo) return;
  if (!userInfo.fcmToken) {
    await prisma.notification.create({
      data: {
        userId,
        title,
        body,
        type: type,
        handlerId: handlerId,
        senderId: senderId,
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
      senderId,
      type: type,
      handlerId: handlerId,
    },
  });

  try {
    const response = await admin.messaging().send(message);
    return response;
  } catch (error) {
    console.log(error);
    return;
  }
};

const getNotifications = async (userId: string) => {
  const notifications = await prisma.notification.findMany({
    where: {
      userId,
    },
    include: {
      sender: {
        select: {
          firstName: true,
          lastName: true,
          profileImage: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return notifications;
};

const getSingleNotification = async (
  userId: string,
  notificationId: string,
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

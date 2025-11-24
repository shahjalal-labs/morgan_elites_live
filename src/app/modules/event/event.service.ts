import { Event } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { paginationHelper } from "../../../shared/pagination";
import ApiError from "../../../errors/ApiErrors";

const createEvent = async (data: Event, userId: string) => {
  const userInfo = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!userInfo) throw new ApiError(404, "User not found");

  await prisma.event.create({
    data: {
      ...data,
      userId,
    },
  });
  return;
};

const getScheduleEvents = async (userId: string, query: any) => {
  const userInfo = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!userInfo) throw new ApiError(404, "User not found");

  const { page, limit, skip } = paginationHelper(query);
  const events = await prisma.event.findMany({
    where: {
      eventType: "Schedule",
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profileImage: true,
          profession: true,
        },
      },
      _count: {
        select: {
          EventLike: true,
          EventComment: true,
        },
      },
      EventLike: {
        where: { userId },
        select: { id: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip,
  });

  const eventsWithRelations = await Promise.all(
    events.map(async (event) => {
      const follow = await prisma.follow.findUnique({
        where: {
          user1Id_user2Id: {
            user1Id: userId,
            user2Id: event.user.id,
          },
        },
      });

      return {
        ...event,
        user: {
          ...event.user,
          isFollow: !!follow,
        },
        isLiked: event.EventLike.length > 0,
      };
    })
  );

  const totalCount = events.length;
  const totalPages = Math.ceil(totalCount / limit);
  return {
    totalCount,
    totalPages,
    currentPage: page,
    events: eventsWithRelations,
  };
};

const getFundingEvents = async (userId: string, query: any) => {
  const userInfo = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!userInfo) throw new ApiError(404, "User not found");

  const { page, limit, skip } = paginationHelper(query);
  const events = await prisma.event.findMany({
    where: {
      eventType: "Funding",
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profileImage: true,
          profession: true,
        },
      },
      _count: {
        select: {
          EventLike: true,
          EventComment: true,
        },
      },
      EventLike: {
        where: { userId },
        select: { id: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip,
  });

  const eventsWithRelations = await Promise.all(
    events.map(async (event) => {
      const follow = await prisma.follow.findUnique({
        where: {
          user1Id_user2Id: {
            user1Id: userId,
            user2Id: event.user.id,
          },
        },
      });

      return {
        ...event,
        user: {
          ...event.user,
          isFollow: !!follow,
        },
        isLiked: event.EventLike.length > 0,
      };
    })
  );

  const totalCount = events.length;
  const totalPages = Math.ceil(totalCount / limit);
  return {
    totalCount,
    totalPages,
    currentPage: page,
    events: eventsWithRelations,
  };
};

const getMyScheduleEvents = async (userId: string, query: any) => {
  const userInfo = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!userInfo) throw new ApiError(404, "User not found");

  const { page, limit, skip } = paginationHelper(query);
  const events = await prisma.event.findMany({
    where: {
      eventType: "Schedule",
      userId,
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profileImage: true,
          profession: true,
        },
      },
      _count: {
        select: {
          EventLike: true,
          EventComment: true,
        },
      },
      EventLike: {
        where: { userId },
        select: { id: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip,
  });

  const eventsWithLikeStatus = events.map((event) => ({
    ...event,
    isLiked: event.EventLike.length > 0,
  }));

  const totalCount = events.length;
  const totalPages = Math.ceil(totalCount / limit);
  return {
    totalCount,
    totalPages,
    currentPage: page,
    events: eventsWithLikeStatus,
  };
};

const getMyFundingEvents = async (userId: string, query: any) => {
  const userInfo = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!userInfo) throw new ApiError(404, "User not found");

  const { page, limit, skip } = paginationHelper(query);
  const events = await prisma.event.findMany({
    where: {
      eventType: "Funding",
      userId,
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profileImage: true,
          profession: true,
        },
      },
      _count: {
        select: {
          EventLike: true,
          EventComment: true,
        },
      },
      EventLike: {
        where: { userId },
        select: { id: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip,
  });

  const eventsWithLikeStatus = events.map((event) => ({
    ...event,
    isLiked: event.EventLike.length > 0,
  }));

  const totalCount = events.length;
  const totalPages = Math.ceil(totalCount / limit);
  return {
    totalCount,
    totalPages,
    currentPage: page,
    events: eventsWithLikeStatus,
  };
};

const getEventById = async (id: string) => {
  const result = await prisma.event.findUnique({ where: { id } });
  return result;
};

const updateEvent = async (id: string, data: any) => {
  await prisma.event.update({ where: { id }, data });
  return;
};

const deleteEvent = async (id: string) => {
  await prisma.event.delete({ where: { id } });
  return;
};

const eventLikeUnlike = async (userId: string, eventId: string) => {
  const userInfo = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!userInfo) throw new ApiError(404, "User not found");

  const eventInfo = await prisma.event.findUnique({
    where: { id: eventId },
  });
  if (!eventInfo) throw new ApiError(404, "Event not found");

  const isLike = await prisma.eventLike.findUnique({
    where: { eventId_userId: { eventId, userId } },
  });

  if (isLike) {
    await prisma.eventLike.delete({
      where: { eventId_userId: { eventId, userId } },
    });
    return "Event unlike successfully";
  } else {
    await prisma.eventLike.create({
      data: {
        eventId,
        userId,
      },
    });
    return "Event like successfully";
  }
};

const eventComment = async (
  userId: string,
  eventId: string,
  comment: string
) => {
  const userInfo = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!userInfo) throw new ApiError(404, "User not found");

  const eventInfo = await prisma.event.findUnique({
    where: { id: eventId },
  });
  if (!eventInfo) throw new ApiError(404, "Event not found");

  await prisma.eventComment.create({
    data: {
      eventId,
      userId,
      comment,
    },
  });
  return;
};

const replyComment = async (
  userId: string,
  commentId: string,
  replyComment: string
) => {
  const userInfo = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!userInfo) throw new ApiError(404, "User not found");

  const commentInfo = await prisma.eventComment.findUnique({
    where: { id: commentId },
  });
  if (!commentInfo) throw new ApiError(404, "Comment not found");

  await prisma.replyComment.create({
    data: {
      userId,
      commentId,
      replyComment,
    },
  });
  return;
};

const getEventComments = async (userId: string, eventId: string) => {
  const userInfo = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!userInfo) throw new ApiError(404, "User not found");

  const eventInfo = await prisma.event.findUnique({
    where: { id: eventId },
    select: {
      id: true,
      EventComment: {
        select: {
          id: true,
          comment: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              profileImage: true,
              firstName: true,
              lastName: true,
            },
          },
          ReplyComment: {
            select: {
              id: true,
              replyComment: true,
              createdAt: true,
              user: {
                select: {
                  id: true,
                  profileImage: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      },
    },
  });
  if (!eventInfo) throw new ApiError(404, "Event not found");
  return eventInfo;
};

export const eventServices = {
  createEvent,
  getScheduleEvents,
  getFundingEvents,
  getMyScheduleEvents,
  getMyFundingEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  eventLikeUnlike,
  eventComment,
  replyComment,
  getEventComments,
};

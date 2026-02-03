import { Event } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { paginationHelper } from "../../../shared/pagination";
import ApiError from "../../../errors/ApiErrors";
import { stripe } from "../../../helpers/stripe";
import { sendSingleNotification } from "../notification/notification.services";

const createEvent = async (
  data: Event,
  userId: string,
  hostLink: string,
  coHostLink: string,
  audienceLink: string,
) => {
  const userInfo = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!userInfo) throw new ApiError(404, "User not found");
  if (!userInfo.stripeAccountId)
    throw new ApiError(400, "You does not have a connected Stripe account");
  const account = await stripe.accounts.retrieve(
    // eventInfo.user.stripeAccountId
    "acct_1Sep3UBPugK1aiPR",
  );
  if (
    account.capabilities?.transfers !== "active" ||
    account.capabilities?.card_payments !== "active"
  ) {
    throw new ApiError(
      400,
      "Connected account onboarding incomplete. Need to finish onboarding.",
    );
  }

  await prisma.$transaction(async (tx) => {
    const streaming = await tx.liveStreaming.create({
      data: {
        userId,
        hostLink: hostLink,
        coHostLink: coHostLink,
        audienceLink: audienceLink,
        isLive: false,
      },
    });
    await tx.event.create({
      data: {
        eventType: data.eventType,
        title: data.title,
        text: data.text,
        scheduleDate: data.scheduleDate,
        payAmount: data.eventType === "Schedule" ? data.payAmount : 0,
        userId,
        streamId: streaming.id,
      },
    });
  });

  return;
};

const allEventsNonUser = async (query: any) => {
  const { page, limit = 10, skip } = paginationHelper(query);
  const { search } = query;
  const events = await prisma.event.findMany({
    where: {
      title: {
        contains: search,
        mode: "insensitive",
      },
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

      stream: {
        select: {
          id: true,
          isLive: true,
          hostLink: true,
          coHostLink: true,
          audienceLink: true,
          recordingLink: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip,
  });

  const totalCount = events.length;
  const totalPages = Math.ceil(totalCount / limit);
  return {
    totalCount,
    totalPages,
    currentPage: page,
    events,
  };
};

const allEvents = async (userId: string, query: any) => {
  const userInfo = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!userInfo) throw new ApiError(404, "User not found");

  const { page, limit = 10, skip } = paginationHelper(query);
  const { search } = query;
  const events = await prisma.event.findMany({
    where: {
      title: {
        contains: search,
        mode: "insensitive",
      },
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
      stream: {
        select: {
          id: true,
          isLive: true,
          hostLink: true,
          coHostLink: true,
          audienceLink: true,
          recordingLink: true,
        },
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

      const paymentInfo = await prisma.donation.findFirst({
        where: {
          userId,
          eventId: event.id,
          paymentFor: "Event",
          status: "Completed",
        },
      });

      const isModerator = await prisma.moderator.findUnique({
        where: {
          userId_moderatorId: { userId: event.userId, moderatorId: userId },
        },
      });

      const isSubscribed = await prisma.subscription.findUnique({
        where: { userId },
      });

      return {
        ...event,
        user: {
          ...event.user,
          isFollow: !!follow,
        },
        isLiked: event.EventLike.length > 0,
        isOwner: event.userId === userId,
        isPayment: paymentInfo?.userId === userId ? true : false,
        isModerator: !!isModerator,
        isSubscribed: !!isSubscribed,
        subscribeType: isSubscribed ? isSubscribed.plan : null,
      };
    }),
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

const liveEvents = async (userId: string, query: any) => {
  const userInfo = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!userInfo) throw new ApiError(404, "User not found");

  const { page, limit = 1, skip } = paginationHelper(query);
  const { search } = query;
  const events = await prisma.event.findMany({
    where: {
      stream: {
        isLive: true,
      },
      title: {
        contains: search,
        mode: "insensitive",
      },
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
      stream: {
        select: {
          id: true,
          isLive: true,
          hostLink: true,
          coHostLink: true,
          audienceLink: true,
          watchCount: true,
        },
      },
    },
    orderBy: {
      stream: {
        createdAt: "desc",
      },
    },
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

      const paymentInfo = await prisma.donation.findFirst({
        where: {
          userId,
          eventId: event.id,
          paymentFor: "Event",
          status: "Completed",
        },
      });

      const isModerator = await prisma.moderator.findUnique({
        where: {
          userId_moderatorId: { userId: event.userId, moderatorId: userId },
        },
      });

      const isSubscribed = await prisma.subscription.findUnique({
        where: { userId },
      });

      return {
        ...event,
        user: {
          ...event.user,
          isFollow: !!follow,
        },
        isLiked: event.EventLike.length > 0,
        isOwner: event.userId === userId,
        isPayment: paymentInfo?.userId === userId ? true : false,
        isModerator: !!isModerator,
        isSubscribed: !!isSubscribed,
        subscribeType: isSubscribed ? isSubscribed.plan : null,
      };
    }),
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

const getScheduleEvents = async (userId: string, query: any) => {
  const userInfo = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!userInfo) throw new ApiError(404, "User not found");

  const { page, limit = 10, skip } = paginationHelper(query);
  const { search } = query;

  const events = await prisma.event.findMany({
    where: {
      eventType: "Schedule",
      title: {
        contains: search,
        mode: "insensitive",
      },
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
      stream: {
        select: {
          id: true,
          isLive: true,
          hostLink: true,
          coHostLink: true,
          audienceLink: true,
          recordingLink: true,
        },
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

      const paymentInfo = await prisma.donation.findFirst({
        where: {
          userId,
          eventId: event.id,
          paymentFor: "Event",
          status: "Completed",
        },
      });

      const isModerator = await prisma.moderator.findUnique({
        where: {
          userId_moderatorId: { userId: event.userId, moderatorId: userId },
        },
      });

      const isSubscribed = await prisma.subscription.findUnique({
        where: { userId },
      });

      return {
        ...event,
        user: {
          ...event.user,
          isFollow: !!follow,
        },
        isLiked: event.EventLike.length > 0,
        isOwner: event.userId === userId,
        isPayment: paymentInfo?.userId === userId ? true : false,
        isModerator: !!isModerator,
        isSubscribed: !!isSubscribed,
        subscribeType: isSubscribed ? isSubscribed.plan : null,
      };
    }),
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
  const { search } = query;

  const events = await prisma.event.findMany({
    where: {
      eventType: "Funding",
      title: {
        contains: search,
        mode: "insensitive",
      },
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
      stream: {
        select: {
          id: true,
          isLive: true,
          hostLink: true,
          coHostLink: true,
          audienceLink: true,
          recordingLink: true,
        },
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

      const isModerator = await prisma.moderator.findUnique({
        where: {
          userId_moderatorId: { userId: event.userId, moderatorId: userId },
        },
      });

      const isSubscribed = await prisma.subscription.findUnique({
        where: { userId },
      });

      return {
        ...event,
        user: {
          ...event.user,
          isFollow: !!follow,
        },
        isLiked: event.EventLike.length > 0,
        isOwner: event.userId === userId,
        isModerator: !!isModerator,
        isSubscribed: !!isSubscribed,
        subscribeType: isSubscribed ? isSubscribed.plan : null,
      };
    }),
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

const getMyEvents = async (userId: string, query: any) => {
  const userInfo = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!userInfo) throw new ApiError(404, "User not found");

  const { page, limit, skip } = paginationHelper(query);
  const events = await prisma.event.findMany({
    where: {
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
      stream: {
        select: {
          id: true,
          isLive: true,
          hostLink: true,
          coHostLink: true,
          audienceLink: true,
          recordingLink: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip,
  });

  const eventsWithLikeStatus = events.map((event) => ({
    ...event,
    isLiked: event.EventLike.length > 0,
    isOwner: event.userId === userId,
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

const usersEvent = async (userId: string, query: any, myId: string) => {
  const userInfo = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!userInfo) throw new ApiError(404, "User not found");

  const { page, limit, skip } = paginationHelper(query);
  const events = await prisma.event.findMany({
    where: {
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
      stream: {
        select: {
          id: true,
          isLive: true,
          hostLink: true,
          coHostLink: true,
          audienceLink: true,
          recordingLink: true,
        },
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
            user1Id: myId,
            user2Id: userId,
          },
        },
      });

      const paymentInfo = await prisma.donation.findFirst({
        where: {
          userId: myId,
          eventId: event.id,
          paymentFor: "Event",
          status: "Completed",
        },
      });

      const isModerator = await prisma.moderator.findUnique({
        where: {
          userId_moderatorId: { userId: event.userId, moderatorId: userId },
        },
      });

      const isSubscribed = await prisma.subscription.findUnique({
        where: { userId },
      });

      return {
        ...event,
        user: {
          ...event.user,
          isFollow: !!follow,
        },
        isLiked: event.EventLike.length > 0,
        isOwner: event.userId === myId,
        isPayment: paymentInfo?.userId === myId ? true : false,
        isModerator: !!isModerator,
        isSubscribed: !!isSubscribed,
        subscribeType: isSubscribed ? isSubscribed.plan : null,
      };
    }),
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

const usersRecording = async (userId: string) => {
  const recordings = await prisma.liveStreaming.findMany({
    where: {
      userId,
      recordingLink: { not: null },
      isLive: false,
      isSharedPost: false,
    },
    select: {
      id: true,
      recordingLink: true,
      watchCount: true,
    },
    orderBy: { id: "desc" },
  });
  return recordings;
};

const allRecordings = async () => {
  const recordings = await prisma.liveStreaming.findMany({
    where: { recordingLink: { not: null } },
    select: {
      id: true,
      recordingLink: true,
      watchCount: true,
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profileImage: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
  return recordings;
};

const followingEvents = async (userId: string, query: any) => {
  const userInfo = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!userInfo) throw new ApiError(404, "User not found");

  const { page, limit = 10, skip } = paginationHelper(query);

  const following = await prisma.follow.findMany({
    where: { user1Id: userId },
    select: { user2Id: true },
  });

  const followingIds = following.map((f) => f.user2Id);

  const events = await prisma.event.findMany({
    where: {
      userId: { in: followingIds },
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
      stream: {
        select: {
          id: true,
          isLive: true,
          hostLink: true,
          coHostLink: true,
          audienceLink: true,
          recordingLink: true,
        },
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

      const paymentInfo = await prisma.donation.findFirst({
        where: {
          userId,
          eventId: event.id,
          paymentFor: "Event",
          status: "Completed",
        },
      });

      const isModerator = await prisma.moderator.findUnique({
        where: {
          userId_moderatorId: { userId: event.userId, moderatorId: userId },
        },
      });

      const isSubscribed = await prisma.subscription.findUnique({
        where: { userId },
      });

      return {
        ...event,
        user: {
          ...event.user,
          isFollow: !!follow,
        },
        isLiked: event.EventLike.length > 0,
        isOwner: event.userId === userId,
        isPayment: paymentInfo?.userId === userId ? true : false,
        isModerator: !!isModerator,
        isSubscribed: !!isSubscribed,
        subscribeType: isSubscribed ? isSubscribed.plan : null,
      };
    }),
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

const getEventById = async (id: string) => {
  const result = await prisma.event.findUnique({ where: { id } });
  return result;
};

const updateEvent = async (eventId: string, data: Partial<Event>) => {
  const eventInfo = await prisma.event.findUnique({
    where: { id: eventId },
  });
  if (!eventInfo) throw new ApiError(404, "Event not found");

  await prisma.event.update({ where: { id: eventId }, data });
  return;
};

const deleteEvent = async (eventId: string) => {
  const eventInfo = await prisma.event.findUnique({
    where: { id: eventId },
  });
  if (!eventInfo) throw new ApiError(404, "Event not found");

  await prisma.event.delete({ where: { id: eventId } });
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
  comment: string,
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

  await sendSingleNotification(
    eventInfo.userId,
    "New Event Comment",
    `${userInfo.firstName} left a comment on your event "${eventInfo.title}". Check it out!`,
    "EventComment",
    eventId,
    userId,
  );
  return;
};

const replyComment = async (
  userId: string,
  commentId: string,
  replyComment: string,
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

  await sendSingleNotification(
    commentInfo.userId,
    "New Reply to Your Comment",
    `${userInfo.firstName} just replied to your comment: "${commentInfo.comment}". Check it out!`,
    "EventComment",
    commentInfo.eventId,
    userId,
  );
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
  allEvents,
  liveEvents,
  getScheduleEvents,
  getFundingEvents,
  getMyEvents,
  usersEvent,
  usersRecording,
  allRecordings,
  followingEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  eventLikeUnlike,
  eventComment,
  replyComment,
  getEventComments,
  allEventsNonUser,
};

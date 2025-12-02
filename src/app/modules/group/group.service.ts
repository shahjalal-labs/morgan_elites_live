import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";
import { paginationHelper } from "../../../shared/pagination";
import { uploadInSpace } from "../../../helpers/uploadInSpace";
import { sendSingleNotification } from "../notification/notification.services";

const createGroup = async (
  data: any,
  creatorId: string,
  file: Express.Multer.File
) => {
  if (!file) throw new ApiError(400, "Please upload a group photo");

  const groupPhoto = await uploadInSpace(file, "group/images");

  await prisma.$transaction(async (tx) => {
    const group = await tx.group.create({
      data: {
        ...data,
        creatorId,
        photo: groupPhoto,
        isPublic: data.isPublic === "false" ? false : true,
      },
    });

    await tx.groupMember.create({
      data: {
        groupId: group.id,
        memberId: creatorId,
        status: "Joined",
      },
    });

    return;
  });
};

const discoverGroups = async (userId: string, query: any) => {
  const { search } = query;
  return await prisma.group.findMany({
    where: {
      groupMember: {
        none: {
          memberId: userId,
        },
      },
      ...(search && {
        groupName: {
          contains: search,
          mode: "insensitive",
        },
      }),
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      groupName: true,
      photo: true,
      isPublic: true,
      createdAt: true,
      _count: {
        select: {
          groupMember: true,
        },
      },
    },
  });
};

const joinedGroups = async (userId: string, query: any) => {
  const { search } = query;
  return await prisma.group.findMany({
    where: {
      groupMember: {
        some: {
          memberId: userId,
        },
      },
      ...(search && {
        groupName: {
          contains: search,
          mode: "insensitive",
        },
      }),
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      groupName: true,
      photo: true,
      isPublic: true,
      createdAt: true,
      _count: {
        select: {
          groupMember: true,
        },
      },
    },
  });
};

const joinGroup = async (memberId: string, groupId: string) => {
  await prisma.groupMember.create({
    data: {
      memberId,
      groupId,
      status: "Joined",
    },
  });
  return;
};

const leaveGroup = async (memberId: string, groupId: string) => {
  await prisma.groupMember.delete({
    where: {
      groupId_memberId: { groupId, memberId },
    },
  });
  return;
};

const deleteGroup = async (groupId: string, creatorId: string) => {
  const groupInfo = await prisma.group.findUnique({ where: { id: groupId } });
  if (!groupInfo) throw new ApiError(404, "Group not found");
  if (creatorId !== groupInfo.creatorId)
    throw new ApiError(403, "You cannot delete this group");

  await prisma.group.delete({ where: { id: groupId, creatorId } });
  return;
};

const updateGroup = async (
  groupId: string,
  userId: string,
  data: any,
  file: Express.Multer.File
) => {
  const groupInfo = await prisma.group.findUnique({ where: { id: groupId } });
  if (!groupInfo) throw new ApiError(404, "Group not found");
  if (userId !== groupInfo.creatorId)
    throw new ApiError(403, "You cannot update this group");

  let groupPhoto = groupInfo.photo;
  if (file !== undefined) {
    groupPhoto = await uploadInSpace(file, "group/images");
  }

  await prisma.group.update({
    where: { id: groupId },
    data: {
      ...data,
      isPublic: data.isPublic === "false" ? false : true || groupInfo?.isPublic,
      photo: groupPhoto,
    },
  });

  return;
};

const groupInfo = async (groupId: string, userId: string) => {
  const groupInfo = await prisma.group.findUnique({
    where: {
      id: groupId,
    },
    select: {
      id: true,
      groupName: true,
      photo: true,
      description: true,
      creatorId: true,
      groupPost: {
        select: {
          id: true,
          content: true,
          userId: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImage: true,
            },
          },
          _count: {
            select: {
              commentGroupPost: true,
              likeGroupPost: true,
            },
          },
          likeGroupPost: {
            where: {
              userId,
            },
            select: {
              id: true,
            },
          },
          createdAt: true,
        },
      },
    },
  });

  if (!groupInfo) throw new ApiError(404, "Group not found");

  // Transform: remove likeGroupPost and add isLike + isOwner
  // const transformedPosts = groupInfo.groupPost.map(
  //   ({ likeGroupPost, userId: postOwnerId, ...rest }) => ({
  //     ...rest,
  //     isLike: likeGroupPost.length > 0,
  //     isOwner: postOwnerId === userId, // post owner
  //   })
  // );

  // return {
  //   ...groupInfo,
  //   groupPost: transformedPosts,
  //   isOwner: groupInfo.creatorId === userId, // ✅ group owner check
  // };

  const transformedPosts = await Promise.all(
    groupInfo.groupPost.map(
      async ({ userId: postOwnerId, user, likeGroupPost, ...rest }) => {
        const follow = await prisma.follow.findUnique({
          where: {
            user1Id_user2Id: { user1Id: userId, user2Id: postOwnerId ?? "" },
          },
        });

        return {
          ...rest,
          user: {
            ...user,
            isFollow: !!follow,
          },
          isLike: likeGroupPost.length > 0,
          isOwner: postOwnerId === userId,
        };
      }
    )
  );

  return {
    ...groupInfo,
    groupPost: transformedPosts,
    isOwner: groupInfo.creatorId === userId,
  };
};

const postInfo = async (postId: string, userId: string) => {
  const post = await prisma.groupPost.findUnique({
    where: {
      id: postId,
    },
    select: {
      id: true,
      content: true,
      userId: true,
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profileImage: true,
        },
      },
      commentGroupPost: {
        select: {
          id: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          comment: true,
          replyCommentGroupPost: {
            select: {
              id: true,
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                },
              },
              replyComment: true,
              createdAt: true,
            },
          },
          createdAt: true,
        },
      },
      _count: {
        select: {
          commentGroupPost: true,
          likeGroupPost: true,
        },
      },
      likeGroupPost: {
        where: { userId },
        select: { id: true },
      },
      createdAt: true,
    },
  });

  if (!post) throw new ApiError(404, "Group post not found");

  // ✅ Convert like array → boolean
  const isLiked = post.likeGroupPost.length > 0;

  return {
    ...post,
    isLiked, // add boolean value
  };
};

const createGroupPost = async (
  userId: string,
  groupId: string,
  content: string
) => {
  await prisma.groupPost.create({
    data: {
      userId,
      groupId,
      content,
    },
  });
  return;
};

const deletePost = async (postId: string, userId: string) => {
  const postInfo = await prisma.groupPost.findUnique({ where: { id: postId } });
  if (!postInfo) throw new ApiError(404, "Post not found for delete");
  if (postInfo.userId !== userId)
    throw new ApiError(403, "You cannot delete this post");

  await prisma.groupPost.delete({ where: { id: postId, userId } });
  return;
};

const commentPost = async (postId: string, userId: string, comment: string) => {
  const userInfo = await prisma.user.findUnique({ where: { id: userId } });
  if (!userInfo) throw new ApiError(404, "User not found");

  const postInfo = await prisma.groupPost.findUnique({ where: { id: postId } });
  if (!postInfo) throw new ApiError(404, "Group post not found");

  await prisma.commentGroupPost.create({
    data: {
      userId: userInfo.id,
      postId: postInfo.id,
      comment,
    },
  });

  await sendSingleNotification(
    postInfo.userId,
    "Group post comment",
    `${userInfo.firstName} is commented your post`,
    "GroupComment",
    postId,
    userId
  );
  return;
};

const replyCommentPost = async (
  commentId: string,
  userId: string,
  replyComment: string
) => {
  const userInfo = await prisma.user.findUnique({ where: { id: userId } });
  if (!userInfo) throw new ApiError(404, "User not found");

  const commentInfo = await prisma.commentGroupPost.findUnique({
    where: { id: commentId },
  });
  if (!commentInfo) throw new ApiError(404, "Comment not found");

  await prisma.replyCommentGroupPost.create({
    data: {
      userId,
      commentId,
      replyComment,
    },
  });

  await sendSingleNotification(
    commentInfo.userId,
    "Reply your comment",
    `${userInfo.firstName} is reply your comment`,
    "GroupComment",
    commentInfo.postId,
    userId
  );
  return;
};

const likePost = async (postId: string, userId: string) => {
  const isExistLike = await prisma.likeGroupPost.findUnique({
    where: {
      postId_userId: { postId, userId },
    },
  });
  if (isExistLike) {
    await prisma.likeGroupPost.delete({
      where: {
        postId_userId: { postId, userId },
      },
    });
    return "Unliked this post";
  }
  await prisma.likeGroupPost.create({
    data: {
      userId,
      postId,
    },
  });
  return "Liked this post";
};

const allUsers = async (query: any, groupId: string) => {
  const search = query.search || "";
  const { page, limit, skip } = paginationHelper(query);

  const groupMembers = await prisma.groupMember.findMany({
    where: { groupId },
    select: { memberId: true },
  });
  const excludedUserIds = groupMembers.map((m) => m.memberId).filter(Boolean);

  const where: any = {
    id: { notIn: excludedUserIds },
  };

  if (search) {
    where.firstName = {
      contains: search,
      mode: "insensitive",
    };
  }

  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      profileImage: true,
      profession: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    skip,
  });
  const totalCount = await prisma.user.count({ where });
  const totalPages = Math.ceil(totalCount / limit);

  return {
    totalCount,
    totalPages,
    currentPage: page,
    users,
  };
};

const followUnfollow = async (user1Id: string, user2Id: string) => {
  const user1Info = await prisma.user.findUnique({ where: { id: user1Id } });
  if (!user1Info) throw new ApiError(404, "User not found");

  const user2Info = await prisma.user.findUnique({ where: { id: user2Id } });
  if (!user2Info) throw new ApiError(404, "User not found");

  const isFollow = await prisma.follow.findUnique({
    where: {
      user1Id_user2Id: { user1Id, user2Id },
    },
  });

  if (isFollow) {
    await prisma.follow.delete({
      where: {
        user1Id_user2Id: { user1Id, user2Id },
      },
    });
    return "Unfollow successfull";
  } else {
    await prisma.follow.create({
      data: {
        user1Id,
        user2Id,
      },
    });
    await sendSingleNotification(
      user2Id,
      `${user2Info.firstName} started following you`,
      `${user2Info.firstName} is now following your profile`,
      "Follow",
      user2Id,
      user1Id
    );
    return "Follow successfull";
  }
};

const myFollowing = async (userId: string, query: any) => {
  const { search } = query;
  const userInfo = await prisma.user.findUnique({ where: { id: userId } });
  if (!userInfo) throw new ApiError(404, "User not found");

  const searchTerms = search ? search.trim().split(/\s+/) : [];

  const followings = await prisma.follow.findMany({
    where: {
      user1Id: userId,
      ...(search && {
        user: {
          OR: [
            {
              AND: searchTerms.map((t: any) => ({
                OR: [
                  { firstName: { contains: t, mode: "insensitive" } },
                  { lastName: { contains: t, mode: "insensitive" } },
                ],
              })),
            },
            { firstName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
          ],
        },
      }),
    },
    select: {
      user1Id: true,
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profileImage: true,
          profession: true,
        },
      },
    },
  });
  return followings;
};

const myFollowers = async (userId: string, query: any) => {
  const { search } = query;
  const userInfo = await prisma.user.findUnique({ where: { id: userId } });
  if (!userInfo) throw new ApiError(404, "User not found");

  const searchTerms = search ? search.trim().split(/\s+/) : [];

  const followers = await prisma.follow.findMany({
    where: {
      user2Id: userId,
      ...(search && {
        user: {
          OR: [
            {
              AND: searchTerms.map((t: any) => ({
                OR: [
                  { firstName: { contains: t, mode: "insensitive" } },
                  { lastName: { contains: t, mode: "insensitive" } },
                ],
              })),
            },
            { firstName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
          ],
        },
      }),
    },
    select: {
      user1Id: true,
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profileImage: true,
          profession: true,
        },
      },
    },
  });
  return followers;
};

export const groupServices = {
  createGroup,
  discoverGroups,
  joinedGroups,
  joinGroup,
  leaveGroup,
  updateGroup,
  deleteGroup,
  createGroupPost,
  groupInfo,
  postInfo,
  commentPost,
  replyCommentPost,
  likePost,
  deletePost,
  allUsers,
  followUnfollow,
  myFollowing,
  myFollowers,
};

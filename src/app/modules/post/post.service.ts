import ApiError from "../../../errors/ApiErrors";
import { paginationHelper } from "../../../shared/pagination";
import prisma from "../../../shared/prisma";
import { sendSingleNotification } from "../notification/notification.services";
import { Post } from "@prisma/client";

const createPost = async (data: Post, userId: string) => {
  await prisma.$transaction(async (tx) => {
    await tx.post.create({
      data: {
        ...data,
        userId: userId,
      },
    });

    await tx.liveStreaming.updateMany({
      where: {
        recordingLink: data.recordedLink,
      },
      data: {
        isSharedPost: true,
      },
    });
  });

  return;
};

const allPosts = async (query: any, userId: string) => {
  const { page, limit, skip } = paginationHelper(query);
  const posts = await prisma.post.findMany({
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profession: true,
          profileImage: true,
        },
      },
      _count: {
        select: {
          PostLike: true,
          PostComment: true,
        },
      },
    },
    orderBy: { id: "desc" },
    skip,
    take: limit,
  });

  const totalCount = await prisma.post.count();
  const totalPages = Math.ceil(totalCount / limit);

  const postWithRelations = await Promise.all(
    posts.map(async (post) => {
      const isLiked = await prisma.postLike.findUnique({
        where: {
          postId_userId: { postId: post.id, userId },
        },
      });
      const isMyPost = post.userId === userId;
      const likeStatus = isLiked ? true : false;
      return {
        ...post,
        isLiked: likeStatus,
        isMyPost,
      };
    }),
  );

  return {
    posts: postWithRelations,
    currentPage: page,
    totalPages,
    totalCount,
  };
};

const myFollowingPosts = async (query: any, userId: string) => {
  const { page, limit, skip } = paginationHelper(query);
  const posts = await prisma.post.findMany({
    where: {
      user: {
        followersAsUser2: {
          some: {
            user1Id: userId,
          },
        },
      },
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profession: true,
          profileImage: true,
        },
      },
      _count: {
        select: {
          PostLike: true,
          PostComment: true,
        },
      },
    },
    orderBy: { id: "desc" },
    skip,
    take: limit,
  });

  const totalCount = await prisma.post.count();
  const totalPages = Math.ceil(totalCount / limit);

  const postWithRelations = await Promise.all(
    posts.map(async (post) => {
      const isLiked = await prisma.postLike.findUnique({
        where: {
          postId_userId: { postId: post.id, userId },
        },
      });
      const isMyPost = post.userId === userId;
      const likeStatus = isLiked ? true : false;
      return {
        ...post,
        isLiked: likeStatus,
        isMyPost,
      };
    }),
  );

  return {
    posts: postWithRelations,
    currentPage: page,
    totalPages,
    totalCount,
  };
};

const deletePost = async (postId: string, userId: string) => {
  const postInfo = await prisma.post.findUnique({ where: { id: postId } });
  if (!postInfo) throw new ApiError(404, "Post not found");
  if (userId !== postInfo.userId)
    throw new ApiError(403, "You cannot delete this post");

  await prisma.post.delete({ where: { id: postId } });
  return;
};

const updatePost = async (postId: string, data: Post, userId: string) => {
  const postInfo = await prisma.post.findUnique({ where: { id: postId } });
  if (!postInfo) throw new ApiError(404, "Post not found");
  if (userId !== postInfo.userId)
    throw new ApiError(403, "You cannot update this post");

  await prisma.post.update({
    where: { id: postId },
    data: data,
  });

  return;
};

const postInfo = async (postId: string, userId: string) => {
  const post = await prisma.post.findUnique({
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
          profession: true,
        },
      },
      PostComment: {
        select: {
          id: true,
          comment: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profession: true,
              profileImage: true,
            },
          },
          ReplyPostComment: {
            select: {
              id: true,
              replyComment: true,
              createdAt: true,
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  profession: true,
                  profileImage: true,
                },
              },
            },
          },
        },
      },
      _count: {
        select: {
          PostLike: true,
          PostComment: true,
        },
      },
      PostLike: {
        where: { userId },
        select: { id: true },
      },
      createdAt: true,
    },
  });

  if (!post) throw new ApiError(404, "Post not found");

  // ✅ Convert like array → boolean
  const isLiked = post.PostLike.length > 0;
  const isMyPost = post.userId === userId;

  return {
    ...post,
    isLiked,
    isMyPost,
  };
};

const commentPost = async (postId: string, userId: string, comment: string) => {
  const userInfo = await prisma.user.findUnique({ where: { id: userId } });
  if (!userInfo) throw new ApiError(404, "User not found");

  const postInfo = await prisma.post.findUnique({ where: { id: postId } });
  if (!postInfo) throw new ApiError(404, "Post not found");

  await prisma.postComment.create({
    data: {
      userId: userInfo.id,
      postId: postInfo.id,
      comment,
    },
  });

  await sendSingleNotification(
    postInfo.userId,
    "Post comment",
    `${userInfo.firstName} is commented your post`,
    "PostComment",
    postId,
    userId,
  );
  return;
};

const replyCommentPost = async (
  commentId: string,
  userId: string,
  replyComment: string,
) => {
  const userInfo = await prisma.user.findUnique({ where: { id: userId } });
  if (!userInfo) throw new ApiError(404, "User not found");

  const commentInfo = await prisma.postComment.findUnique({
    where: { id: commentId },
  });
  if (!commentInfo) throw new ApiError(404, "Comment not found");

  await prisma.replyPostComment.create({
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
    "PostComment",
    commentInfo.postId,
    userId,
  );
  return;
};

const likePost = async (postId: string, userId: string) => {
  const isExistLike = await prisma.postLike.findUnique({
    where: {
      postId_userId: { postId, userId },
    },
  });
  if (isExistLike) {
    await prisma.postLike.delete({
      where: {
        postId_userId: { postId, userId },
      },
    });
    return "Unliked this post";
  }
  await prisma.postLike.create({
    data: {
      userId,
      postId,
    },
  });
  return "Liked this post";
};

export const postServices = {
  createPost,
  allPosts,
  myFollowingPosts,
  updatePost,
  deletePost,
  postInfo,
  commentPost,
  replyCommentPost,
  likePost,
};

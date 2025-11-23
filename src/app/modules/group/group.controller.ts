import { groupServices } from "./group.service";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";

const createGroup = catchAsync(async (req, res) => {
  const result = await groupServices.createGroup(
    req.body,
    req.user.id,
    req.file as Express.Multer.File
  );
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "The group has been created successfully",
    data: result,
  });
});

const discoverGroups = catchAsync(async (req, res) => {
  const result = await groupServices.discoverGroups(req.user.id, req.query);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Discover groups has been retrived successfully",
    data: result,
  });
});

const joinedGroups = catchAsync(async (req, res) => {
  const result = await groupServices.joinedGroups(req.user.id, req.query);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Joined groups has been retrived successfully",
    data: result,
  });
});

const joinGroup = catchAsync(async (req, res) => {
  const result = await groupServices.joinGroup(req.user.id, req.params.groupId);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Joined the group successfully",
    data: result,
  });
});

const inviteGroup = catchAsync(async (req, res) => {
  await groupServices.joinGroup(req.params.userId, req.params.groupId);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Invited the group successfully",
  });
});

const leaveGroup = catchAsync(async (req, res) => {
  const result = await groupServices.leaveGroup(
    req.user.id,
    req.params.groupId
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Leave the group successfully",
    data: result,
  });
});

const updateGroup = catchAsync(async (req, res) => {
  const file = req.file as Express.Multer.File;
  const result = await groupServices.updateGroup(
    req.params.id,
    req.user.id,
    req.body,
    file
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "group has been updated successfully",
    data: result,
  });
});

const deleteGroup = catchAsync(async (req, res) => {
  await groupServices.deleteGroup(req.params.groupId, req.user.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "group has been deleted successfully",
  });
});

const createGroupPost = catchAsync(async (req, res) => {
  await groupServices.createGroupPost(
    req.user.id,
    req.params.groupId,
    req.body.content
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "group post has been created successfully",
  });
});

const groupInfo = catchAsync(async (req, res) => {
  const data = await groupServices.groupInfo(req.params.groupId, req.user.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Group info has been retrived successfully",
    data,
  });
});

const postInfo = catchAsync(async (req, res) => {
  const data = await groupServices.postInfo(req.params.postId, req.user.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Post info has been retrived successfully",
    data,
  });
});

const commentPost = catchAsync(async (req, res) => {
  await groupServices.commentPost(
    req.params.postId,
    req.user.id,
    req.body.comment
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "comment has been created this post successfully",
  });
});

const likePost = catchAsync(async (req, res) => {
  const data = await groupServices.likePost(req.params.postId, req.user.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: data,
  });
});

const replyCommentPost = catchAsync(async (req, res) => {
  await groupServices.replyCommentPost(
    req.params.commentId,
    req.user.id,
    req.body.replyComment
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Reply comment has been created this post successfully",
  });
});

const deletePost = catchAsync(async (req, res) => {
  await groupServices.deletePost(req.params.postId, req.user.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Post has been deleted successfully",
  });
});

const allUsers = catchAsync(async (req, res) => {
  const data = await groupServices.allUsers(req.query, req.params.groupId);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Users retrived successfully",
    data,
  });
});

const followUnfollow = catchAsync(async (req, res) => {
  const data = await groupServices.followUnfollow(
    req.params.userId,
    req.user.id
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: data,
  });
});

export const groupControllers = {
  createGroup,
  discoverGroups,
  joinedGroups,
  joinGroup,
  inviteGroup,
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
};

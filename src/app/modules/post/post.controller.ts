import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";
import { postServices } from "./post.service";

const createPost = catchAsync(async (req, res) => {
  const file = req.file as Express.Multer.File;
  const result = await postServices.createPost(req.body, req.user.id, file);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "The post has been created successfully",
    data: result,
  });
});

const allPosts = catchAsync(async (req, res) => {
  const data = await postServices.allPosts(req.query, req.user.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Posts has been retrived successfully",
    data,
  });
});

const myPosts = catchAsync(async (req, res) => {
  const data = await postServices.myPosts(req.query, req.user.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "My Posts has been retrived successfully",
    data,
  });
});

const myFollowingPosts = catchAsync(async (req, res) => {
  const data = await postServices.myFollowingPosts(req.query, req.user.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "My Following Posts has been retrived successfully",
    data,
  });
});

const updatePost = catchAsync(async (req, res) => {
  const result = await postServices.updatePost(
    req.params.postId,
    req.body,
    req.user.id,
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "post has been updated successfully",
    data: result,
  });
});

const deletePost = catchAsync(async (req, res) => {
  await postServices.deletePost(req.params.postId, req.user.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "post has been deleted successfully",
  });
});

const postInfo = catchAsync(async (req, res) => {
  const data = await postServices.postInfo(req.params.postId, req.user.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Post info has been retrived successfully",
    data,
  });
});

const commentPost = catchAsync(async (req, res) => {
  await postServices.commentPost(
    req.params.postId,
    req.user.id,
    req.body.comment,
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "comment has been created this post successfully",
  });
});

const likePost = catchAsync(async (req, res) => {
  const data = await postServices.likePost(req.params.postId, req.user.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: data,
  });
});

const replyCommentPost = catchAsync(async (req, res) => {
  await postServices.replyCommentPost(
    req.params.commentId,
    req.user.id,
    req.body.replyComment,
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Reply comment has been created this post successfully",
  });
});

export const postControllers = {
  createPost,
  allPosts,
  myPosts,
  myFollowingPosts,
  updatePost,
  deletePost,
  postInfo,
  commentPost,
  replyCommentPost,
  likePost,
};

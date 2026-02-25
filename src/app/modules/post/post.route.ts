import express from "express";
import { postControllers } from "./post.controller";
import auth from "../../middlewares/auth";
import { fileUploader } from "../../../helpers/fileUploader";
import { parseBodyData } from "../../middlewares/parseBodyData";

const router = express.Router();

router.post(
  "/create",
  auth(),
  fileUploader.thumbnail,
  parseBodyData,
  postControllers.createPost,
);
router.get("/all-posts", auth(), postControllers.allPosts);
router.get("/public-posts", postControllers.publicPosts);
router.get("/my-posts", auth(), postControllers.myPosts);
router.get("/following-posts", auth(), postControllers.myFollowingPosts);
router.get("/single-post/:postId", auth(), postControllers.postInfo);
router.patch("/:postId", auth(), postControllers.updatePost);
router.delete("/:postId", auth(), postControllers.deletePost);
router.post("/comment/:postId", auth(), postControllers.commentPost);
router.post("/like/:postId", auth(), postControllers.likePost);
router.post(
  "/reply-comment/:commentId",
  auth(),
  postControllers.replyCommentPost,
);
export const postRoute = router;

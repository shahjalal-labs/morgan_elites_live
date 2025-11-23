import { parseBodyData } from "./../../middlewares/parseBodyData";
import express from "express";
import { groupControllers } from "./group.controller";
import auth from "../../middlewares/auth";
import { fileUploader } from "../../../helpers/fileUploader";

const router = express.Router();

router.post(
  "/create",
  auth(),
  fileUploader.groupPhoto,
  parseBodyData,
  groupControllers.createGroup
);
router.get("/discover-groups", auth(), groupControllers.discoverGroups);
router.get("/joined-groups", auth(), groupControllers.joinedGroups);
router.post("/join-group/:groupId", auth(), groupControllers.joinGroup);
router.post(
  "/invite-group/:groupId/:userId",
  auth(),
  groupControllers.inviteGroup
);
router.delete("/leave-group/:groupId", auth(), groupControllers.leaveGroup);
router.get("/:groupId", auth(), groupControllers.groupInfo);
router.get("/postinfo/:postId", auth(), groupControllers.postInfo);
router.patch(
  "/:id",
  auth(),
  fileUploader.groupPhoto,
  parseBodyData,
  groupControllers.updateGroup
);
router.delete("/:groupId", auth(), groupControllers.deleteGroup);
router.post("/create/post/:groupId", auth(), groupControllers.createGroupPost);
router.delete("/post/:postId", auth(), groupControllers.deletePost);
router.post("/comment/post/:postId", auth(), groupControllers.commentPost);
router.post("/like/post/:postId", auth(), groupControllers.likePost);
router.post(
  "/reply-comment/post/:commentId",
  auth(),
  groupControllers.replyCommentPost
);
router.get("/all-users/invite/:groupId", auth(), groupControllers.allUsers);
router.post(
  "/follow-unfollow/:userId",
  auth(),
  groupControllers.followUnfollow
);
router.get("/my/following", auth(), groupControllers.myFollowing);

export const groupRoute = router;

# liveFullContent.md

## 🌲 Full Project Structure

```bash
/home/sj/web/smt_project/morgan_elites_live
├── bucket-policy.json
├── bun.lock
├── ecosystem.config.js
├── http-client.env.json
├── module.js
├── package.json
├── package-lock.json
├── prisma
│   └── schema.prisma
├── public
│   └── payment-success.html
├── README.md
├── src
│   ├── app
│   │   ├── interfaces
│   │   │   ├── common.ts
│   │   │   └── file.ts
│   │   ├── middlewares
│   │   │   ├── auth.ts
│   │   │   ├── globalErrorHandler.ts
│   │   │   ├── parseBodyData.ts
│   │   │   └── validateRequest.ts
│   │   ├── modules
│   │   │   ├── auth
│   │   │   │   ├── auth.api.http
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── authFullContent.md
│   │   │   │   ├── auth.routes.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   └── auth.validation.ts
│   │   │   ├── donation
│   │   │   │   ├── donation.controller.ts
│   │   │   │   ├── donation.routes.ts
│   │   │   │   ├── donation.service.ts
│   │   │   │   └── donation.validation.ts
│   │   │   ├── event
│   │   │   │   ├── event.api.http
│   │   │   │   ├── event.controller.ts
│   │   │   │   ├── eventFullContent.md
│   │   │   │   ├── event.routes.ts
│   │   │   │   ├── event.service.ts
│   │   │   │   └── event.validation.ts
│   │   │   ├── group
│   │   │   │   ├── group.controller.ts
│   │   │   │   ├── group.routes.ts
│   │   │   │   ├── group.service.ts
│   │   │   │   └── group.validation.ts
│   │   │   ├── live
│   │   │   │   ├── live.controller.ts
│   │   │   │   ├── live.routes.ts
│   │   │   │   ├── live.service.ts
│   │   │   │   └── live.validation.ts
│   │   │   ├── notification
│   │   │   │   ├── notification.controller.ts
│   │   │   │   ├── notification.route.ts
│   │   │   │   └── notification.services.ts
│   │   │   ├── polls
│   │   │   │   ├── polls.controller.ts
│   │   │   │   ├── polls.routes.ts
│   │   │   │   ├── polls.service.ts
│   │   │   │   └── polls.validation.ts
│   │   │   ├── post
│   │   │   │   ├── post.api.http
│   │   │   │   ├── post.controller.ts
│   │   │   │   ├── postFullContent.md
│   │   │   │   ├── post.route.ts
│   │   │   │   ├── post.service.ts
│   │   │   │   └── post.validation.ts
│   │   │   ├── socket
│   │   │   │   ├── language.ts
│   │   │   │   ├── socket.controller.ts
│   │   │   │   ├── socket.docs.md
│   │   │   │   ├── socketFullContent.md
│   │   │   │   ├── socket.interface.ts
│   │   │   │   └── socket.service.ts
│   │   │   ├── subscription
│   │   │   │   ├── subscription.controller.ts
│   │   │   │   ├── subscription.routes.ts
│   │   │   │   ├── subscription.service.ts
│   │   │   │   └── subscription.validation.ts
│   │   │   └── user
│   │   │       ├── user.controller.ts
│   │   │       ├── user.route.ts
│   │   │       ├── user.services.ts
│   │   │       └── user.validation.ts
│   │   └── routes
│   │       └── index.ts
│   ├── app.ts
│   ├── bullBoard.ts
│   ├── config
│   │   ├── index.ts
│   │   └── serviceAccount.ts
│   ├── errors
│   │   ├── ApiErrors.ts
│   │   ├── handleClientError.ts
│   │   ├── handleValidationError.ts
│   │   ├── handleZodError.ts
│   │   └── parsePrismaValidationError.ts
│   ├── helpers
│   │   ├── fileUploader.ts
│   │   ├── firebaseAdmin.ts
│   │   ├── forgetPasswordHtml.ts
│   │   ├── forgotPasswordLink.ts
│   │   ├── generateOtp.ts
│   │   ├── jwtHelpers.ts
│   │   ├── redis.ts
│   │   ├── sendEmail.ts
│   │   ├── stripe.ts
│   │   ├── uploadInSpace.ts
│   │   ├── verificationHtml.ts
│   │   └── zegoToken.ts
│   ├── interfaces
│   │   ├── common.ts
│   │   ├── error.ts
│   │   └── index.d.ts
│   ├── queues
│   │   └── emailQueue.ts
│   ├── server.ts
│   ├── shared
│   │   ├── catchAsync.ts
│   │   ├── pagination.ts
│   │   ├── pick.ts
│   │   ├── prisma.ts
│   │   ├── searchFilter.ts
│   │   └── sendResponse.ts
│   ├── todo.md
│   └── workers
│       └── emailWorker.ts
├── structure.md
├── tsconfig.json
├── uploads
│   └── google.png
└── vercel.json

28 directories, 106 files
```

## 📁 live Module Tree

```bash
/home/sj/web/smt_project/morgan_elites_live/src/app/modules/live
├── live.controller.ts
├── live.routes.ts
├── live.service.ts
└── live.validation.ts

1 directory, 4 files
```

## 📋 schema.prisma

```prisma
datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id                    String                  @id @default(auto()) @map("_id") @db.ObjectId
  firstName             String
  lastName              String
  email                 String                  @unique
  password              String
  fcmToken              String?
  profileImage          String?
  profession            String?
  bio                   String?
  dob                   DateTime?
  phoneNumber           String?
  address               String?
  stripeAccountId       String?
  customerId            String?
  isSubscribed          Boolean                 @default(false)
  plan                  PlanStatus              @default(NA)
  gender                Gender                  @default(Other)
  role                  UserRole                @default(User)
  status                UserStatus              @default(Active)
  createdAt             DateTime                @default(now())
  updatedAt             DateTime                @updatedAt
  Event                 Event[]
  EventLike             EventLike[]
  EventComment          EventComment[]
  ReplyComment          ReplyComment[]
  Group                 Group[]
  GroupMember           GroupMember[]
  GroupPost             GroupPost[]
  CommentGroupPost      CommentGroupPost[]
  ReplyCommentGroupPost ReplyCommentGroupPost[]
  LikeGroupPost         LikeGroupPost[]
  liveStreamings        LiveStreaming[]
  followersAsUser1      Follow[]                @relation("User1Follows")
  followersAsUser2      Follow[]                @relation("User2Follows")
  submitVotes           SubmitVote[]
  notifications         Notification[]
  posts                 Post[]
  postLikes             PostLike[]
  postComments          PostComment[]
  replyPostComments     ReplyPostComment[]

  @@map("users")
}

enum PlanStatus {
  NA
  Basic
  Premium
}

model PendingUser {
  id        String @id @default(auto()) @map("_id") @db.ObjectId
  firstName String
  lastName  String
  email     String @unique

  @@map("pending_users")
}

model Event {
  id           String         @id @default(auto()) @map("_id") @db.ObjectId
  userId       String         @db.ObjectId
  streamId     String         @db.ObjectId
  eventType    EventType      @default(Schedule)
  title        String
  text         String
  scheduleDate DateTime?
  payAmount    Float          @default(0)
  recordedLink String?
  createdAt    DateTime       @default(now())
  updatedAt    DateTime       @updatedAt
  user         User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  stream       LiveStreaming  @relation(fields: [streamId], references: [id], onDelete: Cascade)
  EventLike    EventLike[]
  EventComment EventComment[]
  donations    Donation[]

  @@map("events")
}

model EventLike {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  eventId   String   @db.ObjectId
  userId    String   @db.ObjectId
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  event     Event    @relation(fields: [eventId], references: [id], onDelete: Cascade)

  @@unique([eventId, userId])
  @@map("event_likes")
}

model EventComment {
  id           String         @id @default(auto()) @map("_id") @db.ObjectId
  eventId      String         @db.ObjectId
  userId       String         @db.ObjectId
  comment      String
  createdAt    DateTime       @default(now())
  updatedAt    DateTime       @updatedAt
  user         User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  event        Event          @relation(fields: [eventId], references: [id], onDelete: Cascade)
  ReplyComment ReplyComment[]

  @@map("event_comments")
}

model ReplyComment {
  id           String       @id @default(auto()) @map("_id") @db.ObjectId
  userId       String       @db.ObjectId
  commentId    String       @db.ObjectId
  replyComment String
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt
  user         User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  eventComment EventComment @relation(fields: [commentId], references: [id], onDelete: Cascade)

  @@map("comment_replies")
}

model Group {
  id          String        @id @default(auto()) @map("_id") @db.ObjectId
  creatorId   String?       @db.ObjectId
  groupName   String
  description String
  photo       String
  isPublic    Boolean       @default(true)
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  creator     User?         @relation(fields: [creatorId], references: [id], onDelete: Cascade)
  groupMember GroupMember[]
  groupPost   GroupPost[]

  @@map("groups")
}

model GroupMember {
  id        String      @id @default(auto()) @map("_id") @db.ObjectId
  groupId   String?     @db.ObjectId
  memberId  String?     @db.ObjectId
  status    GroupStatus @default(Invited)
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt
  member    User?       @relation(fields: [memberId], references: [id], onDelete: Cascade)
  group     Group?      @relation(fields: [groupId], references: [id], onDelete: Cascade)

  @@unique([groupId, memberId])
  @@map("group_members")
}

model GroupPost {
  id               String             @id @default(auto()) @map("_id") @db.ObjectId
  groupId          String             @db.ObjectId
  userId           String             @db.ObjectId
  content          String
  createdAt        DateTime           @default(now())
  updatedAt        DateTime           @updatedAt
  user             User               @relation(fields: [userId], references: [id], onDelete: Cascade)
  group            Group              @relation(fields: [groupId], references: [id], onDelete: Cascade)
  commentGroupPost CommentGroupPost[]
  likeGroupPost    LikeGroupPost[]

  @@map("group_posts")
}

model CommentGroupPost {
  id                    String                  @id @default(auto()) @map("_id") @db.ObjectId
  userId                String                  @db.ObjectId
  postId                String                  @db.ObjectId
  comment               String
  createdAt             DateTime                @default(now())
  updatedAt             DateTime                @updatedAt
  user                  User                    @relation(fields: [userId], references: [id], onDelete: Cascade)
  groupPost             GroupPost               @relation(fields: [postId], references: [id], onDelete: Cascade)
  replyCommentGroupPost ReplyCommentGroupPost[]

  @@map("group_post_comments")
}

model ReplyCommentGroupPost {
  id           String            @id @default(auto()) @map("_id") @db.ObjectId
  userId       String?           @db.ObjectId
  commentId    String?           @db.ObjectId
  replyComment String
  createdAt    DateTime          @default(now())
  updatedAt    DateTime          @updatedAt
  user         User?             @relation(fields: [userId], references: [id], onDelete: Cascade)
  comment      CommentGroupPost? @relation(fields: [commentId], references: [id], onDelete: Cascade)

  @@map("group_post_comments_replies")
}

model LikeGroupPost {
  id        String     @id @default(auto()) @map("_id") @db.ObjectId
  userId    String?    @db.ObjectId
  postId    String?    @db.ObjectId
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  user      User?      @relation(fields: [userId], references: [id], onDelete: Cascade)
  groupPost GroupPost? @relation(fields: [postId], references: [id], onDelete: Cascade)

  @@unique([postId, userId])
  @@map("group_post_likes")
}

model Follow {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  user1Id   String   @db.ObjectId
  user2Id   String   @db.ObjectId
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user1     User     @relation("User1Follows", fields: [user1Id], references: [id], onDelete: Cascade)
  user2     User     @relation("User2Follows", fields: [user2Id], references: [id], onDelete: Cascade)

  @@unique([user1Id, user2Id])
  @@map("follows")
}

model LiveStreaming {
  id            String   @id @default(auto()) @map("_id") @db.ObjectId
  userId        String   @db.ObjectId
  taskId        String?
  hostLink      String
  coHostLink    String
  audienceLink  String
  recordingLink String?
  watchCount    Int      @default(0)
  isLive        Boolean  @default(true)
  isEventLive   Boolean  @default(true)
  isFree        Boolean  @default(false)
  isSharedPost  Boolean  @default(false)
  bannedUsers   String[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  events        Event[]

  @@map("live_streamings")
}

model Polls {
  id          String       @id @default(auto()) @map("_id") @db.ObjectId
  userId      String       @db.ObjectId
  streamId    String       @unique @db.ObjectId
  question    String
  options     String[]
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  submitVotes SubmitVote[]

  @@map("polls")
}

model SubmitVote {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  userId    String   @db.ObjectId
  pollsId   String   @db.ObjectId
  option    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  polls     Polls    @relation(fields: [pollsId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, pollsId])
  @@map("submit_votes")
}

model Donation {
  id         String        @id @default(auto()) @map("_id") @db.ObjectId
  userId     String        @db.ObjectId
  eventId    String        @db.ObjectId
  paymentFor PaymentFor    @default(Funding)
  status     DonatinStatus @default(Pending)
  amount     Float         @default(0)
  method     PaymentMethod @default(Card)
  createdAt  DateTime      @default(now())
  updatedAt  DateTime      @updatedAt
  event      Event         @relation(fields: [eventId], references: [id], onDelete: Cascade)

  @@map("donations")
}

model Subscription {
  id             String   @id @default(auto()) @map("_id") @db.ObjectId
  subscriptionId String   @unique
  userId         String   @unique @db.ObjectId
  plan           String
  platform       Platform
  isActive       Boolean  @default(false)
  expiryAt       DateTime
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@map("subscriptions")
}

model Notification {
  id        String           @id @default(auto()) @map("_id") @db.ObjectId
  userId    String           @db.ObjectId
  senderId  String?          @db.ObjectId
  type      NotificationType @default(NA)
  handlerId String?
  title     String
  body      String
  isRead    Boolean          @default(false)
  createdAt DateTime         @default(now())
  updatedAt DateTime         @updatedAt
  sender    User?            @relation(fields: [senderId], references: [id], onDelete: Cascade)

  @@map("notifications")
}

model Moderator {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  userId      String   @db.ObjectId
  moderatorId String   @db.ObjectId
  slowMode    Int      @default(0) //in seconds
  isBanned    Boolean  @default(false)
  isSubOnly   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([userId, moderatorId])
  @@map("moderators")
}

model Post {
  id           String        @id @default(auto()) @map("_id") @db.ObjectId
  userId       String        @db.ObjectId
  thumbnail    String?
  content      String
  recordedLink String
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
  user         User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  PostLike     PostLike[]
  PostComment  PostComment[]

  @@map("posts")
}

model PostLike {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  postId    String   @db.ObjectId
  userId    String   @db.ObjectId
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)

  @@unique([postId, userId])
  @@map("post_likes")
}

model PostComment {
  id               String             @id @default(auto()) @map("_id") @db.ObjectId
  postId           String             @db.ObjectId
  userId           String             @db.ObjectId
  comment          String
  createdAt        DateTime           @default(now())
  updatedAt        DateTime           @updatedAt
  user             User               @relation(fields: [userId], references: [id], onDelete: Cascade)
  post             Post               @relation(fields: [postId], references: [id], onDelete: Cascade)
  ReplyPostComment ReplyPostComment[]

  @@map("post_comments")
}

model ReplyPostComment {
  id           String      @id @default(auto()) @map("_id") @db.ObjectId
  userId       String      @db.ObjectId
  commentId    String      @db.ObjectId
  replyComment String
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt
  user         User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  postComment  PostComment @relation(fields: [commentId], references: [id], onDelete: Cascade)

  @@map("post_comment_replies")
}

enum Platform {
  IOS
  Android
  Web
}

enum NotificationType {
  NA
  AccountVerified
  EventComment
  GroupComment
  PostComment
  Follow
  Donation
  Subscription
  JoinAccess
  LiveStreaming
  PasswordChange
  PasswordReset
  Payout
}

enum PaymentFor {
  Funding
  Event
}

enum PaymentMethod {
  Card
  ApplePay
  GPay
}

enum DonatinStatus {
  Pending
  Completed
}

enum GroupStatus {
  Invited
  Joined
}

enum EventType {
  Schedule
  Funding
}

enum UserStatus {
  Active
  Blocked
  Deleted
  Banned
}

enum UserRole {
  User
  Admin
}

enum Gender {
  Other
  Male
  Female
}
```

## 📦 package.json

```json
{
  "name": "elites_live",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "concurrently \"node ./dist/server.js\" \"node ./dist/workers/emailWorker.js\"",
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "concurrently \"ts-node-dev --respawn --transpile-only src/server.ts\" \"ts-node-dev --respawn --transpile-only src/workers/emailWorker.ts\"",
    "build": "tsc",
    "postinstall": "prisma generate"
  },
  "keywords": [],
  "author": "Ruhul-Amin",
  "license": "ISC",
  "description": "elites_live",
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/fluent-ffmpeg": "^2.1.28",
    "@types/node": "^20.14.11",
    "@types/nodemailer": "^6.4.17",
    "@types/ws": "^8.18.1",
    "concurrently": "^9.2.1",
    "prisma": "^6.3.0",
    "ts-node": "^10.9.2",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.5.3"
  },
  "dependencies": {
    "@aws-sdk/client-s3": "^3.837.0",
    "@aws-sdk/lib-storage": "^3.837.0",
    "@bull-board/express": "^6.13.0",
    "@prisma/client": "^6.3.0",
    "@types/jsonwebtoken": "^9.0.6",
    "@types/multer": "^1.4.11",
    "axios": "^1.13.6",
    "bcryptjs": "^2.4.3",
    "bullmq": "^5.59.0",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "express-basic-auth": "^1.2.1",
    "ffmpeg-static": "^5.3.0",
    "firebase-admin": "^13.6.0",
    "fluent-ffmpeg": "^2.1.3",
    "http-status": "^1.7.4",
    "ioredis": "^5.8.0",
    "jsonwebtoken": "^9.0.2",
    "mongodb": "^6.8.0",
    "multer": "^1.4.5-lts.1",
    "node-cron": "^3.0.3",
    "nodemailer": "^6.9.16",
    "nodemon": "^3.1.4",
    "stripe": "^20.0.0",
    "ws": "^8.18.3",
    "zod": "^3.23.8"
  }
}
```

## 🔧 live.routes.ts

```ts
import express from "express";
import { liveControllers } from "./live.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/generate-token", auth(), liveControllers.generateToken);
router.post("/create/streaming", auth(), liveControllers.createLiveStreaming);
router.get("/get/streaming/:streamId", auth(), liveControllers.getStreamInfo);
router.post(
  "/start/streaming/:streamId",
  auth(),
  liveControllers.startLiveStreaming,
);
router.post(
  "/close/streaming/:streamId",
  auth(),
  liveControllers.closeLiveStreaming,
);
router.post(
  "/start/recording/:streamId",
  auth(),
  liveControllers.startRecording,
);
router.post("/stop/recording/:streamId", auth(), liveControllers.stopRecording);
router.get(
  "/retrive/recording/:streamId",
  auth(),
  liveControllers.recordLinkRetrieve,
);
router.patch(
  "/watch-count/:streamId",
  auth(),
  liveControllers.watchCountUpdate,
);

router.get("/top-influencers/live", auth(), liveControllers.topInfluencersLive);

router.post("/ban/user/live/:streamId", auth(), liveControllers.banUser);
router.post("/trim-video/:streamId", liveControllers.trimVideo);
// router.post("/webhook/recording", liveControllers.recordingWebhook);

export const liveRoutes = router;
```

## 🛠️ live.service.ts

```ts
import { LiveStreaming } from "@prisma/client";
import ApiError from "../../../errors/ApiErrors";
import { generateZegoToken } from "../../../helpers/zegoToken";
import prisma from "../../../shared/prisma";
import crypto from "crypto";
import config from "../../../config";
import { Request, Response } from "express";
import { S3Client, PutObjectAclCommand } from "@aws-sdk/client-s3";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import ffmpegPath from "ffmpeg-static";
import axios from "axios";
import os from "os";
import { uploadFileFromPath } from "../../../helpers/uploadInSpace";

ffmpeg.setFfmpegPath(ffmpegPath as string);

const downloadVideo = async (
  url: string,
  outputPath: string,
): Promise<void> => {
  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  await new Promise<void>((resolve, reject) => {
    const writer = fs.createWriteStream(outputPath);

    response.data.pipe(writer);

    writer.on("finish", resolve);
    writer.on("error", reject);
    response.data.on("error", reject);
  });
};

const processTrimVideo = async (
  inputPath: string,
  outputPath: string,
  startTime: number,
  endTime: number,
): Promise<any> => {
  const duration = endTime - startTime;

  await new Promise<any>((resolve, reject) => {
    ffmpeg(inputPath)
      .setStartTime(startTime)
      .setDuration(duration)
      .outputOptions(["-movflags +faststart"])
      .output(outputPath)
      .on("end", resolve)
      .on("error", reject)
      .run();
  });
};

const s3Client = new S3Client({
  endpoint: "https://atl1.digitaloceanspaces.com",
  region: config.bucket.region!,
  credentials: {
    accessKeyId: config.bucket.access_key_id!,
    secretAccessKey: config.bucket.secret_key_id!,
  },
  forcePathStyle: false,
});

const generateToken = async (userId: string, roomId: string) => {
  console.log(userId);
  const token = generateZegoToken(
    Number(process.env.ZEGO_APP_ID),
    userId,
    process.env.ZEGO_SERVER_SECRET!,
    3600, // 1 hour validity
    { room_id: roomId },
  );

  return {
    token,
  };
};

const createLiveStreaming = async (userId: string, payload: LiveStreaming) => {
  const userInfo = await prisma.user.findUnique({ where: { id: userId } });
  if (!userInfo) throw new ApiError(404, "User not found");

  const streamInfo = await prisma.liveStreaming.create({
    data: {
      ...payload,
      userId,
      isEventLive: false,
      isFree: true,
      isLive: true,
    },
  });
  return streamInfo;
};

const getStreamInfo = async (streamId: string, userId: string) => {
  const streamInfo = await prisma.liveStreaming.findUnique({
    where: { id: streamId, userId },
  });

  if (!streamInfo)
    throw new ApiError(404, "This streaming closed by only the Host");

  return streamInfo;
};

const startLiveStreaming = async (
  streamId: string,
  userId: string,
  payload: LiveStreaming,
) => {
  const streamInfo = await prisma.liveStreaming.findUnique({
    where: { id: streamId, userId },
  });
  if (!streamInfo)
    throw new ApiError(404, "This streaming started by only the Host");

  if (streamInfo.isLive) return;

  await prisma.liveStreaming.update({
    where: {
      id: streamId,
      userId,
    },
    data: {
      ...payload,
      isLive: true,
    },
  });

  return;
};

const closeLiveStreaming = async (
  streamId: string,
  userId: string,
  isHost: boolean = false,
) => {
  const streamInfo = await prisma.liveStreaming.findUnique({
    where: { id: streamId, userId },
  });
  if (!streamInfo && isHost === false)
    // throw new ApiError(404, "This streaming closed by only the Host");
    return;
  if (streamInfo?.isLive === false)
    throw new ApiError(400, "This streaming already ended");

  await prisma.liveStreaming.update({
    where: {
      id: streamId,
    },
    data: {
      isLive: false,
    },
  });
  return;
};

const startRecording = async (streamId: string, userId: string) => {
  const streamInfo = await prisma.liveStreaming.findUnique({
    where: { id: streamId, userId },
  });
  if (!streamInfo)
    throw new ApiError(404, "This streaming recorded by only the Host");
  if (!streamInfo.isLive)
    throw new ApiError(400, "This streaming not started yet");
  if (streamInfo.taskId)
    throw new ApiError(400, "This streaming already recording started");

  const generateSignature = (timestamp: number, nonce: string) => {
    const s = `${config.zego.app_id}${nonce}${config.zego.server_secret}${timestamp}`;
    return crypto.createHash("md5").update(s).digest("hex");
  };

  const buildCommonParams = () => {
    const timestamp = Math.floor(Date.now() / 1000);
    const nonce = crypto.randomBytes(8).toString("hex");
    return {
      AppId: config.zego.app_id,
      Timestamp: timestamp,
      SignatureNonce: nonce,
      SignatureVersion: "2.0" as const,
      Signature: generateSignature(timestamp, nonce),
    };
  };

  const common = buildCommonParams();

  const params = {
    ...common,
    Action: "StartRecord",
  };

  const body = {
    RoomId: streamInfo.id,
    RecordInputParams: {
      RecordMode: 1, // or 1 for single stream
      StreamType: 3, // audio + video
      MaxIdleTime: 60,
      // MixConfig: {
      //   MixMode: 2,
      //   MixOutputStreamId: "mix",
      //   MixOutputVideoConfig: {
      //     Width: 2560,
      //     Height: 1080,
      //     Fps: 15,
      //     Bitrate: 2000,
      //   },
      // },
    },
    RecordOutputParams: {
      OutputFileFormat: "mp4",
      OutputFolder: "record/",
      CallbackUrl:
        "https://api.elites-livestream.com/api/v1/live/webhook/recording",
    },
    StorageParams: {
      Vendor: 10,
      Region: config.bucket.region!,
      Bucket: config.bucket.bucket_name!,
      AccessKeyId: config.bucket.access_key_id!,
      AccessKeySecret: config.bucket.secret_key_id!,
      EndPoint: "https://atl1.digitaloceanspaces.com",
    },
  };

  // const body = {
  //   RoomId: streamInfo.id,
  //   RecordInputParams: {
  //     RecordMode: 1, // or 1 for single stream
  //     StreamType: 3, // audio + video
  //     MaxIdleTime: 60,
  //   },
  //   RecordOutputParams: {
  //     OutputFileFormat: "mp4",
  //     OutputFolder: "record/",
  //     CallbackUrl:
  //       "https://api.morgan.smtsigma.com/api/v1/live/webhook/recording",
  //   },
  //   StorageParams: {
  //     Vendor: 1,
  //     Region: "us-east-2",
  //     Bucket: "fixzone-app-storage",
  //     AccessKeyId: "AKIA_DUMMY_KEY_PLACEHOLDER",
  //     AccessKeySecret: "AWS_DUMMY_SECRET_PLACEHOLDER",
  //     EndPoint: "https://fixzone-app-storage.s3.us-east-2.amazonaws.com",
  //     ACL: "public-read",
  //   },
  // };

  try {
    const response = await axios.post("https://cloudrecord-api.zego.im", body, {
      params,
      headers: { "Content-Type": "application/json" },
    });
    const data = response.data;
    if (data.Code !== 0) {
      throw new ApiError(500, `ZEGOCLOUD start record failed: ${data.Message}`);
    }

    const taskId = data.Data.TaskId;

    await prisma.liveStreaming.update({
      where: { id: streamId },
      data: { taskId },
    });

    return taskId;
  } catch (err) {
    console.error("StartRecord error:", err);
    throw err;
  }
};

const stopRecording = async (streamId: string, userId: string) => {
  const streamInfo = await prisma.liveStreaming.findUnique({
    where: { id: streamId, userId },
  });
  if (!streamInfo)
    throw new ApiError(404, "This streaming recorded by only the Host");

  const generateSignature = (timestamp: number, nonce: string) => {
    const s = `${config.zego.app_id}${nonce}${config.zego.server_secret}${timestamp}`;
    return crypto.createHash("md5").update(s).digest("hex");
  };

  const buildCommonParams = () => {
    const timestamp = Math.floor(Date.now() / 1000);
    const nonce = crypto.randomBytes(8).toString("hex");
    return {
      AppId: config.zego.app_id,
      Timestamp: timestamp,
      SignatureNonce: nonce,
      SignatureVersion: "2.0" as const,
      Signature: generateSignature(timestamp, nonce),
    };
  };

  const common = buildCommonParams();

  const body = {
    TaskId: streamInfo.taskId,
  };

  const params = {
    ...common,
    Action: "StopRecord",
  };

  try {
    const response = await axios.post("https://cloudrecord-api.zego.im", body, {
      params,
      headers: { "Content-Type": "application/json" },
    });
    const data = response.data;
    console.log(data.Code);

    if (data.Code !== 0) {
      throw new ApiError(500, `ZEGOCLOUD stop record failed: ${data.Message}`);
    }

    // const linkResponse = await axios.post(
    //   "https://cloudrecord-api.zego.im",
    //   body,
    //   {
    //     params: params2,
    //     headers: { "Content-Type": "application/json" },
    //   }
    // );
    // const linkData = linkResponse.data;
    // if (linkData.Code === 0 && linkData.Data.RecordFileList.length > 0) {
    //   await prisma.liveStreaming.update({
    //     where: { id: streamId },
    //     data: { recordingLink: linkData.Data.RecordFileList[0].FileUrl },
    //   });
    // }
    return response.data;
  } catch (err) {
    console.error("StopRecord error:", err);
    throw err;
  }
};

const recordingWebhook = async (req: Request, _res: Response) => {
  console.log("Recording Webhook Payload:", req.body);
  const roomId = req.body.room_id;
  if (req.body.event === "stream_create") {
    await prisma.liveStreaming.update({
      where: {
        id: roomId,
      },
      data: {
        isLive: true,
      },
    });
    return;
  } else if (req.body.event === "stream_close") {
    await prisma.liveStreaming.update({
      where: {
        id: roomId,
      },
      data: {
        isLive: false,
      },
    });
    return;
  } else if (req.body.event_type === 1) {
    const fileInfo = req.body.detail.file_info;
    console.log("fileinfo", fileInfo);

    // Make recording file public
    if (fileInfo && fileInfo[0]?.file_url) {
      try {
        const fileUrl = fileInfo[0].file_url;
        const urlParts = new URL(fileUrl);
        const filePath = urlParts.pathname.substring(1); // Remove leading slash

        const command = new PutObjectAclCommand({
          Bucket: config.bucket.bucket_name!,
          Key: filePath,
          ACL: "public-read",
        });

        await s3Client.send(command);
        console.log("File set to public:", filePath);
      } catch (error) {
        console.error("Error setting file to public:", error);
      }

      await prisma.liveStreaming.update({
        where: {
          id: roomId,
        },
        data: {
          recordingLink: req.body.detail.file_info[0].file_url,
        },
      });
    }
    await prisma.liveStreaming.update({
      where: {
        id: roomId,
      },
      data: {
        recordingLink: req.body.detail.file_info[0].file_url,
      },
    });
  }
  return;
};

const recordLinkRetrieve = async (streamId: string) => {
  const streamInfo = await prisma.liveStreaming.findUnique({
    where: { id: streamId },
  });
  if (!streamInfo)
    throw new ApiError(404, "This streaming recorded by only the Host");

  const generateSignature = (timestamp: number, nonce: string) => {
    const s = `${config.zego.app_id}${nonce}${config.zego.server_secret}${timestamp}`;
    return crypto.createHash("md5").update(s).digest("hex");
  };

  const buildCommonParams = () => {
    const timestamp = Math.floor(Date.now() / 1000);
    const nonce = crypto.randomBytes(8).toString("hex");
    return {
      AppId: config.zego.app_id,
      Timestamp: timestamp,
      SignatureNonce: nonce,
      SignatureVersion: "2.0" as const,
      Signature: generateSignature(timestamp, nonce),
    };
  };

  const common = buildCommonParams();

  const params = {
    ...common,
    Action: "DescribeRecordStatus",
  };

  const body = {
    TaskId: streamInfo.taskId,
  };

  try {
    const response = await axios.post("https://cloudrecord-api.zego.im", body, {
      params,
      headers: { "Content-Type": "application/json" },
    });
    const data = response.data;
    console.log(data);

    return response.data;
  } catch (err) {
    console.error("StopRecord error:", err);
    throw err;
  }
};

const watchCountUpdate = async (
  streamId: string,
  watchCount: number,
  userId: string,
) => {
  const streamInfo = await prisma.liveStreaming.findUnique({
    where: { id: streamId, userId },
  });
  if (!streamInfo) throw new ApiError(404, "Streaming not found");

  await prisma.liveStreaming.update({
    where: { id: streamId, userId },
    data: { watchCount: watchCount },
  });
  return;
};

const topInfluencersLive = async () => {
  const topInfluencers = await prisma.liveStreaming.findMany({
    where: {
      isLive: true,
      // events: {
      //   some: {
      //     eventType: "Schedule",
      //   },
      // },
    },
    orderBy: { watchCount: "desc" },
    take: 10,
    select: {
      watchCount: true,
      audienceLink: true,
      events: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
  return topInfluencers;
};

const banUser = async (
  streamId: string,
  userId: string,
  bannedUserId: string,
) => {
  const streamInfo = await prisma.liveStreaming.findUnique({
    where: { id: streamId },
  });
  if (!streamInfo) throw new ApiError(404, "Streaming not found");

  const moderatorInfo = await prisma.moderator.findUnique({
    where: {
      userId_moderatorId: { userId: streamInfo.userId, moderatorId: userId },
    },
  });

  if (!moderatorInfo)
    throw new ApiError(403, "You are not authorized to ban users");

  if (!moderatorInfo.isBanned) {
    throw new ApiError(403, "You are not allowed to ban users");
  }

  const now = Date.now();
  const lastUpdated = moderatorInfo.updatedAt.getTime();
  const slowModeMs = moderatorInfo.slowMode * 1000;

  if (now < lastUpdated + slowModeMs) {
    throw new ApiError(
      429,
      "You are in slow mode. Please wait before banning another user.",
    );
  }

  if (streamInfo.bannedUsers.includes(bannedUserId))
    throw new ApiError(400, "User already banned");

  await prisma.$transaction(async (tx) => {
    await tx.liveStreaming.update({
      where: { id: streamId },
      data: { bannedUsers: { push: bannedUserId } },
    });

    await tx.moderator.update({
      where: {
        userId_moderatorId: { userId: streamInfo.userId, moderatorId: userId },
      },
      data: {
        updatedAt: new Date(),
      },
    });
  });
  return;
};

const trimVideo = async (
  streamId: string,
  startTime: number,
  endTime: number,
): Promise<any> => {
  if (startTime < 0 || endTime <= startTime) {
    throw new ApiError(400, "Invalid trim range");
  }

  const streamInfo = await prisma.liveStreaming.findUnique({
    where: { id: streamId },
  });

  if (!streamInfo) {
    throw new ApiError(404, "Streaming not found");
  }

  if (!streamInfo.recordingLink) {
    throw new ApiError(400, "Recording link not found");
  }

  const tempDir = os.tmpdir();
  const fileName = `trim-${streamId}-${Date.now()}.mp4`;
  const inputPath = path.join(tempDir, `input-${fileName}`);
  const outputPath = path.join(tempDir, fileName);

  try {
    await downloadVideo(streamInfo.recordingLink, inputPath);
    await processTrimVideo(inputPath, outputPath, startTime, endTime);

    const uploadedUrl = await uploadFileFromPath(outputPath, "record");

    await prisma.liveStreaming.update({
      where: { id: streamId },
      data: {
        recordingLink: uploadedUrl,
      },
    });

    return {
      success: true,
      url: uploadedUrl,
    };
  } catch (error) {
    console.error("trimVideo error:", error);
    throw new ApiError(500, "Failed to trim video");
  } finally {
    if (fs.existsSync(inputPath)) {
      fs.unlinkSync(inputPath);
    }
    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
    }
  }
};

export const liveServices = {
  generateToken,
  createLiveStreaming,
  getStreamInfo,
  startLiveStreaming,
  closeLiveStreaming,
  startRecording,
  stopRecording,
  recordLinkRetrieve,
  watchCountUpdate,
  topInfluencersLive,
  recordingWebhook,
  banUser,
  trimVideo,
};
```

## 🎮 live.controller.ts

```ts
import { liveServices } from "./live.service";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";

const generateToken = catchAsync(async (req, res) => {
  console.log(req.user.id);
  const token = await liveServices.generateToken(req.user.id, "1000");
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Token generated success",
    data: token,
  });
});

const createLiveStreaming = catchAsync(async (req, res) => {
  const streamInfo = await liveServices.createLiveStreaming(
    req.user.id,
    req.body,
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Live streaming created successfully",
    data: streamInfo,
  });
});

const getStreamInfo = catchAsync(async (req, res) => {
  const data = await liveServices.getStreamInfo(
    req.params.streamId,
    req.user.id,
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Live streaming info retrived successfully",
    data,
  });
});

const closeLiveStreaming = catchAsync(async (req, res) => {
  await liveServices.closeLiveStreaming(
    req.params.streamId,
    req.user.id,
    req.body.isHost,
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Live streaming ended successfully",
  });
});

const startLiveStreaming = catchAsync(async (req, res) => {
  await liveServices.startLiveStreaming(
    req.params.streamId,
    req.user.id,
    req.body,
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Live streaming started successfully",
  });
});

const startRecording = catchAsync(async (req, res) => {
  const data = await liveServices.startRecording(
    req.params.streamId,
    req.user.id,
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Live streaming recording started successfully",
    data,
  });
});

const stopRecording = catchAsync(async (req, res) => {
  const data = await liveServices.stopRecording(
    req.params.streamId,
    req.user.id,
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Live streaming recording stopped successfully",
    data,
  });
});

const recordLinkRetrieve = catchAsync(async (req, res) => {
  const data = await liveServices.recordLinkRetrieve(req.params.streamId);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Live streaming recording link retrieved successfully",
    data,
  });
});

const watchCountUpdate = catchAsync(async (req, res) => {
  const data = await liveServices.watchCountUpdate(
    req.params.streamId,
    req.body.watchCount,
    req.user.id,
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Live streaming watch count updated successfully",
    data,
  });
});

const topInfluencersLive = catchAsync(async (req, res) => {
  const data = await liveServices.topInfluencersLive();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Top influencers live streams retrieved successfully",
    data,
  });
});

export const recordingWebhookController = catchAsync(async (req, res) => {
  const data = await liveServices.recordingWebhook(req, res);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Recording webhook received successfully",
    data,
  });
});

const banUser = catchAsync(async (req, res) => {
  await liveServices.banUser(
    req.params.streamId,
    req.user.id,
    req.body.banUserId,
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User banned successfully",
  });
});

const trimVideo = catchAsync(async (req, res) => {
  const { startTime, endTime } = req.body;
  const data = await liveServices.trimVideo(
    req.params.streamId,
    startTime,
    endTime,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Video trimmed successfully",
    data,
  });
});

export const liveControllers = {
  generateToken,
  createLiveStreaming,
  getStreamInfo,
  startLiveStreaming,
  closeLiveStreaming,
  startRecording,
  stopRecording,
  recordLinkRetrieve,
  watchCountUpdate,
  topInfluencersLive,
  banUser,
  recordingWebhookController,
  trimVideo,
};
```

## 📝 live.validation.ts

```ts
import * as z from "zod";

export const createLiveSchema = z.object({
  // Define fields
  name: z.string(),
});

export const LiveSchemaValidation = {
  createLiveSchema,
};
```

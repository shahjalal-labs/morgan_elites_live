# postFullContent.md

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
│   │   │   │   ├── post.controller.ts
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

28 directories, 104 files
```

## 📁 post Module Tree

```bash
/home/sj/web/smt_project/morgan_elites_live/src/app/modules/post
├── post.controller.ts
├── post.route.ts
├── post.service.ts
└── post.validation.ts

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

## 🎮 post.controller.ts

```ts
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

const publicPosts = catchAsync(async (req, res) => {
  const data = await postServices.publicPosts(req.query);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Public Posts has been retrived successfully",
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
  publicPosts,
  myPosts,
  myFollowingPosts,
  updatePost,
  deletePost,
  postInfo,
  commentPost,
  replyCommentPost,
  likePost,
};
```

## 🛠️ post.service.ts

```ts
import ApiError from "../../../errors/ApiErrors";
import { uploadInSpace } from "../../../helpers/uploadInSpace";
import { paginationHelper } from "../../../shared/pagination";
import prisma from "../../../shared/prisma";
import { sendSingleNotification } from "../notification/notification.services";
import { Post, Prisma } from "@prisma/client";

const createPost = async (
  data: Post,
  userId: string,
  file: Express.Multer.File,
) => {
  let thumbnail: string;
  if (file) {
    thumbnail = await uploadInSpace(file, "post-thumbnails");
  }
  await prisma.$transaction(async (tx) => {
    await tx.post.create({
      data: {
        ...data,
        userId: userId,
        thumbnail: thumbnail ? thumbnail : undefined,
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
  const { page, limit, skip, search } = paginationHelper(query);

  const searchTerm = search?.trim();
  let whereClause: Prisma.PostWhereInput = {};

  if (searchTerm) {
    const words = searchTerm.split(" ").filter(Boolean);

    if (words.length >= 2) {
      whereClause = {
        OR: [
          {
            AND: [
              {
                user: {
                  firstName: {
                    contains: words[0],
                    mode: Prisma.QueryMode.insensitive,
                  },
                },
              },
              {
                user: {
                  lastName: {
                    contains: words[1],
                    mode: Prisma.QueryMode.insensitive,
                  },
                },
              },
            ],
          },
          {
            content: {
              contains: searchTerm,
              mode: Prisma.QueryMode.insensitive,
            },
          },
        ],
      };
    } else {
      whereClause = {
        OR: [
          {
            content: {
              contains: searchTerm,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            user: {
              firstName: {
                contains: searchTerm,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          },
          {
            user: {
              lastName: {
                contains: searchTerm,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          },
        ],
      };
    }
  }

  const posts = await prisma.post.findMany({
    where: whereClause,
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

  const totalCount = await prisma.post.count({ where: whereClause });
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

const publicPosts = async (query: any) => {
  const { page, limit, skip, search } = paginationHelper(query);
  const searchTerm = search?.trim();

  let whereClause: Prisma.PostWhereInput = {};

  if (searchTerm) {
    const words = searchTerm.split(" ").filter(Boolean);

    if (words.length >= 2) {
      whereClause = {
        OR: [
          {
            AND: [
              {
                user: {
                  firstName: {
                    contains: words[0],
                    mode: Prisma.QueryMode.insensitive,
                  },
                },
              },
              {
                user: {
                  lastName: {
                    contains: words[1],
                    mode: Prisma.QueryMode.insensitive,
                  },
                },
              },
            ],
          },
          {
            content: {
              contains: searchTerm,
              mode: Prisma.QueryMode.insensitive,
            },
          },
        ],
      };
    } else {
      whereClause = {
        OR: [
          {
            content: {
              contains: searchTerm,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            user: {
              firstName: {
                contains: searchTerm,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          },
          {
            user: {
              lastName: {
                contains: searchTerm,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          },
        ],
      };
    }
  }

  const posts = await prisma.post.findMany({
    where: whereClause,
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

  const totalCount = await prisma.post.count({ where: whereClause });
  const totalPages = Math.ceil(totalCount / limit);

  const postWithRelations = await Promise.all(
    posts.map(async (post) => {
      return {
        ...post,
        isLiked: false,
        isMyPost: false,
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

const myPosts = async (query: any, userId: string) => {
  const { page, limit, skip } = paginationHelper(query);
  const posts = await prisma.post.findMany({
    where: { userId },
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

  const totalCount = await prisma.post.count({ where: { userId } });
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

  const totalCount = await prisma.post.count({
    where: {
      user: {
        followersAsUser2: {
          some: {
            user1Id: userId,
          },
        },
      },
    },
  });
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
  publicPosts,
  myPosts,
  myFollowingPosts,
  updatePost,
  deletePost,
  postInfo,
  commentPost,
  replyCommentPost,
  likePost,
};
```

## 🔧 post.route.ts

```ts
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
```

## 📝 post.validation.ts

```ts
import * as z from "zod";

export const createGroupSchema = z.object({
  // Define fields
  name: z.string(),
});

export const GroupSchemaValidation = {
  createGroupSchema,
};
```

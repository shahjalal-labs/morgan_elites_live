# authFullContent.md

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
│   │   │   │   ├── auth.controller.ts
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
│   └── workers
│       └── emailWorker.ts
├── tsconfig.json
├── uploads
│   └── google.png
└── vercel.json

28 directories, 99 files
```

## 📁 auth Module Tree

```bash
/home/sj/web/smt_project/morgan_elites_live/src/app/modules/auth
├── auth.controller.ts
├── auth.routes.ts
├── auth.service.ts
└── auth.validation.ts

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

## 📝 auth.validation.ts

```ts
import { z } from "zod";

const authLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const googleLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  fcmToken: z.string().optional(),
});

const locationUpdateSchema = z.object({
  latitude: z
    .number()
    .min(-90, "Latitude must be greater than or equal to -90")
    .max(90, "Latitude must be less than or equal to 90"),
  longitude: z
    .number()
    .min(-180, "Longitude must be greater than or equal to -180")
    .max(180, "Longitude must be less than or equal to 180"),
});

const updateProfileSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    profession: z.string().optional(),
    bio: z.string().max(1000, "Bio too long"),
    dob: z.preprocess(
      (v) => (typeof v === "string" || v instanceof Date ? new Date(v) : v),
      z.date(),
    ),
    phoneNumber: z.string(),
    address: z.string(),
    gender: z.enum(["Male", "Female", "Other"]),
  })
  .partial();

export const authValidation = {
  updateProfileSchema,
  authLoginSchema,
  googleLoginSchema,
  locationUpdateSchema,
};
```

## 🔧 auth.routes.ts

```ts
import express from "express";
import { authController } from "./auth.controller";
import validateRequest from "../../middlewares/validateRequest";
import { authValidation } from "./auth.validation";
import auth from "../../middlewares/auth";
import { fileUploader } from "../../../helpers/fileUploader";
import { parseBodyData } from "../../middlewares/parseBodyData";

const router = express.Router();

router.post(
  "/login",
  validateRequest(authValidation.authLoginSchema),
  authController.loginUser,
);
router.post(
  "/google-login",
  validateRequest(authValidation.googleLoginSchema),
  authController.googleLogin,
);
router.get("/profile", auth(), authController.myProfile);
router.patch(
  "/update/user-location",
  auth(),
  validateRequest(authValidation.locationUpdateSchema),
  authController.userLocationUpdateInRedis,
);
router.post("/send-otp", authController.sendForgotPasswordOtp);
router.post("/verify-otp", authController.verifyForgotPasswordOtpCode);
router.patch("/reset-password", auth(), authController.resetPassword);
router.patch("/change-password", auth(), authController.changePassword);
router.patch(
  "/profile",
  auth(),
  fileUploader.profileImage,
  parseBodyData,
  validateRequest(authValidation.updateProfileSchema),
  authController.updateProfile,
);
router.delete("/delete-account", auth(), authController.deleteAccount);
router.post("/logged-out", auth(), authController.logoutAccount);
router.get("/user-list", auth(), authController.userList);
router.post("/add-moderator/:userId", auth(), authController.addModerator);

export const authRoute = router;
```

## 🎮 auth.controller.ts

```ts
import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { authService } from "./auth.service";
import sendResponse from "../../../shared/sendResponse";

//login user
const loginUser = catchAsync(async (req, res) => {
  const result = await authService.loginUserIntoDB(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User successfully logged in",
    data: result,
  });
});

//google login
const googleLogin = catchAsync(async (req, res) => {
  const result = await authService.googleLogin(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Google login has been successfull",
    data: result,
  });
});

//update user location
const userLocationUpdateInRedis = catchAsync(async (req, res) => {
  const { id } = req.user;
  await authService.userLocationUpdateInRedis(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Your location updated successfully",
  });
});

//send forgot password otp
const sendForgotPasswordOtp = catchAsync(
  async (req: Request, res: Response) => {
    const email = req.body.email as string;
    const response = await authService.sendForgotPasswordOtpDB(email);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "OTP send successfully",
      data: response,
    });
  },
);

// verify forgot password otp code
const verifyForgotPasswordOtpCode = catchAsync(
  async (req: Request, res: Response) => {
    const payload = req.body;
    const response = await authService.verifyForgotPasswordOtpCodeDB(payload);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "OTP verified successfully.",
      data: response,
    });
  },
);

// update forgot password
const resetPassword = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { newPassword } = req.body;
  const result = await authService.resetForgotPasswordDB(newPassword, userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Password updated successfully.",
    data: result,
  });
});

const changePassword = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { newPassword, oldPassword } = req.body;
  await authService.changePassword(oldPassword, newPassword, userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Password changed successfully.",
  });
});

// get profile for logged in user
const myProfile = catchAsync(async (req, res) => {
  const { id } = req.user;
  const user = await authService.myProfile(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Your profile has been retrieved successfully",
    data: user,
  });
});

// update user profile only logged in user
const updateProfile = catchAsync(async (req, res) => {
  const { id } = req.user;
  const file = req.file as Express.Multer.File;
  await authService.updateProfileIntoDB(id, req.body, file);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Your profile has been updated successfully",
  });
});

const deleteAccount = catchAsync(async (req, res) => {
  const userId = req.user.id;
  await authService.deleteAccount(userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Account deleted successfully.",
  });
});

const logoutAccount = catchAsync(async (req, res) => {
  const userId = req.user.id;
  await authService.logoutAccount(userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Account logged out successfully.",
  });
});

const userList = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const data = await authService.userList(userId, req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User list retrived successfully.",
    data,
  });
});

const addModerator = catchAsync(async (req, res) => {
  const userId = req.user.id;
  await authService.addModerator(userId, req.params.userId, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Moderator added successfully.",
  });
});

export const authController = {
  loginUser,
  googleLogin,
  myProfile,
  updateProfile,
  userLocationUpdateInRedis,
  sendForgotPasswordOtp,
  verifyForgotPasswordOtpCode,
  resetPassword,
  changePassword,
  deleteAccount,
  logoutAccount,
  userList,
  addModerator,
};
```

## 🛠️ auth.service.ts

```ts
import prisma from "../../../shared/prisma";
import bcrypt from "bcryptjs";
import ApiError from "../../../errors/ApiErrors";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import config from "../../../config";
import { User, Prisma } from "@prisma/client";
import redisClient from "../../../helpers/redis";
import { uploadInSpace } from "../../../helpers/uploadInSpace";
import { sendSingleNotification } from "../notification/notification.services";
import { emailQueue } from "../../../queues/emailQueue";

//login user
const loginUserIntoDB = async (payload: {
  email: string;
  password: string;
  fcmToken?: string;
}) => {
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (!user) throw new ApiError(404, "User not found");

  const isPasswordValid = await bcrypt.compare(
    payload.password,
    user?.password,
  );

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  await prisma.user.update({
    where: {
      email: payload.email,
    },
    data: {
      fcmToken: payload.fcmToken,
    },
  });

  const isSetup =
    user.firstName !== null &&
    user.lastName !== null &&
    user.profession !== null &&
    user.bio !== null &&
    user.phoneNumber !== null &&
    user.gender !== "Other" &&
    user.dob !== null &&
    user.address !== null;

  const accessToken = jwtHelpers.generateToken(
    { id: user.id, email: user.email, role: user.role },
    config.jwt.jwt_secret as string,
    config.jwt.expires_in as string,
  );

  return {
    accessToken,
    id: user.id,
    role: user.role,
    isSetup: isSetup,
  };
};

//google login
const googleLogin = async (payload: {
  email: string;
  firstName: string;
  lastName: string;
  fcmToken?: string;
}) => {
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (user) {
    const accessToken = jwtHelpers.generateToken(
      { id: user.id, email: user.email, role: user.role },
      config.jwt.jwt_secret as string,
      config.jwt.expires_in as string,
    );

    const isSetup =
      user.firstName !== null &&
      user.lastName !== null &&
      user.profession !== null &&
      user.bio !== null &&
      user.phoneNumber !== null &&
      user.gender !== "Other" &&
      user.dob !== null &&
      user.address !== null;

    return {
      accessToken,
      id: user.id,
      role: user.role,
      isSetup: isSetup,
    };
  }

  const newUser = await prisma.user.create({
    data: {
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      password: "",
      fcmToken: payload.fcmToken,
    },
  });

  const accessToken = jwtHelpers.generateToken(
    { id: newUser.id, email: newUser.email, role: newUser.role },
    config.jwt.jwt_secret as string,
    config.jwt.expires_in as string,
  );

  return {
    accessToken,
    id: newUser.id,
    role: newUser.role,
    isSetup: false,
  };
};

// update or add user location in Redis using GEO
const userLocationUpdateInRedis = async (
  userId: string,
  userLocation: { longitude: number; latitude: number },
) => {
  const redisGeoKey = "userLocations"; // you can keep all users under one key

  // Use GEOADD to store location
  await redisClient.geoadd(
    redisGeoKey,
    userLocation.longitude,
    userLocation.latitude,
    userId,
  );

  return;
};

//send forgot password otp
const sendForgotPasswordOtpDB = async (email: string) => {
  const existringUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (!existringUser) {
    throw new ApiError(404, "User not found");
  }
  // Generate OTP and expiry time
  // const otp = generateOTP(); // 4-digit OTP

  // await emailQueue.add("forgotPasswordOtp", {
  //   email: email,
  //   firstName: existringUser.firstName,
  //   otp,
  // });

  // await redisClient.set(`otp:${email}`, otp, "EX", 300);

  // return otp;
  const forgetToken = jwtHelpers.generateToken(
    { id: existringUser.id, email },
    config.jwt.jwt_secret as string,
    "5m",
  );

  await emailQueue.add("forgotPasswordLink", {
    email: email,
    firstName: existringUser.firstName,
    link: `https://elites-livestream.com/reset-password?token=${forgetToken}`,
  });
  return;
};

// verify otp code
const verifyForgotPasswordOtpCodeDB = async (payload: {
  email: string;
  otp: string;
}) => {
  const { email, otp } = payload;

  const user = await prisma.user.findUnique({ where: { email: email } });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const userId = user.id;

  const savedOtp = await redisClient.get(`otp:${email}`);
  if (!savedOtp) {
    throw new ApiError(400, "Invalid or expired OTP.");
  }

  if (otp !== savedOtp) {
    throw new ApiError(401, "Invalid OTP.");
  }

  // 2️⃣ Delete OTP from Redis after successful verification
  await redisClient.del(`otp:${email}`);

  const forgetToken = jwtHelpers.generateToken(
    { id: userId, email },
    config.jwt.jwt_secret as string,
    "5m",
  );

  return { forgetToken };
};

// reset password
const resetForgotPasswordDB = async (newPassword: string, userId: string) => {
  const existingUser = await prisma.user.findUnique({ where: { id: userId } });
  if (!existingUser) {
    throw new ApiError(404, "user not found");
  }
  const email = existingUser.email as string;
  const hashedPassword = await bcrypt.hash(
    newPassword,
    Number(config.jwt.gen_salt),
  );

  await prisma.user.update({
    where: {
      email: email,
    },
    data: {
      password: hashedPassword,
    },
  });

  await sendSingleNotification(
    userId,
    "Password Reset",
    "Your password was reset successfully. If this wasn’t you, please secure your account immediately.",
    "PasswordReset",
  );

  return;
};

// get profile for logged in user
const myProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      profileImage: true,
      email: true,
      profession: true,
      address: true,
      gender: true,
      dob: true,
      bio: true,
      _count: {
        select: {
          Event: true,
        },
      },
      stripeAccountId: true,
    },
  });
  if (!user) {
    throw new ApiError(404, "user not found!");
  }

  const followingCount = await prisma.follow.count({
    where: {
      user1Id: userId,
    },
  });

  const followersCount = await prisma.follow.count({
    where: {
      user2Id: userId,
    },
  });

  const isSubscribed = await prisma.subscription.findUnique({
    where: { userId },
  });

  return {
    ...user,
    followingCount,
    followersCount,
    isSubscribed: !!isSubscribed,
    subscribeType: isSubscribed ? isSubscribed.plan : null,
  };
};

// update user profile only logged in user
const updateProfileIntoDB = async (
  userId: string,
  userData: User,
  file: Express.Multer.File,
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new ApiError(404, "user not found for edit user");

  let profileImage;
  if (file) {
    profileImage = await uploadInSpace(file, "users/profileImage");
  }
  await prisma.user.update({
    where: { id: userId },
    data: {
      ...userData,
      profileImage: file ? profileImage : user.profileImage,
    },
  });

  return;
};

const changePassword = async (
  oldPassword: string,
  newPassword: string,
  userId: string,
) => {
  const existingUser = await prisma.user.findUnique({ where: { id: userId } });
  if (!existingUser) {
    throw new ApiError(404, "user not found");
  }

  const isPasswordValid = await bcrypt.compare(
    oldPassword,
    existingUser?.password,
  );

  if (!isPasswordValid) {
    throw new ApiError(401, "Your old password is wrong!");
  }

  const hashedPassword = await bcrypt.hash(
    newPassword,
    Number(config.jwt.gen_salt),
  );

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hashedPassword,
    },
  });

  await sendSingleNotification(
    userId,
    "Password Updated",
    "Your password was changed successfully. If this wasn’t you, please secure your account immediately.",
    "PasswordChange",
  );
  return;
};

const deleteAccount = async (userId: string) => {
  const userInfo = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!userInfo) throw new ApiError(404, "User not found for delete");

  await prisma.user.delete({ where: { id: userId } });
  return;
};

const logoutAccount = async (userId: string) => {
  const userInfo = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!userInfo) throw new ApiError(404, "User not found for log out");

  await prisma.user.update({
    where: { id: userId },
    data: {
      fcmToken: null,
    },
  });
  return;
};

const userList = async (userId: string, query?: { search?: string }) => {
  const { search } = query || {};
  const userInfo = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!userInfo) throw new ApiError(404, "User not found");

  const followingEntries = await prisma.follow.findMany({
    where: { user1Id: userId },
    select: { user2Id: true },
  });
  const excludedIds = followingEntries.map((f) => f.user2Id).concat(userId);

  let searchFilter: Prisma.UserWhereInput = {};
  if (search) {
    const words = search.split(" ").filter(Boolean); // split by spaces
    searchFilter = {
      AND: words.map((word) => ({
        OR: [
          { firstName: { contains: word, mode: "insensitive" } },
          { lastName: { contains: word, mode: "insensitive" } },
        ],
      })),
    };
  }

  const users = await prisma.user.findMany({
    where: {
      id: { notIn: excludedIds },
      ...searchFilter,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      profileImage: true,
      profession: true,
    },
  });

  const usersWithFollowers = await Promise.all(
    users.map(async (user) => {
      const totalFollowers = await prisma.follow.count({
        where: { user2Id: user.id },
      });
      return { ...user, totalFollowers };
    }),
  );

  return usersWithFollowers;
};

const addModerator = async (
  userId: string,
  moderatorId: string,
  payload: {
    isBanned: boolean;
    isSubOnly: boolean;
    slowMode: number;
  },
) => {
  const userInfo = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!userInfo) throw new ApiError(404, "User not found");
  const moderatorInfo = await prisma.user.findUnique({
    where: { id: moderatorId },
  });
  if (!moderatorInfo) throw new ApiError(404, "Moderator user not found");

  await prisma.moderator.create({
    data: {
      userId: userId,
      moderatorId: moderatorId,
      isBanned: payload.isBanned,
      isSubOnly: payload.isSubOnly,
      slowMode: payload.slowMode,
    },
  });

  return;
};

export const authService = {
  loginUserIntoDB,
  googleLogin,
  myProfile,
  updateProfileIntoDB,
  userLocationUpdateInRedis,
  sendForgotPasswordOtpDB,
  verifyForgotPasswordOtpCodeDB,
  resetForgotPasswordDB,
  changePassword,
  deleteAccount,
  logoutAccount,
  userList,
  addModerator,
};
```

# eventFullContent.md

## 🌲 Full Project Structure

```bash
/home/sj/web/smt_project/morgan_elites_live
├── bucket-policy.json
├── bun.lock
├── ecosystem.config.js
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

28 directories, 97 files
```

## 📁 event Module Tree

```bash
/home/sj/web/smt_project/morgan_elites_live/src/app/modules/event
├── event.api.http
├── event.controller.ts
├── event.routes.ts
├── event.service.ts
└── event.validation.ts

1 directory, 5 files
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

## 🎮 event.controller.ts

```ts
import { eventServices } from "./event.service";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";

const createEvent = catchAsync(async (req, res) => {
  const { hostLink, coHostLink, audienceLink } = req.body;
  await eventServices.createEvent(
    req.body,
    req.user.id,
    hostLink,
    coHostLink,
    audienceLink,
  );
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "The event has been created successfully",
  });
});

const allEvents = catchAsync(async (req, res) => {
  const result = await eventServices.allEvents(req.user.id, req.query);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "All events has been retrived successfully",
    data: result,
  });
});

const allEventsNonUser = catchAsync(async (req, res) => {
  const result = await eventServices.allEventsNonUser(req.query);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "All events has been retrived successfully",
    data: result,
  });
});

const liveEvents = catchAsync(async (req, res) => {
  const result = await eventServices.liveEvents(req.user.id, req.query);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "All live events has been retrived successfully",
    data: result,
  });
});

const getScheduleEvents = catchAsync(async (req, res) => {
  const result = await eventServices.getScheduleEvents(req.user.id, req.query);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "All schedule events has been retrived successfully",
    data: result,
  });
});

const getFundingEvents = catchAsync(async (req, res) => {
  const result = await eventServices.getFundingEvents(req.user.id, req.query);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "All funding events has been retrived successfully",
    data: result,
  });
});

const getMyEvents = catchAsync(async (req, res) => {
  const result = await eventServices.getMyEvents(req.user.id, req.query);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "My All schedule events has been retrived successfully",
    data: result,
  });
});

const usersEvent = catchAsync(async (req, res) => {
  const result = await eventServices.usersEvent(
    req.params.id,
    req.query,
    req.user.id,
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User's schedule events has been retrived successfully",
    data: result,
  });
});

const usersRecording = catchAsync(async (req, res) => {
  const result = await eventServices.usersRecording(req.params.userId);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User's recording events has been retrived successfully",
    data: result,
  });
});

const myRecordings = catchAsync(async (req, res) => {
  const result = await eventServices.usersRecording(req.user.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "My recording events has been retrived successfully",
    data: result,
  });
});

const allRecordings = catchAsync(async (req, res) => {
  const result = await eventServices.allRecordings();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "All recording events has been retrived successfully",
    data: result,
  });
});

const followingEvents = catchAsync(async (req, res) => {
  const result = await eventServices.followingEvents(req.user.id, req.query);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message:
      "All schedule events base on following has been retrived successfully",
    data: result,
  });
});

const getEventById = catchAsync(async (req, res) => {
  const result = await eventServices.getEventById(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "event has been retrived successfully",
    data: result,
  });
});

const updateEvent = catchAsync(async (req, res) => {
  await eventServices.updateEvent(req.params.eventId, req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "event has been updated successfully",
  });
});

const deleteEvent = catchAsync(async (req, res) => {
  await eventServices.deleteEvent(req.params.eventId);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "event has been deleted successfully",
  });
});

const eventLikeUnlike = catchAsync(async (req, res) => {
  const result = await eventServices.eventLikeUnlike(
    req.user.id,
    req.params.eventId,
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: result,
  });
});

const eventComment = catchAsync(async (req, res) => {
  await eventServices.eventComment(
    req.user.id,
    req.params.eventId,
    req.body.comment,
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Comment created successfully",
  });
});

const replyComment = catchAsync(async (req, res) => {
  await eventServices.replyComment(
    req.user.id,
    req.params.commentId,
    req.body.replyComment,
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Reply Comment created successfully",
  });
});

const getEventComments = catchAsync(async (req, res) => {
  const data = await eventServices.getEventComments(
    req.user.id,
    req.params.eventId,
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Event comments retrived successfully",
    data,
  });
});

export const eventControllers = {
  createEvent,
  allEvents,
  liveEvents,
  getScheduleEvents,
  getFundingEvents,
  getMyEvents,
  myRecordings,
  allRecordings,
  usersEvent,
  usersRecording,
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
```

## 🛠️ event.service.ts

```ts
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
```

## 🔧 event.routes.ts

```ts
import express from "express";
import { eventControllers } from "./event.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/", auth(), eventControllers.createEvent);
router.get("/schedule/event", auth(), eventControllers.getScheduleEvents);
router.get("/all/event", auth(), eventControllers.allEvents);
router.get("/all/event/non-user", eventControllers.allEventsNonUser);
router.get("/all/recording", auth(), eventControllers.allRecordings);
router.get("/live/event", auth(), eventControllers.liveEvents);
router.get("/funding/event", auth(), eventControllers.getFundingEvents);
router.get("/my/event", auth(), eventControllers.getMyEvents);
router.get("/my/recording", auth(), eventControllers.myRecordings);
router.get("/user/event/:id", auth(), eventControllers.usersEvent);
router.get("/user/recording/:userId", auth(), eventControllers.usersRecording);
router.get("/schedule/event", auth(), eventControllers.getScheduleEvents);
router.get("/following/event", auth(), eventControllers.followingEvents);
router.get("/:id", eventControllers.getEventById);
router.patch("/:eventId", auth(), eventControllers.updateEvent);
router.delete("/:eventId", auth(), eventControllers.deleteEvent);
router.post("/like-unlike/:eventId", auth(), eventControllers.eventLikeUnlike);
router.post("/comment/:eventId", auth(), eventControllers.eventComment);
router.post("/reply-comment/:commentId", auth(), eventControllers.replyComment);
router.get("/comment/:eventId", auth(), eventControllers.getEventComments);

export const eventRoutes = router;
```

## 📝 event.validation.ts

```ts
import * as z from "zod";

export const createEventSchema = z.object({
  // Define fields
  name: z.string(),
});

export const EventSchemaValidation = {
  createEventSchema,
};
```

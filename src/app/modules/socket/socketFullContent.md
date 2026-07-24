# socketFullContent.md

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

28 directories, 95 files
```

## 📁 socket Module Tree

```bash
/home/sj/web/smt_project/morgan_elites_live/src/app/modules/socket
├── language.ts
├── socket.controller.ts
├── socket.interface.ts
└── socket.service.ts

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

## 📄 language.ts

```ts
export const badWordsBase = [
  "xxx",
  "nsfw",
  "porn",
  "porno",
  "pornographic",
  "pornstar",
  "adult",
  "erotic",
  "nude",
  "nudity",
  "naked",
  "sex",
  "sexual",
  "fetish",
  "bdsm",
  "kink",
  "strip",
  "stripper",
  "stripclub",
  "escort",
  "prostitute",
  "brothel",
  "camgirl",
  "camboy",
  "onlyfans",
  "explicit",
  "lust",
  "lewd",
  "fuck",
  "fucked",
  "fucker",
  "fucking",
  "fuckface",
  "fuckhead",
  "fuckboy",
  "fuckoff",
  "fuckwit",
  "shit",
  "shitty",
  "shithead",
  "shitface",
  "shitstorm",
  "bullshit",
  "horseshit",
  "dogshit",
  "bitch",
  "bitches",
  "bitchy",
  "bastard",
  "motherfucker",
  "motherfucking",
  "ass",
  "asshole",
  "asshat",
  "asswipe",
  "assclown",
  "assfuck",
  "assfucker",
  "damn",
  "dammit",
  "goddamn",
  "crap",
  "dick",
  "piss",
  "pissed",
  "pissing",
  "pisshead",
  "bollocks",
  "slut",
  "whore",
  "hooker",
  "horny",
  "dirty",
  "sensual",
  "aroused",
  "playboy",
  "playgirl",
  "milf",
  "gilf",
  "lingerie",
  "harlot",
  "incest",
  "taboo",
  "nudist",
  "voyeur",
  "peepshow",
  "lapdance",
  "sugarbaby",
  "sugardaddy",
  "swinger",
  "adulttoy",
  "dominatrix",
  "cunt",
  "prick",
  "jerk",
  "jerkoff",
  "wanker",
  "tosser",
  "twat",
  "skank",
  "hoe",
  "thot",
  "douche",
  "douchebag",
  "dumbass",
  "jackass",
  "scumbag",
  "moron",
  "idiot",
  "dipshit",
  "loser",
  "creep",
  "pervert",
  "screw",
  "screwed",
  "screwing",
  "bang",
  "banged",
  "banging",
  "blowjob",
  "handjob",
  "rimjob",
  "cum",
  "cumming",
  "cumshot",
  "orgasm",
  "hardcore",
  "booty",
  "boobs",
  "tits",
  "titfuck",
  "doggystyle",
  "deepthroat",
  "69",
];

export const badWordRegex = new RegExp(
  badWordsBase
    .map((word) =>
      word
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&") // escape regex chars
        .split("")
        .join("[\\-*#_]?"),
    )
    .join("|"),
  "i",
);
```

## 📄 socket.interface.ts

```ts
export interface CustomWebSocket extends WebSocket {
  userId?: string;
}
```

## 🎮 socket.controller.ts

```ts
import { WebSocket, WebSocketServer } from "ws";
import { Request } from "express";
import { verifyWebSocketToken } from "./socket.service";
import { parse } from "url";
import prisma from "../../../shared/prisma";
import { badWordRegex } from "./language";

interface CustomWebSocket extends WebSocket {
  userId?: string;
}

const connectedUsers = new Map<string, CustomWebSocket>();
const connectedEvents = new Map<string, Set<string>>();
const connectedStreams = new Map<string, Set<string>>();
const userStatus = new Map<number, { warning: number; banned: boolean }>();
let wss;

export function setupWebSocketServer(server: any) {
  wss = new WebSocketServer({ server });

  wss.on("connection", async (ws: CustomWebSocket, req: Request) => {
    const { query } = parse(req.url, true);
    let authToken = req.headers["x-token"] as string;
    if (!authToken && query["x-token"]) {
      authToken = Array.isArray(query["x-token"])
        ? query["x-token"][0]
        : query["x-token"];
    }
    const decoded = verifyWebSocketToken(ws, authToken);
    if (!decoded) return;

    const userId = decoded.id;
    ws.userId = userId;

    // Store user websocket
    connectedUsers.set(userId, ws);

    const interval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) ws.ping();
    }, 30000);

    ws.on("message", async (message: any) => {
      try {
        const { type, receiverId, coHostLink, streamId, eventId, comment } =
          JSON.parse(message.toString());

        switch (type) {
          case "add-contributor": {
            if (!receiverId) {
              return ws.send(
                JSON.stringify({
                  type: "error",
                  message: "receiver ID is required",
                }),
              );
            }

            // get receiver socket from Map
            const receiverSocket = connectedUsers.get(receiverId);

            if (
              !receiverSocket ||
              receiverSocket.readyState !== WebSocket.OPEN
            ) {
              return ws.send(
                JSON.stringify({
                  type: "error",
                  message: "Receiver is not online",
                }),
              );
            }

            const senderInfo = await prisma.user.findUnique({
              where: { id: ws.userId },
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profileImage: true,
                profession: true,
              },
            });
            if (!senderInfo)
              return ws.send(
                JSON.stringify({
                  type: "error",
                  message: "Sender not found",
                }),
              );

            // send ONLY to receiver
            receiverSocket.send(
              JSON.stringify({
                type: "contribution-request",
                from: senderInfo,
                link: coHostLink,
                streamId: streamId,
              }),
            );

            break;
          }

          case "join-streaming": {
            if (!eventId) {
              return ws.send(
                JSON.stringify({
                  type: "error",
                  message: "Event ID is required",
                }),
              );
            }

            const eventInfo = await prisma.event.findUnique({
              where: { id: eventId },
              select: { id: true },
            });
            if (!eventInfo) {
              return ws.send(
                JSON.stringify({
                  type: "error",
                  message: "Event not found",
                }),
              );
            }

            if (!connectedEvents.has(eventId)) {
              connectedEvents.set(eventId, new Set<string>());
            }
            connectedEvents.get(eventId)!.add(userId);

            ws.send(
              JSON.stringify({
                type: "joined-streaming",
                eventId,
              }),
            );

            break;
          }

          case "chat-streaming": {
            if (!eventId) {
              return ws.send(
                JSON.stringify({
                  type: "error",
                  message: "Event ID is required",
                }),
              );
            }

            // const words = badWords;
            // for (const word of words) {
            //   const pattern = new RegExp(`\\b${word}\\b`, "i");

            //   if (pattern.test(comment)) {
            //     let status = userStatus.get(userId) || {
            //       warning: 0,
            //       banned: false,
            //     };

            //     const maxWarnings = 3;

            //     if (status.warning >= maxWarnings) {
            //       status.banned = true;
            //       userStatus.set(userId, status);

            //       await prisma.user.update({
            //         where: { id: userId },
            //         data: { status: "Banned" },
            //       });

            //       return ws.send(
            //         JSON.stringify({
            //           type: "banned",
            //           message:
            //             "You have been banned due to repeated violations.",
            //         })
            //       );
            //     }

            //     status.warning += 1;

            //     userStatus.set(userId, status);

            //     return ws.send(
            //       JSON.stringify({
            //         type: "bad-word-warning",
            //         message: "Inappropriate language is not allowed",
            //         warningCount: status.warning,
            //       })
            //     );
            //   }
            // }

            if (badWordRegex.test(comment)) {
              const status = userStatus.get(userId) || {
                warning: 0,
                banned: false,
              };

              const maxWarnings = 3;

              if (status.warning >= maxWarnings) {
                status.banned = true;
                userStatus.set(userId, status);

                await prisma.user.update({
                  where: { id: userId },
                  data: { status: "Banned" },
                });

                return ws.send(
                  JSON.stringify({
                    type: "banned",
                    message: "You have been banned due to repeated violations.",
                  }),
                );
              }

              status.warning += 1;
              userStatus.set(userId, status);

              return ws.send(
                JSON.stringify({
                  type: "bad-word-warning",
                  message: "Inappropriate language is not allowed",
                  warningCount: status.warning,
                }),
              );
            }

            const eventInfo = await prisma.event.findUnique({
              where: { id: eventId },
              select: {
                id: true,
                stream: {
                  select: {
                    bannedUsers: true,
                  },
                },
              },
            });
            if (!eventInfo) {
              return ws.send(
                JSON.stringify({
                  type: "error",
                  message: "Event not found",
                }),
              );
            }

            if (eventInfo.stream.bannedUsers.includes(userId)) {
              return ws.send(
                JSON.stringify({
                  type: "error",
                  message: "You are banned from this stream",
                }),
              );
            }

            await prisma.eventComment.create({
              data: {
                eventId,
                comment,
                userId,
              },
            });

            const comments = await prisma.event.findUnique({
              where: { id: eventId },
              select: {
                id: true,
                EventComment: {
                  orderBy: { createdAt: "desc" },
                  take: 20,
                  select: {
                    id: true,
                    comment: true,
                    createdAt: true,
                    user: {
                      select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profileImage: true,
                      },
                    },
                    ReplyComment: {
                      orderBy: { createdAt: "desc" },
                      take: 20,
                      select: {
                        id: true,
                        replyComment: true,
                        createdAt: true,
                        user: {
                          select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            profileImage: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            });

            // Broadcast comment only to users connected to the event
            connectedEvents.get(eventId)!.forEach((clientWs) => {
              const clientSocket = connectedUsers.get(clientWs);

              if (clientSocket && clientSocket.readyState === WebSocket.OPEN) {
                clientSocket.send(
                  JSON.stringify({
                    type: "chat-streaming-comment",
                    message: comments,
                  }),
                );
              }
            });
            break;
          }

          case "join-streaming-free": {
            if (!streamId) {
              return ws.send(
                JSON.stringify({
                  type: "error",
                  message: "Stream ID is required",
                }),
              );
            }

            const streamInfo = await prisma.liveStreaming.findUnique({
              where: { id: streamId },
              select: { id: true },
            });
            if (!streamInfo) {
              return ws.send(
                JSON.stringify({
                  type: "error",
                  message: "Stream not found",
                }),
              );
            }

            if (!connectedStreams.has(streamId)) {
              connectedStreams.set(streamId, new Set<string>());
            }
            connectedStreams.get(streamId)!.add(userId);

            ws.send(
              JSON.stringify({
                type: "joined-streaming-free",
                streamId,
              }),
            );

            break;
          }

          case "chat-streaming-free": {
            if (!streamId) {
              return ws.send(
                JSON.stringify({
                  type: "error",
                  message: "Stream ID is required",
                }),
              );
            }

            // const words = badWords;
            // for (const word of words) {
            //   const pattern = new RegExp(`\\b${word}\\b`, "i");

            //   if (pattern.test(comment)) {
            //     let status = userStatus.get(userId) || {
            //       warning: 0,
            //       banned: false,
            //     };

            //     const maxWarnings = 3;

            //     if (status.warning >= maxWarnings) {
            //       status.banned = true;
            //       userStatus.set(userId, status);

            //       await prisma.user.update({
            //         where: { id: userId },
            //         data: { status: "Banned" },
            //       });

            //       return ws.send(
            //         JSON.stringify({
            //           type: "banned",
            //           message:
            //             "You have been banned due to repeated violations.",
            //         })
            //       );
            //     }

            //     status.warning += 1;

            //     userStatus.set(userId, status);

            //     return ws.send(
            //       JSON.stringify({
            //         type: "bad-word-warning",
            //         message: "Inappropriate language is not allowed",
            //         warningCount: status.warning,
            //       })
            //     );
            //   }
            // }

            if (badWordRegex.test(comment)) {
              const status = userStatus.get(userId) || {
                warning: 0,
                banned: false,
              };

              const maxWarnings = 3;

              if (status.warning >= maxWarnings) {
                status.banned = true;
                userStatus.set(userId, status);

                await prisma.user.update({
                  where: { id: userId },
                  data: { status: "Banned" },
                });

                return ws.send(
                  JSON.stringify({
                    type: "banned",
                    message: "You have been banned due to repeated violations.",
                  }),
                );
              }

              status.warning += 1;
              userStatus.set(userId, status);

              return ws.send(
                JSON.stringify({
                  type: "bad-word-warning",
                  message: "Inappropriate language is not allowed",
                  warningCount: status.warning,
                }),
              );
            }

            const streamInfo = await prisma.liveStreaming.findUnique({
              where: { id: streamId },
              select: { id: true, bannedUsers: true },
            });
            if (!streamInfo) {
              return ws.send(
                JSON.stringify({
                  type: "error",
                  message: "Stream not found",
                }),
              );
            }

            if (streamInfo.bannedUsers.includes(userId)) {
              return ws.send(
                JSON.stringify({
                  type: "error",
                  message: "You are banned from this stream",
                }),
              );
            }

            const userInfo = await prisma.user.findUnique({
              where: { id: userId, status: "Active" },
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profileImage: true,
              },
            });
            if (!userInfo) {
              return ws.send(
                JSON.stringify({
                  type: "error",
                  message: "User not found",
                }),
              );
            }

            const commentInfo = {
              userId,
              firstName: userInfo.firstName,
              lastName: userInfo.lastName,
              profileImage: userInfo.profileImage,
              comment,
              createdAt: new Date(),
            };

            // Broadcast comment only to users connected to the event
            connectedStreams.get(streamId)!.forEach((clientWs) => {
              const clientSocket = connectedUsers.get(clientWs);

              if (clientSocket && clientSocket.readyState === WebSocket.OPEN) {
                clientSocket.send(
                  JSON.stringify({
                    type: "chat-streaming-free-comment",
                    message: commentInfo,
                  }),
                );
              }
            });
            break;
          }

          default:
            ws.send(
              JSON.stringify({
                type: "error",
                message: "Invalid message type",
              }),
            );
        }
      } catch (err) {
        console.log(err);
        ws.send(
          JSON.stringify({ type: "error", message: "Invalid JSON format" }),
        );
      }
    });

    ws.on("close", () => {
      connectedUsers.delete(userId);
      console.log("WebSocket client disconnected!");
      clearInterval(interval);
    });
  });
}

export const socket = { wss };
```

## 🛠️ socket.service.ts

```ts
import config from "../../../config";
import { jwtHelpers } from "../../../helpers/jwtHelpers";

export function verifyWebSocketToken(
  ws: any,
  token: string | undefined | null,
) {
  // No token provided
  if (!token) {
    sendWsError(ws, "You are not authenticated");
    ws.close();
    return null;
  }

  try {
    const decoded = jwtHelpers.verifyToken(
      token,
      config.jwt.jwt_secret as string,
    );
    return decoded;
  } catch (error: any) {
    let message = "Invalid token!";

    if (error?.name === "TokenExpiredError") {
      message = "Token has expired!";
    }

    sendWsError(ws, message);
    return null;
  }
}

/**
 * Safely sends a standardized error structure to the client
 */
function sendWsError(ws: any, message: string) {
  if (ws && ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify({ type: "error", message }));
  }
}
```

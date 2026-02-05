import { User } from "@prisma/client";
import ApiError from "../../../errors/ApiErrors";
import bcrypt from "bcryptjs";
import prisma from "../../../shared/prisma";
import generateOTP from "../../../helpers/generateOtp";
import redisClient from "../../../helpers/redis";
import { emailQueue } from "../../../queues/emailQueue";
import { sendSingleNotification } from "../notification/notification.services";

//create new user
const createUser = async (payload: User) => {
  const existingUser = await prisma.user.findFirst({
    where: { email: payload.email },
  });
  if (existingUser) {
    throw new ApiError(409, "User already exists using this email.");
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  // Prepare pending user object
  const pendingUserData = {
    email: payload.email,
    firstName: payload.firstName,
    lastName: payload.lastName,
    password: hashedPassword,
  };

  await redisClient.set(
    `pendingUser:${payload.email}`,
    JSON.stringify(pendingUserData),
    "EX",
    300,
  );

  const otp = generateOTP();

  await redisClient.set(`otp:${payload.email}`, otp, "EX", 300);

  await emailQueue.add("sendOtp", {
    email: payload.email,
    firstName: payload.firstName,
    otp,
  });

  return otp;
};

// Verify user using OTP for signup
const signupVerification = async (payload: { email: string; otp: string }) => {
  const { email, otp } = payload;

  const savedOtp = await redisClient.get(`otp:${email}`);
  if (!savedOtp) {
    throw new ApiError(400, "Invalid or expired OTP.");
  }

  if (otp !== savedOtp) {
    throw new ApiError(401, "Invalid OTP.");
  }

  const pendingUserStr = await redisClient.get(`pendingUser:${email}`);
  if (!pendingUserStr) {
    throw new ApiError(404, "No pending user found. Please sign up again.");
  }
  const pendingUser = JSON.parse(pendingUserStr);

  const createdUser = await prisma.$transaction(async (tx) => {
    const createdUser = await tx.user.create({
      data: {
        email: pendingUser.email,
        firstName: pendingUser.firstName,
        lastName: pendingUser.lastName,
        password: pendingUser.password,
      },
    });

    return createdUser;
  });

  await Promise.all([
    redisClient.del(`otp:${email}`),
    redisClient.del(`pendingUser:${email}`),
  ]);

  await sendSingleNotification(
    createdUser.id,
    "Account Verified",
    "Welcome! Your account has been successfully verified.",
    "AccountVerified",
    createdUser.id,
  );

  return;
};

const getSingleUser = async (userId: string, myId: string) => {
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

  const follow = await prisma.follow.findFirst({
    where: {
      user1Id: myId,
      user2Id: userId,
    },
  });

  const following = await prisma.follow.findMany({
    where: {
      user1Id: userId,
    },
    select: {
      user2: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profileImage: true,
          profession: true,
        },
      },
    },
  });

  const followers = await prisma.follow.findMany({
    where: {
      user2Id: userId,
    },
    select: {
      user1: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profileImage: true,
          profession: true,
        },
      },
    },
  });

  return {
    ...user,
    isFollow: follow?.user2Id === userId ? true : false,
    followingCount: following.length,
    followersCount: followers.length,
    following: following,
    followers: followers,
  };
};

export const userService = {
  createUser,
  signupVerification,
  getSingleUser,
};

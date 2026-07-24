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

  const isSetup = user.profession ? true : false;

  const accessToken = jwtHelpers.generateToken(
    { id: user.id, email: user.email, role: user.role },
    config.jwt.jwt_secret as string,
    config.jwt.expires_in as string,
  );

  return {
    accessToken,
    id: user.id,
    role: user.role,
    isSetup,
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

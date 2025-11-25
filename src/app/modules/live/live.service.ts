import { LiveStreaming } from "@prisma/client";
import ApiError from "../../../errors/ApiErrors";
import { generateZegoToken } from "../../../helpers/zegoToken";
import prisma from "../../../shared/prisma";
import { stripe } from "../../../helpers/stripe";

const generateToken = async (userId: string, roomId: string) => {
  console.log(userId);
  const token = generateZegoToken(
    Number(process.env.ZEGO_APP_ID),
    userId,
    process.env.ZEGO_SERVER_SECRET!,
    3600, // 1 hour validity
    { room_id: roomId }
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

const closeLiveStreaming = async (streamId: string, userId: string) => {
  const streamInfo = await prisma.liveStreaming.findUnique({
    where: { id: streamId, userId },
  });
  if (!streamInfo)
    // throw new ApiError(404, "This streaming closed by only the Host");
    return;
  if (!streamInfo.isLive)
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

export const liveServices = {
  generateToken,
  createLiveStreaming,
  getStreamInfo,
  closeLiveStreaming,
};

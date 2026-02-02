import { LiveStreaming } from "@prisma/client";
import ApiError from "../../../errors/ApiErrors";
import { generateZegoToken } from "../../../helpers/zegoToken";
import prisma from "../../../shared/prisma";
import axios from "axios";
import crypto from "crypto";
import config from "../../../config";
import { Request, Response } from "express";

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

const startLiveStreaming = async (streamId: string, userId: string) => {
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
      Vendor: 2,
      Region: "s3v4",
      Bucket: "emdadullah",
      AccessKeyId: "Be7vSXLGn1EuMzy55jLO",
      AccessKeySecret: "Gw2pW1gqVAG0GH8SXzrRJXi1036IMv5dBdgcwJme",
      EndPoint: "https://api.zenexcloud.com",
      ACL: "public-read",
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

const recordingWebhook = async (req: Request, res: Response) => {
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
};

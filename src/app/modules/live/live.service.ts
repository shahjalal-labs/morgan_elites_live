import { LiveStreaming } from "@prisma/client";
import ApiError from "../../../errors/ApiErrors";
import { generateZegoToken } from "../../../helpers/zegoToken";
import prisma from "../../../shared/prisma";
import axios from "axios";
import crypto from "crypto";
import config from "../../../config";

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
  isHost: boolean = false
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
    where: { id: streamId },
  });
  if (!streamInfo)
    throw new ApiError(404, "This streaming recorded by only the Host");
  if (!streamInfo.isLive)
    throw new ApiError(400, "This streaming not started yet/already ended");

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
      RecordMode: 2, // or 1 for single stream
      StreamType: 3, // audio + video
      MaxIdleTime: 60,
      MaxRecordTime: 86400, // up to 24h
      MixConfig: {
        MixMode: 2,
        MixOutputStreamId: "mix",
        MixOutputVideoConfig: {
          Width: 1280,
          Height: 720,
          Fps: 15,
          Bitrate: 1130000,
        },
      },
    },
    RecordOutputParams: {
      OutputFileFormat: "mp4",
      OutputFolder: "record/",
    },
    StorageParams: {
      Vendor: 10,
      Region: "s3v4",
      Bucket: "emdadullah",
      AccessKeyId: "Be7vSXLGn1EuMzy55jLO",
      AccessKeySecret: "Gw2pW1gqVAG0GH8SXzrRJXi1036IMv5dBdgcwJme",
      EndPoint: "https://api.zenexcloud.com",
      ACL: "public-read",
    },
  };

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
    Action: "StopRecord",
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
    console.log(data.Code);

    if (data.Code !== 0) {
      throw new ApiError(500, `ZEGOCLOUD stop record failed: ${data.Message}`);
    }

    return response.data;
  } catch (err) {
    console.error("StopRecord error:", err);
    throw err;
  }
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

export const liveServices = {
  generateToken,
  createLiveStreaming,
  getStreamInfo,
  startLiveStreaming,
  closeLiveStreaming,
  startRecording,
  stopRecording,
  recordLinkRetrieve,
};

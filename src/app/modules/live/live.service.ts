import { LiveStreaming } from "@prisma/client";
import ApiError from "../../../errors/ApiErrors";
import { generateZegoToken } from "../../../helpers/zegoToken";
import prisma from "../../../shared/prisma";
import axios from "axios";
import crypto from "crypto";

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
    throw new ApiError(400, "This streaming already ended");

  const APP_ID = "1071350787";
  const SERVER_SECRET = "27902ff993327c0ac3e4d5e88a0ea3de";

  const generateSignature = (timestamp: number, nonce: string) => {
    const s = `${APP_ID}${nonce}${SERVER_SECRET}${timestamp}`;
    return crypto.createHash("md5").update(s).digest("hex");
  };

  const buildCommonParams = () => {
    const timestamp = Math.floor(Date.now() / 1000);
    const nonce = crypto.randomBytes(8).toString("hex");
    return {
      AppId: APP_ID,
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

    return taskId;
  } catch (err) {
    console.error("StartRecord error:", err);
    throw err;
  }
};

export const liveServices = {
  generateToken,
  createLiveStreaming,
  getStreamInfo,
  closeLiveStreaming,
  startRecording,
};

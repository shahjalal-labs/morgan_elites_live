import { liveServices } from "./live.service";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";

const generateToken = catchAsync(async (req, res) => {
  console.log(req.user.id);
  const token = await liveServices.generateToken(req.user.id, "1000");
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Token generated success",
    data: token,
  });
});

const createLiveStreaming = catchAsync(async (req, res) => {
  const streamInfo = await liveServices.createLiveStreaming(
    req.user.id,
    req.body,
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Live streaming created successfully",
    data: streamInfo,
  });
});

const getStreamInfo = catchAsync(async (req, res) => {
  const data = await liveServices.getStreamInfo(
    req.params.streamId,
    req.user.id,
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Live streaming info retrived successfully",
    data,
  });
});

const closeLiveStreaming = catchAsync(async (req, res) => {
  await liveServices.closeLiveStreaming(
    req.params.streamId,
    req.user.id,
    req.body.isHost,
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Live streaming ended successfully",
  });
});

const startLiveStreaming = catchAsync(async (req, res) => {
  await liveServices.startLiveStreaming(
    req.params.streamId,
    req.user.id,
    req.body,
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Live streaming started successfully",
  });
});

const startRecording = catchAsync(async (req, res) => {
  const data = await liveServices.startRecording(
    req.params.streamId,
    req.user.id,
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Live streaming recording started successfully",
    data,
  });
});

const stopRecording = catchAsync(async (req, res) => {
  const data = await liveServices.stopRecording(
    req.params.streamId,
    req.user.id,
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Live streaming recording stopped successfully",
    data,
  });
});

const recordLinkRetrieve = catchAsync(async (req, res) => {
  const data = await liveServices.recordLinkRetrieve(req.params.streamId);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Live streaming recording link retrieved successfully",
    data,
  });
});

const watchCountUpdate = catchAsync(async (req, res) => {
  const data = await liveServices.watchCountUpdate(
    req.params.streamId,
    req.body.watchCount,
    req.user.id,
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Live streaming watch count updated successfully",
    data,
  });
});

const topInfluencersLive = catchAsync(async (req, res) => {
  const data = await liveServices.topInfluencersLive();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Top influencers live streams retrieved successfully",
    data,
  });
});

export const recordingWebhookController = catchAsync(async (req, res) => {
  const data = await liveServices.recordingWebhook(req, res);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Recording webhook received successfully",
    data,
  });
});

const banUser = catchAsync(async (req, res) => {
  await liveServices.banUser(
    req.params.streamId,
    req.user.id,
    req.body.banUserId,
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User banned successfully",
  });
});

const trimVideo = catchAsync(async (req, res) => {
  const { startTime, endTime } = req.body;
  const data = await liveServices.trimVideo(
    req.params.streamId,
    startTime,
    endTime,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Video trimmed successfully",
    data,
  });
});

export const liveControllers = {
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
  banUser,
  recordingWebhookController,
  trimVideo,
};

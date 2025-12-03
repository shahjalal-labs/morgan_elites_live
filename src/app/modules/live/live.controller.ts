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
    req.body
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
    req.user.id
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
    req.body.isHost
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Live streaming ended successfully",
  });
});

const startRecording = catchAsync(async (req, res) => {
  const data = await liveServices.startRecording(
    req.params.streamId,
    req.user.id
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
    req.user.id
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

export const liveControllers = {
  generateToken,
  createLiveStreaming,
  getStreamInfo,
  closeLiveStreaming,
  startRecording,
  stopRecording,
  recordLinkRetrieve,
};

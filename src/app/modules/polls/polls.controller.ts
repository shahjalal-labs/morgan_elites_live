import { pollsServices } from "./polls.service";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";

const createPolls = catchAsync(async (req, res) => {
  await pollsServices.createPolls(req.body, req.user.id, req.params.streamId);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "The polls has been created successfully",
  });
});

const getAllPollss = catchAsync(async (req, res) => {
  const result = await pollsServices.getAllPollss();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "All pollss has been retrived successfully",
    data: result,
  });
});

const getPollsById = catchAsync(async (req, res) => {
  const result = await pollsServices.getPollsById(req.params.id, req.user.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "polls has been retrived successfully",
    data: result,
  });
});

const updatePolls = catchAsync(async (req, res) => {
  await pollsServices.updatePolls(req.params.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "polls has been updated successfully",
  });
});

const submitVote = catchAsync(async (req, res) => {
  await pollsServices.submitVote(
    req.params.pollsId,
    req.user.id,
    req.body.option
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "vote has been submited successfully",
  });
});

const pollsResult = catchAsync(async (req, res) => {
  const result = await pollsServices.pollsResult(req.params.id, req.user.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "polls result has been retrived successfully",
    data: result,
  });
});

const deletePolls = catchAsync(async (req, res) => {
  await pollsServices.deletePolls(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "polls has been deleted successfully",
  });
});

export const pollsControllers = {
  createPolls,
  getAllPollss,
  getPollsById,
  submitVote,
  pollsResult,
  updatePolls,
  deletePolls,
};

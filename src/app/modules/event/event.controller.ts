import { eventServices } from "./event.service";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";

const createEvent = catchAsync(async (req, res) => {
  await eventServices.createEvent(req.body, req.user.id);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "The event has been created successfully",
  });
});

const getScheduleEvents = catchAsync(async (req, res) => {
  const result = await eventServices.getScheduleEvents(req.user.id, req.query);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "All schedule events has been retrived successfully",
    data: result,
  });
});

const getFundingEvents = catchAsync(async (req, res) => {
  const result = await eventServices.getFundingEvents(req.user.id, req.query);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "All funding events has been retrived successfully",
    data: result,
  });
});

const getEventById = catchAsync(async (req, res) => {
  const result = await eventServices.getEventById(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "event has been retrived successfully",
    data: result,
  });
});

const updateEvent = catchAsync(async (req, res) => {
  await eventServices.updateEvent(req.params.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "event has been updated successfully",
  });
});

const deleteEvent = catchAsync(async (req, res) => {
  await eventServices.deleteEvent(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "event has been deleted successfully",
  });
});

const eventLikeUnlike = catchAsync(async (req, res) => {
  const result = await eventServices.eventLikeUnlike(
    req.user.id,
    req.params.eventId
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: result,
  });
});

export const eventControllers = {
  createEvent,
  getScheduleEvents,
  getFundingEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  eventLikeUnlike,
};

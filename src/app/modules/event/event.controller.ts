import { eventServices } from "./event.service";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";

const createEvent = catchAsync(async (req, res) => {
  const { hostLink, coHostLink, audienceLink } = req.body;
  await eventServices.createEvent(
    req.body,
    req.user.id,
    hostLink,
    coHostLink,
    audienceLink
  );
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "The event has been created successfully",
  });
});

const allEvents = catchAsync(async (req, res) => {
  const result = await eventServices.allEvents(req.user.id, req.query);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "All events has been retrived successfully",
    data: result,
  });
});

const allEventsNonUser = catchAsync(async (req, res) => {
  const result = await eventServices.allEventsNonUser(req.query);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "All events has been retrived successfully",
    data: result,
  });
});

const liveEvents = catchAsync(async (req, res) => {
  const result = await eventServices.liveEvents(req.user.id, req.query);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "All live events has been retrived successfully",
    data: result,
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

const getMyEvents = catchAsync(async (req, res) => {
  const result = await eventServices.getMyEvents(req.user.id, req.query);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "My All schedule events has been retrived successfully",
    data: result,
  });
});

// const getMyFundingEvents = catchAsync(async (req, res) => {
//   const result = await eventServices.getMyFundingEvents(req.user.id, req.query);
//   sendResponse(res, {
//     success: true,
//     statusCode: 200,
//     message: "My All funding events has been retrived successfully",
//     data: result,
//   });
// });

const usersEvent = catchAsync(async (req, res) => {
  const result = await eventServices.usersEvent(
    req.params.id,
    req.query,
    req.user.id
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User's schedule events has been retrived successfully",
    data: result,
  });
});

const usersRecording = catchAsync(async (req, res) => {
  const result = await eventServices.usersRecording(req.params.userId);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User's recording events has been retrived successfully",
    data: result,
  });
});

const myRecordings = catchAsync(async (req, res) => {
  const result = await eventServices.usersRecording(req.user.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "My recording events has been retrived successfully",
    data: result,
  });
});

const allRecordings = catchAsync(async (req, res) => {
  const result = await eventServices.allRecordings();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "All recording events has been retrived successfully",
    data: result,
  });
});

// const fundingEventsOfUser = catchAsync(async (req, res) => {
//   const result = await eventServices.fundingEventsOfUser(
//     req.params.id,
//     req.query,
//     req.user.id
//   );
//   sendResponse(res, {
//     success: true,
//     statusCode: 200,
//     message: "User's funding events has been retrived successfully",
//     data: result,
//   });
// });

const followingEvents = catchAsync(async (req, res) => {
  const result = await eventServices.followingEvents(req.user.id, req.query);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message:
      "All schedule events base on following has been retrived successfully",
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

const eventComment = catchAsync(async (req, res) => {
  await eventServices.eventComment(
    req.user.id,
    req.params.eventId,
    req.body.comment
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Comment created successfully",
  });
});

const replyComment = catchAsync(async (req, res) => {
  await eventServices.replyComment(
    req.user.id,
    req.params.commentId,
    req.body.replyComment
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Reply Comment created successfully",
  });
});

const getEventComments = catchAsync(async (req, res) => {
  const data = await eventServices.getEventComments(
    req.user.id,
    req.params.eventId
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Event comments retrived successfully",
    data,
  });
});

export const eventControllers = {
  createEvent,
  allEvents,
  liveEvents,
  getScheduleEvents,
  getFundingEvents,
  getMyEvents,
  myRecordings,
  allRecordings,
  // getMyFundingEvents,
  usersEvent,
  // fundingEventsOfUser,
  usersRecording,
  followingEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  eventLikeUnlike,
  eventComment,
  replyComment,
  getEventComments,
  allEventsNonUser,
};

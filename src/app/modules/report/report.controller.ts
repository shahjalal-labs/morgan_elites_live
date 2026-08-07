import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { reportServices } from "./report.service";

const createReport = catchAsync(async (req, res) => {
  const { targetType, targetId, reason } = req.body;
  const result = await reportServices.createReport(
    req.user.id,
    targetType,
    targetId,
    reason,
  );
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: result.message,
  });
});

export const reportControllers = {
  createReport,
};

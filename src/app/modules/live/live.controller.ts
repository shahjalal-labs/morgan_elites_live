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

export const liveControllers = {
  generateToken,
};

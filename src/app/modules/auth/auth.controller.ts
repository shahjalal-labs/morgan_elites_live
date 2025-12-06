import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { authService } from "./auth.service";
import sendResponse from "../../../shared/sendResponse";

//login user
const loginUser = catchAsync(async (req, res) => {
  const result = await authService.loginUserIntoDB(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User successfully logged in",
    data: result,
  });
});

//google login
const googleLogin = catchAsync(async (req, res) => {
  const result = await authService.googleLogin(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Google login has been successfull",
    data: result,
  });
});

//update user location
const userLocationUpdateInRedis = catchAsync(async (req, res) => {
  const { id } = req.user;
  await authService.userLocationUpdateInRedis(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Your location updated successfully",
  });
});

//send forgot password otp
const sendForgotPasswordOtp = catchAsync(
  async (req: Request, res: Response) => {
    const email = req.body.email as string;
    const response = await authService.sendForgotPasswordOtpDB(email);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "OTP send successfully",
      data: response,
    });
  }
);

// verify forgot password otp code
const verifyForgotPasswordOtpCode = catchAsync(
  async (req: Request, res: Response) => {
    const payload = req.body;
    const response = await authService.verifyForgotPasswordOtpCodeDB(payload);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "OTP verified successfully.",
      data: response,
    });
  }
);

// update forgot password
const resetPassword = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { newPassword } = req.body;
  const result = await authService.resetForgotPasswordDB(newPassword, userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Password updated successfully.",
    data: result,
  });
});

const changePassword = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { newPassword, oldPassword } = req.body;
  await authService.changePassword(oldPassword, newPassword, userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Password changed successfully.",
  });
});

// get profile for logged in user
const myProfile = catchAsync(async (req, res) => {
  const { id } = req.user;
  const user = await authService.myProfile(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Your profile has been retrieved successfully",
    data: user,
  });
});

// update user profile only logged in user
const updateProfile = catchAsync(async (req, res) => {
  const { id } = req.user;
  const file = req.file as Express.Multer.File;
  await authService.updateProfileIntoDB(id, req.body, file);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Your profile has been updated successfully",
  });
});

const deleteAccount = catchAsync(async (req, res) => {
  const userId = req.user.id;
  await authService.deleteAccount(userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Account deleted successfully.",
  });
});

const logoutAccount = catchAsync(async (req, res) => {
  const userId = req.user.id;
  await authService.logoutAccount(userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Account logged out successfully.",
  });
});

const userList = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const data = await authService.userList(userId, req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User list retrived successfully.",
    data,
  });
});

const addModerator = catchAsync(async (req, res) => {
  const userId = req.user.id;
  await authService.addModerator(userId, req.params.userId, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Moderator added successfully.",
  });
});

export const authController = {
  loginUser,
  googleLogin,
  myProfile,
  updateProfile,
  userLocationUpdateInRedis,
  sendForgotPasswordOtp,
  verifyForgotPasswordOtpCode,
  resetPassword,
  changePassword,
  deleteAccount,
  logoutAccount,
  userList,
  addModerator,
};

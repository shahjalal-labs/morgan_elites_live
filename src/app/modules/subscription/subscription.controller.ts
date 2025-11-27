import {subscriptionServices} from './subscription.service';
import sendResponse from '../../../shared/sendResponse';
import catchAsync from "../../../shared/catchAsync";

const createSubscription = catchAsync (async (req, res) => {
  await subscriptionServices.createSubscription(req.body);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "The subscription has been created successfully"
  });
})

const getAllSubscriptions = catchAsync(async (req, res) => {
  const result = await subscriptionServices.getAllSubscriptions();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "All subscriptions has been retrived successfully",
    data: result,
  });
})

const getSubscriptionById = catchAsync(async (req, res) => {
  const result = await subscriptionServices.getSubscriptionById(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "subscription has been retrived successfully",
    data: result,
  });
})

const updateSubscription = catchAsync(async (req, res) => {
  await subscriptionServices.updateSubscription(req.params.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "subscription has been updated successfully"
  });
})

const deleteSubscription = catchAsync(async (req, res) => {
  await subscriptionServices.deleteSubscription(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "subscription has been deleted successfully",
  });
})

export const subscriptionControllers = {
  createSubscription,
  getAllSubscriptions,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
}
  
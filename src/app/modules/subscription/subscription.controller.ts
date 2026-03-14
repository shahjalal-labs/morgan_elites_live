import { subscriptionServices } from "./subscription.service";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";

const subscriptionPlans = catchAsync(async (req, res) => {
  const data = await subscriptionServices.subscriptionPlans();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "The subscription plans have been retrieved successfully",
    data,
  });
});

const createSubscription = catchAsync(async (req, res) => {
  const data = await subscriptionServices.createSubscription(
    req.body.plan,
    req.body.priceId,
    req.user.id,
  );
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "The subscription session link has been retrieved successfully",
    data,
  });
});

// export const subscriptionWebhookHandler = catchAsync(async (req, res) => {
//   const sig = req.headers["stripe-signature"] as string;
//   if (!sig) {
//     sendResponse(res, {
//       success: false,
//       statusCode: 400,
//       message: "Missing stripe signature",
//     });
//     return;
//   }
//   let event: Stripe.Event;
//   try {
//     event = stripe.webhooks.constructEvent(
//       req.body,
//       sig,
//       "whsec_PWiYiv8emG1JjKfxOzaco5iG5Pp8E31D"
//     );
//   } catch (err: any) {
//     sendResponse(res, {
//       success: false,
//       statusCode: 400,
//       message: `Webhook error: ${err.message}`,
//     });
//     return;
//   }

//   await subscriptionServices.subscriptionWebhookHandler(event);

//   sendResponse(res, {
//     success: true,
//     statusCode: 200,
//     message: "Webhook processed",
//   });
// });

const getAllSubscriptions = catchAsync(async (req, res) => {
  const result = await subscriptionServices.getAllSubscriptions();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "All subscriptions has been retrived successfully",
    data: result,
  });
});

const getSubscriptionById = catchAsync(async (req, res) => {
  const result = await subscriptionServices.getSubscriptionById(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "subscription has been retrived successfully",
    data: result,
  });
});

const updateSubscription = catchAsync(async (req, res) => {
  await subscriptionServices.updateSubscription(req.params.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "subscription has been updated successfully",
  });
});

const deleteSubscription = catchAsync(async (req, res) => {
  await subscriptionServices.deleteSubscription(
    req.params.subscriptionId,
    req.user.id,
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "subscription has been canceled successfully",
  });
});

const inAppSubscription = catchAsync(async (req, res) => {
  await subscriptionServices.inAppSubscription(req.body, req.user.id);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "In-app purchase subscription created successfully",
  });
});
export const subscriptionControllers = {
  subscriptionPlans,
  createSubscription,
  getAllSubscriptions,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
  inAppSubscription,
};

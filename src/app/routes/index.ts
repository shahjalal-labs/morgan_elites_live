import express from "express";
import { userRoutes } from "../modules/user/user.route";
import { authRoute } from "../modules/auth/auth.routes";
import { eventRoutes } from "../modules/event/event.routes";
import { groupRoute } from "../modules/group/group.routes";
import { liveRoutes } from "../modules/live/live.routes";
import { pollsRoutes } from "../modules/polls/polls.routes";
import { donationRoutes } from "../modules/donation/donation.routes";
import { notificationsRoute } from "../modules/notification/notification.route";
import { subscriptionRoutes } from "../modules/subscription/subscription.routes";
import { postRoute } from "../modules/post/post.route";
import { reportRoutes } from "../modules/report/report.routes";

const router = express.Router();

const moduleRoutes = [
  { path: "/users", route: userRoutes },
  { path: "/auth", route: authRoute },
  { path: "/event", route: eventRoutes },
  { path: "/group", route: groupRoute },
  { path: "/live", route: liveRoutes },
  { path: "/polls", route: pollsRoutes },
  { path: "/donation", route: donationRoutes },
  { path: "/notification", route: notificationsRoute },
  { path: "/subscription", route: subscriptionRoutes },
  { path: "/post", route: postRoute },
  { path: "/report", route: reportRoutes },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;

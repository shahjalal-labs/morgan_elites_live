import express from "express";
import { userRoutes } from "../modules/user/user.route";
import { authRoute } from "../modules/auth/auth.routes";
import { eventRoutes } from "../modules/event/event.routes";
import { groupRoute } from "../modules/group/group.routes";
import { liveRoutes } from "../modules/live/live.routes";

const router = express.Router();

const moduleRoutes = [
  { path: "/users", route: userRoutes },
  { path: "/auth", route: authRoute },
  { path: "/event", route: eventRoutes },
  { path: "/group", route: groupRoute },
  { path: "/live", route: liveRoutes },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;

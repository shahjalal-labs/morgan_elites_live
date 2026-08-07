import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import { ReportTargetType } from "@prisma/client";

const validateTargetExists = async (
  targetType: ReportTargetType,
  targetId: string,
) => {
  switch (targetType) {
    case "Post":
      const post = await prisma.post.findUnique({ where: { id: targetId } });
      if (!post) throw new ApiError(404, "Post not found");
      break;
    case "Comment":
      const comment = await prisma.postComment.findUnique({
        where: { id: targetId },
      });
      if (!comment) throw new ApiError(404, "Comment not found");
      break;
    case "User":
      const user = await prisma.user.findUnique({ where: { id: targetId } });
      if (!user) throw new ApiError(404, "User not found");
      break;
    case "Event":
      const event = await prisma.event.findUnique({ where: { id: targetId } });
      if (!event) throw new ApiError(404, "Event not found");
      break;
    default:
      throw new ApiError(400, "Unsupported target type");
  }
};

const createReport = async (
  reporterId: string,
  targetType: ReportTargetType,
  targetId: string,
  reason: string,
) => {
  // 1. Validate target existence
  await validateTargetExists(targetType, targetId);

  // 2. Create report
  try {
    await prisma.report.create({
      data: { reporterId, targetType, targetId, reason },
    });
    return { message: "Report submitted successfully" };
  } catch (error: any) {
    if (error.code === "P2002") {
      throw new ApiError(409, "You have already reported.");
    }
    throw error;
  }
};

export const reportServices = {
  createReport,
};

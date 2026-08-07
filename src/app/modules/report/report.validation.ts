import { z } from "zod";

const createReportSchema = z.object({
  targetType: z.enum(["Post", "Comment", "User", "Event"]), // match enum
  targetId: z
    .string()
    .min(1, "Target ID is required")
    .regex(/^[a-fA-F0-9]{24}$/, "Invalid MongoDB ObjectId"),
  reason: z.string().min(1, "Reason is required").max(2000, "Reason too long"),
});

export const reportValidation = {
  createReportSchema,
};

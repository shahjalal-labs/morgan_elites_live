import * as z from "zod";

export const createPollsSchema = z.object({
  // Define fields
  name: z.string(),
});

export const PollsSchemaValidation = {
  createPollsSchema,
};

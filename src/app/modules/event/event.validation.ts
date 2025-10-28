import * as z from 'zod';

export const createEventSchema = z.object({
  // Define fields
  name: z.string(),
});

export const EventSchemaValidation = {
createEventSchema
};
  
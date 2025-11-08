import * as z from 'zod';

export const createLiveSchema = z.object({
  // Define fields
  name: z.string(),
});

export const LiveSchemaValidation = {
createLiveSchema
};
  
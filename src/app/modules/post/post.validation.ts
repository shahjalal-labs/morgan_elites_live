import * as z from 'zod';

export const createGroupSchema = z.object({
  // Define fields
  name: z.string(),
});

export const GroupSchemaValidation = {
createGroupSchema
};
  
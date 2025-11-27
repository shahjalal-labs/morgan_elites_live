import * as z from 'zod';

export const createSubscriptionSchema = z.object({
  // Define fields
  name: z.string(),
});

export const SubscriptionSchemaValidation = {
createSubscriptionSchema
};
  
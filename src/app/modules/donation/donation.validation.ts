import * as z from "zod";

export const createDonationSchema = z.object({
  // Define fields
  name: z.string(),
});

export const DonationSchemaValidation = {
  createDonationSchema,
};

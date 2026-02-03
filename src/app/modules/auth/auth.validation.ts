import { z } from "zod";

const authLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const googleLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  fcmToken: z.string().min(1, "FCM token is required"),
});

const locationUpdateSchema = z.object({
  latitude: z
    .number()
    .min(-90, "Latitude must be greater than or equal to -90")
    .max(90, "Latitude must be less than or equal to 90"),
  longitude: z
    .number()
    .min(-180, "Longitude must be greater than or equal to -180")
    .max(180, "Longitude must be less than or equal to 180"),
});

const updateProfileSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    profession: z.string(),
    bio: z.string().max(1000, "Bio too long"),
    dob: z.preprocess(
      (v) => (typeof v === "string" || v instanceof Date ? new Date(v) : v),
      z.date(),
    ),
    phoneNumber: z.string(),
    address: z.string(),
    gender: z.enum(["Male", "Female", "Other"]),
  })
  .partial();

export const authValidation = {
  updateProfileSchema,
  authLoginSchema,
  googleLoginSchema,
  locationUpdateSchema,
};

import { z } from "zod";

const nonEmptyCsv = z
  .string()
  .trim()
  .min(1)
  .refine(
    (value) => value.split(",").map((entry) => entry.trim()).filter(Boolean).length > 0,
    "Must contain at least one value.",
  );

const envSchema = z.object({
  DATABASE_URL: z.string().trim().min(1),
  RESEND_API_KEY: z.string().trim().min(1),
  RESEND_FROM_EMAIL: z.string().trim().email(),
  CONTACT_NOTIFICATION_TO: nonEmptyCsv,
  DRIVER_NOTIFICATION_TO: nonEmptyCsv,
  GOOGLE_CLIENT_EMAIL: z.string().trim().min(1),
  GOOGLE_PRIVATE_KEY: z.string().trim().min(1),
  GOOGLE_DRIVE_FOLDER_ID: z.string().trim().min(1),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const invalidKeys = parsed.error.issues
    .map((issue) => issue.path.join("."))
    .filter(Boolean);

  console.error(
    `Invalid environment configuration. Check: ${Array.from(new Set(invalidKeys)).join(", ")}`,
  );
  process.exit(1);
}


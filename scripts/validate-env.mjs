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
  ZEPTOMAIL_SEND_TOKEN: z.string().trim().min(1),
  ZEPTOMAIL_FROM_EMAIL: z.string().trim().email(),
  CONTACT_NOTIFICATION_TO: nonEmptyCsv,
  DRIVER_NOTIFICATION_TO: nonEmptyCsv,
  ZOHO_CLIENT_ID: z.string().trim().min(1),
  ZOHO_CLIENT_SECRET: z.string().trim().min(1),
  ZOHO_REFRESH_TOKEN: z.string().trim().min(1),
  ZOHO_WORKDRIVE_DRIVER_FOLDER_ID: z.string().trim().min(1),
  ZOHO_WORKDRIVE_WAREHOUSE_FOLDER_ID: z.string().trim().min(1),
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

import { Resend } from "resend";

export type ContactNotificationData = {
  fullName: string;
  companyName?: string;
  email: string;
  phone?: string;
  message: string;
};

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const sender = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
const recipients = (process.env.CONTACT_NOTIFICATION_TO ?? "lakshan.s1705@gmail.com")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

export async function sendContactNotification(data: ContactNotificationData) {
  if (!resend) {
    console.warn("RESEND_API_KEY is not set. Skipping contact notification email.");
    return;
  }

  if (recipients.length === 0) {
    console.warn("CONTACT_NOTIFICATION_TO is empty. Skipping contact notification email.");
    return;
  }

  const { error } = await resend.emails.send({
    from: `GIPA Website <${sender}>`,
    to: recipients,
    subject: "New Contact Form Submission",
    html: `
      <h2>New Contact Submission</h2>
      <p><strong>Name:</strong> ${escapeHtml(data.fullName)}</p>
      <p><strong>Company:</strong> ${escapeHtml(data.companyName ?? "N/A")}</p>
      <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(data.phone ?? "N/A")}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(data.message)}</p>
    `,
  });

  if (error) {
    throw new Error(error.message || "Unknown Resend error");
  }
}

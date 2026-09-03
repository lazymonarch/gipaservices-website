import { ENV } from "@/lib/env";
import { sendZeptoMailEmail } from "@/lib/zeptomail";

export type ContactNotificationData = {
  fullName: string;
  companyName?: string;
  email: string;
  phone?: string;
  message: string;
};

export type DriverNotificationData = {
  fullName: string;
  address: string;
  phone: string;
  email: string;
  licenceType: string;
  experienceYears: number;
  rightToWork: boolean;
  cpcStatus?: string;
  hgvCategory?: string;
  availability?: string;
  cvFileUrl: string;
};

export type WarehouseOperativeNotificationData = {
  fullName: string;
  address: string;
  phone: string;
  email: string;
  warehouseExperienceYears: number;
  rightToWork: boolean;
  availability?: string;
  cvFileUrl: string;
};

const contactRecipients = ENV.CONTACT_NOTIFICATION_TO.split(",")
  .map((value) => value.trim())
  .filter(Boolean);
const driverRecipients = ENV.DRIVER_NOTIFICATION_TO.split(",")
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
  if (contactRecipients.length === 0) {
    console.error("CONTACT_NOTIFICATION_TO is empty. Contact email was not sent.");
    return;
  }

  await sendZeptoMailEmail({
    to: contactRecipients,
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
}

export async function sendDriverApplicationNotification(data: DriverNotificationData) {
  if (driverRecipients.length === 0) {
    console.error("DRIVER_NOTIFICATION_TO is empty. Driver email was not sent.");
    return;
  }

  const rightToWorkText = data.rightToWork ? "Yes" : "No";
  await sendZeptoMailEmail({
    to: driverRecipients,
    replyTo: data.email,
    subject: "New Driver Application Submission",
    html: `
      <h2>New Driver Application</h2>
      <p><strong>Name:</strong> ${escapeHtml(data.fullName)}</p>
      <p><strong>Address:</strong> ${escapeHtml(data.address)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>
      <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
      <p><strong>Licence Type:</strong> ${escapeHtml(data.licenceType)}</p>
      <p><strong>Experience (years):</strong> ${data.experienceYears}</p>
      <p><strong>Right to Work (UK):</strong> ${rightToWorkText}</p>
      <p><strong>CPC Status:</strong> ${escapeHtml(data.cpcStatus ?? "N/A")}</p>
      <p><strong>HGV Category:</strong> ${escapeHtml(data.hgvCategory ?? "N/A")}</p>
      <p><strong>Availability:</strong> ${escapeHtml(data.availability ?? "N/A")}</p>
      <p><strong>CV:</strong> <a href="${escapeHtml(data.cvFileUrl)}">View CV</a></p>
    `,
  });
}

export async function sendWarehouseOperativeApplicationNotification(
  data: WarehouseOperativeNotificationData,
) {
  if (driverRecipients.length === 0) {
    console.error(
      "DRIVER_NOTIFICATION_TO is empty. Warehouse operative email was not sent.",
    );
    return;
  }

  const rightToWorkText = data.rightToWork ? "Yes" : "No";
  await sendZeptoMailEmail({
    to: driverRecipients,
    replyTo: data.email,
    subject: "New Warehouse Operative Application Submission",
    html: `
      <h2>New Warehouse Operative Application</h2>
      <p><strong>Name:</strong> ${escapeHtml(data.fullName)}</p>
      <p><strong>Address:</strong> ${escapeHtml(data.address)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>
      <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
      <p><strong>Warehouse Experience (years):</strong> ${data.warehouseExperienceYears}</p>
      <p><strong>Right to Work (UK):</strong> ${rightToWorkText}</p>
      <p><strong>Availability:</strong> ${escapeHtml(data.availability ?? "N/A")}</p>
      <p><strong>CV:</strong> <a href="${escapeHtml(data.cvFileUrl)}">View CV</a></p>
    `,
  });
}

const APPLICATION_CONFIRMATION_SUBJECT = "Application Received – GIPA Services";

function applicationConfirmationHtml(fullName: string, roleLabel: string) {
  return `
      <p>Dear ${escapeHtml(fullName)},</p>
      <p>Thank you for applying to GIPA Services. We have received your ${escapeHtml(roleLabel)} application and will review it shortly.</p>
      <p>If we need any further information, we will contact you using the details you provided.</p>
      <p>Kind regards,<br>GIPA Services</p>
    `;
}

export async function sendDriverApplicationConfirmation(data: {
  fullName: string;
  email: string;
}) {
  await sendZeptoMailEmail({
    to: [data.email],
    subject: APPLICATION_CONFIRMATION_SUBJECT,
    html: applicationConfirmationHtml(data.fullName, "driver"),
  });
}

export async function sendWarehouseOperativeApplicationConfirmation(data: {
  fullName: string;
  email: string;
}) {
  await sendZeptoMailEmail({
    to: [data.email],
    subject: APPLICATION_CONFIRMATION_SUBJECT,
    html: applicationConfirmationHtml(data.fullName, "warehouse operative"),
  });
}

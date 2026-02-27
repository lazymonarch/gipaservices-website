import { Readable } from "node:stream";
import { google } from "googleapis";
import { ENV } from "@/lib/env";

const DRIVE_SCOPE = "https://www.googleapis.com/auth/drive";

function normalizeEnvValue(value: string | undefined) {
  if (!value) return undefined;
  let normalized = value.trim();
  if (normalized.endsWith(",")) {
    normalized = normalized.slice(0, -1).trim();
  }
  if (
    (normalized.startsWith('"') && normalized.endsWith('"')) ||
    (normalized.startsWith("'") && normalized.endsWith("'"))
  ) {
    normalized = normalized.slice(1, -1);
  }
  return normalized;
}

function parseFolderId(value: string) {
  const folderUrlMatch = value.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (folderUrlMatch?.[1]) {
    return folderUrlMatch[1];
  }
  return value;
}

function getDriveClient() {
  const clientEmail = normalizeEnvValue(ENV.GOOGLE_CLIENT_EMAIL);
  const privateKey = normalizeEnvValue(ENV.GOOGLE_PRIVATE_KEY)?.replace(
    /\\n/g,
    "\n",
  );

  if (!clientEmail || !privateKey) {
    throw new Error("Google Drive credentials are not configured.");
  }
  if (!clientEmail.endsWith(".gserviceaccount.com")) {
    throw new Error(
      "GOOGLE_CLIENT_EMAIL must be a service account email ending with .gserviceaccount.com.",
    );
  }
  if (
    !privateKey.includes("BEGIN PRIVATE KEY") ||
    !privateKey.includes("END PRIVATE KEY")
  ) {
    throw new Error(
      "GOOGLE_PRIVATE_KEY format is invalid. Paste the exact private_key value from the service account JSON.",
    );
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    scopes: [DRIVE_SCOPE],
  });

  return google.drive({ version: "v3", auth });
}

export async function uploadToDrive(file: File) {
  const folderIdValue = normalizeEnvValue(ENV.GOOGLE_DRIVE_FOLDER_ID);
  const folderId = folderIdValue ? parseFolderId(folderIdValue) : undefined;
  if (!folderId) {
    throw new Error("GOOGLE_DRIVE_FOLDER_ID is not configured.");
  }

  const drive = getDriveClient();
  const buffer = Buffer.from(await file.arrayBuffer());
  const timestamp = new Date().toISOString().replaceAll(":", "-");
  const safeName = file.name.replace(/[^\w.\- ]/g, "_");
  const fileName = `${timestamp}-${safeName}`;

  let response;
  try {
    response = await drive.files.create({
      requestBody: {
        name: fileName,
        parents: [folderId],
      },
      media: {
        mimeType: file.type || "application/octet-stream",
        body: Readable.from(buffer),
      },
      supportsAllDrives: true,
      fields: "id",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Google Drive upload failed.";
    if (message.includes("Service Accounts do not have storage quota")) {
      throw new Error(
        "Google Drive folder is not in a Shared Drive. Move the folder to a Shared Drive or switch to OAuth user upload.",
      );
    }
    throw error;
  }

  const fileId = response.data.id;
  if (!fileId) {
    throw new Error("Google Drive upload did not return a file id.");
  }

  return fileId;
}

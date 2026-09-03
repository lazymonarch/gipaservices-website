import "server-only";

const ZOHO_TOKEN_URL = "https://accounts.zoho.eu/oauth/v2/token";
const ZOHO_UPLOAD_URL = "https://www.zohoapis.eu/workdrive/api/v1/upload";

type ZohoTokenResponse = {
  access_token?: string;
  expires_in?: number;
  error?: string;
};

type ZohoUploadResponse = {
  data?: Array<{
    attributes?: {
      resource_id?: string;
      Permalink?: string;
    };
  }>;
  message?: string;
  errors?: Array<{ title?: string; detail?: string }>;
};

let cachedAccessToken: string | null = null;
let tokenExpiresAt = 0;

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

function getZohoCredentials() {
  const clientId = normalizeEnvValue(process.env.ZOHO_CLIENT_ID);
  const clientSecret = normalizeEnvValue(process.env.ZOHO_CLIENT_SECRET);
  const refreshToken = normalizeEnvValue(process.env.ZOHO_REFRESH_TOKEN);

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      "Zoho WorkDrive credentials are not configured. Set ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, and ZOHO_REFRESH_TOKEN.",
    );
  }

  const looksLikePlaceholder =
    clientId.includes("your_") ||
    clientSecret.includes("your_") ||
    refreshToken.includes("your_") ||
    clientId.includes("<") ||
    clientSecret.includes("<") ||
    refreshToken.includes("<");

  if (looksLikePlaceholder) {
    throw new Error(
      "Zoho WorkDrive credentials are still placeholders. Replace ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, and ZOHO_REFRESH_TOKEN in .env.",
    );
  }

  return { clientId, clientSecret, refreshToken };
}

async function refreshAccessToken() {
  const { clientId, clientSecret, refreshToken } = getZohoCredentials();
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
  });

  const response = await fetch(ZOHO_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const payload = (await response.json()) as ZohoTokenResponse;
  if (!response.ok || !payload.access_token) {
    const reason = payload.error ?? `HTTP ${response.status}`;
    throw new Error(`Failed to refresh Zoho access token: ${reason}`);
  }

  const expiresInSeconds = payload.expires_in ?? 3600;
  cachedAccessToken = payload.access_token;
  tokenExpiresAt = Date.now() + expiresInSeconds * 1000;

  return cachedAccessToken;
}

async function getAccessToken() {
  if (cachedAccessToken && Date.now() < tokenExpiresAt - 60_000) {
    return cachedAccessToken;
  }

  return refreshAccessToken();
}

function buildUploadFileName(file: File) {
  const timestamp = new Date().toISOString().replaceAll(":", "-");
  const safeName = file.name.replace(/[^\w.\- ]/g, "_");
  return `${timestamp}-${safeName}`;
}

function extractUploadResult(payload: ZohoUploadResponse) {
  const upload = payload.data?.[0]?.attributes;
  const fileId = upload?.resource_id;
  const fileUrl = upload?.Permalink;

  if (!fileId || !fileUrl) {
    const apiMessage =
      payload.message ??
      payload.errors?.map((error) => error.detail ?? error.title).find(Boolean);

    throw new Error(
      apiMessage ?? "Zoho WorkDrive upload did not return a file id and URL.",
    );
  }

  return { fileId, fileUrl };
}

export async function uploadToWorkDrive(file: File, folderId: string) {
  const parentId = normalizeEnvValue(folderId);
  if (!parentId) {
    throw new Error("A Zoho WorkDrive folder id is required.");
  }

  const accessToken = await getAccessToken();
  const fileName = buildUploadFileName(file);
  const uploadUrl = new URL(ZOHO_UPLOAD_URL);
  uploadUrl.searchParams.set("filename", fileName);
  uploadUrl.searchParams.set("parent_id", parentId);
  uploadUrl.searchParams.set("override-name-exist", "true");

  const formData = new FormData();
  formData.append("content", file, fileName);

  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Authorization: `Zoho-oauthtoken ${accessToken}`,
    },
    body: formData,
  });

  let payload: ZohoUploadResponse;
  try {
    payload = (await response.json()) as ZohoUploadResponse;
  } catch {
    throw new Error(`Zoho WorkDrive upload failed with HTTP ${response.status}.`);
  }

  if (!response.ok) {
    const apiMessage =
      payload.message ??
      payload.errors?.map((error) => error.detail ?? error.title).find(Boolean);
    throw new Error(
      apiMessage ?? `Zoho WorkDrive upload failed with HTTP ${response.status}.`,
    );
  }

  return extractUploadResult(payload);
}

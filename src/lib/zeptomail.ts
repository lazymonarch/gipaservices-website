import "server-only";
import { ENV } from "@/lib/env";

const ZEPTOMAIL_API_URL = "https://api.zeptomail.eu/v1.1/email";

type ZeptoMailRecipient = {
  email_address: {
    address: string;
    name?: string;
  };
};

type ZeptoMailSendPayload = {
  from: {
    address: string;
    name: string;
  };
  to: ZeptoMailRecipient[];
  reply_to?: Array<{
    address: string;
    name?: string;
  }>;
  subject: string;
  htmlbody: string;
};

type ZeptoMailErrorResponse = {
  message?: string;
  error?: {
    message?: string;
    details?: Array<{ message?: string; target?: string }>;
  };
};

function formatAuthorizationToken(token: string) {
  const trimmed = token.trim();
  if (trimmed.toLowerCase().startsWith("zoho-enczapikey")) {
    return trimmed;
  }
  return `Zoho-enczapikey ${trimmed}`;
}

function extractErrorMessage(payload: ZeptoMailErrorResponse) {
  return (
    payload.error?.details?.map((detail) => detail.message).find(Boolean) ??
    payload.error?.message ??
    payload.message
  );
}

export async function sendZeptoMailEmail({
  to,
  subject,
  html,
  replyTo,
}: {
  to: string[];
  subject: string;
  html: string;
  replyTo?: string;
}) {
  const payload: ZeptoMailSendPayload = {
    from: {
      address: ENV.ZEPTOMAIL_FROM_EMAIL,
      name: "GIPA Website",
    },
    to: to.map((address) => ({
      email_address: { address },
    })),
    subject,
    htmlbody: html,
  };

  if (replyTo) {
    payload.reply_to = [{ address: replyTo }];
  }

  const response = await fetch(ZEPTOMAIL_API_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: formatAuthorizationToken(ENV.ZEPTOMAIL_SEND_TOKEN),
    },
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    return;
  }

  let errorPayload: ZeptoMailErrorResponse = {};
  try {
    errorPayload = (await response.json()) as ZeptoMailErrorResponse;
  } catch {
    throw new Error(`ZeptoMail request failed with HTTP ${response.status}.`);
  }

  throw new Error(
    extractErrorMessage(errorPayload) ??
      `ZeptoMail request failed with HTTP ${response.status}.`,
  );
}

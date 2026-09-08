import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const files = [
  "gipa-logo.png",
  "home-hero-mountain.png",
  "home-cta-truck.jpg",
  "service-secure-warehouse.jpg",
  "service-timed-dock.jpg",
  "service-partnership-review.jpg",
  "hero-truck.jpg",
  "warehouse-operative.jpg",
  "united-kingdom.png",
  "warehouse-real-1.jpg",
  "contact-hero-port.jpg",
  "driver-hero.jpg",
];

function requireEnv(name, fallbackName) {
  const value = process.env[name]?.trim() || (fallbackName ? process.env[fallbackName]?.trim() : "");
  if (!value) {
    throw new Error(`Missing ${name}. Add it to .env (do not paste it in chat).`);
  }
  return value;
}

function sign(params, apiSecret) {
  const toSign = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  return createHash("sha1").update(`${toSign}${apiSecret}`).digest("hex");
}

async function uploadOne({ cloud, apiKey, apiSecret, filename }) {
  const filepath = path.join(root, "public", "assets", filename);
  const publicId = `gipa/${filename.replace(/\.[^.]+$/, "")}`;
  const timestamp = Math.floor(Date.now() / 1000);
  const params = {
    folder: "gipa",
    overwrite: "true",
    public_id: publicId.split("/").slice(1).join("/"),
    timestamp: String(timestamp),
  };
  const signature = sign(params, apiSecret);

  const body = new FormData();
  body.set("file", new Blob([await readFile(filepath)]), filename);
  body.set("api_key", apiKey);
  body.set("timestamp", params.timestamp);
  body.set("signature", signature);
  body.set("folder", params.folder);
  body.set("public_id", params.public_id);
  body.set("overwrite", params.overwrite);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
    method: "POST",
    body,
  });
  const json = await response.json();
  if (!response.ok) {
    throw new Error(`${filename}: ${json.error?.message ?? response.statusText}`);
  }
  return json.secure_url;
}

async function main() {
  const cloud = requireEnv("CLOUDINARY_CLOUD_NAME", "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME");
  const apiKey = requireEnv("CLOUDINARY_API_KEY");
  const apiSecret = requireEnv("CLOUDINARY_API_SECRET");

  for (const filename of files) {
    const url = await uploadOne({ cloud, apiKey, apiSecret, filename });
    console.log(`uploaded ${filename} -> ${url}`);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

const CLOUDINARY_FOLDER = "gipa";

export const LOCAL_ASSETS = {
  logo: "gipa-logo.png",
  homeHero: "home-hero-mountain.png",
  homeCta: "home-cta-truck.jpg",
  serviceSecure: "service-secure-warehouse.jpg",
  serviceTimed: "service-timed-dock.jpg",
  servicePartnership: "service-partnership-review.jpg",
  careerDriver: "hero-truck.jpg",
  careerWarehouse: "warehouse-operative.jpg",
  ukMap: "united-kingdom.png",
  warehouseReal: "warehouse-real-1.jpg",
  contactHero: "contact-hero-port.jpg",
  driverHero: "driver-hero.jpg",
} as const;

export type MediaKey = keyof typeof LOCAL_ASSETS;

const DEFAULT_WIDTH: Record<MediaKey, number> = {
  logo: 400,
  homeHero: 1920,
  homeCta: 1400,
  serviceSecure: 1200,
  serviceTimed: 1200,
  servicePartnership: 1400,
  careerDriver: 1200,
  careerWarehouse: 1200,
  ukMap: 800,
  warehouseReal: 1600,
  contactHero: 1920,
  driverHero: 1920,
};

export function mediaPublicId(key: MediaKey): string {
  const file = LOCAL_ASSETS[key];
  return `${CLOUDINARY_FOLDER}/${file.replace(/\.[^.]+$/, "")}`;
}

/** Cloudinary CDN URL when `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is set; otherwise `/assets/...`. */
export function mediaUrl(key: MediaKey, width?: number): string {
  const file = LOCAL_ASSETS[key];
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim();
  if (!cloud) {
    return `/assets/${file}`;
  }

  const w = width ?? DEFAULT_WIDTH[key];
  return `https://res.cloudinary.com/${cloud}/image/upload/f_auto,q_auto,c_limit,w_${w}/${mediaPublicId(key)}`;
}

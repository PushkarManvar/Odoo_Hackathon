import { randomBytes } from "node:crypto";

const SLUG_SAFE = /[^a-z0-9]+/g;

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(SLUG_SAFE, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function generateShareSlug(tripName: string): string {
  const suffix = randomBytes(4).toString("hex");
  const base = slugify(tripName) || "trip";
  return `${base}-${suffix}`;
}
// src/lib/codeforces.ts

const CF_API_BASE = "https://codeforces.com/api";

export interface CFUserInfo {
  handle: string;
  firstName?: string;
  lastName?: string;
  rating?: number;
  maxRating?: number;
  rank?: string;
}

export async function fetchCFUserInfo(
  handle: string,
): Promise<CFUserInfo | null> {
  const res = await fetch(`${CF_API_BASE}/user.info?handles=${handle}`);
  const data = await res.json();

  if (data.status !== "OK") return null;

  return data.result[0];
}

export function generateVerificationToken(): string {
  return Math.random().toString(36).substring(2, 10);
}

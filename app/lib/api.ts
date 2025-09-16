const DEFAULT_BASE = "http://localhost:5000";

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || DEFAULT_BASE;

export function api(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const base = API_BASE.replace(/\/$/, "");
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${base}${clean}`;
}

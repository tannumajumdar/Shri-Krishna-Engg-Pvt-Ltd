"use client";

/**
 * Thin fetch wrapper for the admin UI. Sends cookies (the httpOnly JWT),
 * unwraps the { success, data } envelope, and throws a readable Error with the
 * server's message + field details on failure.
 */

export type ApiResult<T> = { success: true; data: T } | {
  success: false;
  error: string;
  details?: Record<string, string>;
};

export class ApiClientError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: Record<string, string>,
  ) {
    super(message);
  }
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const opts: RequestInit = { method, credentials: "same-origin" };
  if (body !== undefined) {
    opts.headers = { "Content-Type": "application/json" };
    opts.body = JSON.stringify(body);
  }
  const res = await fetch(path, opts);
  const json = (await res.json().catch(() => null)) as ApiResult<T> | null;

  if (!res.ok || !json || json.success === false) {
    const msg =
      (json && json.success === false && json.error) ||
      `Request failed (${res.status})`;
    const details =
      json && json.success === false ? json.details : undefined;
    throw new ApiClientError(msg, res.status, details);
  }
  return json.data;
}

export const api = {
  get: <T>(p: string) => request<T>("GET", p),
  post: <T>(p: string, body?: unknown) => request<T>("POST", p, body),
  put: <T>(p: string, body?: unknown) => request<T>("PUT", p, body),
  del: <T>(p: string) => request<T>("DELETE", p),
  /** multipart upload → returns { url, ... }. */
  async upload(
    file: File,
    kind: "image" | "video" | "pdf" | "any" = "image",
    folder?: string,
  ): Promise<{ url: string; type: string; size: number; name: string }> {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("kind", kind);
    if (folder) fd.append("folder", folder);
    const res = await fetch("/api/media/upload", {
      method: "POST",
      body: fd,
      credentials: "same-origin",
    });
    const json = await res.json().catch(() => null);
    if (!res.ok || !json?.success) {
      throw new ApiClientError(
        json?.error || "Upload failed",
        res.status,
        json?.details,
      );
    }
    return json.data;
  },
};

import type { AuditEntry, UserData } from "../types";
import { demoRequest, type DemoResponse } from "./demoBackend";

export type AuthPayload = {
  email: string;
  password: string;
  mfaCode: string;
};

export type AuthResult = {
  ok: boolean;
  message: string;
};

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "/api";
let demoBackendActive = false;

class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<Value>(
  path: string,
  init?: RequestInit,
): Promise<Value> {
  if (demoBackendActive) return toResult<Value>(demoRequest(path, init));

  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      ...init,
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });
  } catch (error) {
    throw new ApiError(
      error instanceof Error
        ? `Local API is unavailable: ${error.message}`
        : "Local API is unavailable.",
      0,
    );
  }

  if (response.status === 204) return undefined as Value;

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    // Static hosts (e.g. Vercel) answer /api with an HTML page; switch to the
    // in-browser demo API for the rest of this page load.
    console.warn("API did not return JSON; using the in-browser demo API.");
    demoBackendActive = true;
    return toResult<Value>(demoRequest(path, init));
  }

  return toResult<Value>({ status: response.status, body });
}

function toResult<Value>({ status, body }: DemoResponse): Value {
  if (status === 204) return undefined as Value;
  if (status < 200 || status >= 300) {
    const message =
      typeof body === "object" &&
      body !== null &&
      "error" in body &&
      typeof body.error === "string"
        ? body.error
        : typeof body === "object" &&
            body !== null &&
            "message" in body &&
            typeof body.message === "string"
          ? body.message
          : `API request failed with status ${status}.`;
    throw new ApiError(message, status);
  }

  return body as Value;
}

export const authApi = {
  signIn(payload: AuthPayload): Promise<AuthResult> {
    return request<AuthResult>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  async session(): Promise<boolean> {
    const result = await request<{ authenticated: boolean }>("/auth/session");
    return result.authenticated;
  },
  logout(): Promise<{ ok: boolean }> {
    return request("/auth/logout", { method: "POST" });
  },
};

export const usersApi = {
  list(): Promise<UserData[]> {
    return request("/users");
  },
  add(user: UserData): Promise<UserData> {
    return request("/users", { method: "POST", body: JSON.stringify(user) });
  },
  update(user: UserData): Promise<UserData> {
    return request(`/users/${encodeURIComponent(user.id)}`, {
      method: "PUT",
      body: JSON.stringify(user),
    });
  },
  remove(id: string): Promise<void> {
    return request(`/users/${encodeURIComponent(id)}`, { method: "DELETE" });
  },
};

export const auditApi = {
  list(): Promise<AuditEntry[]> {
    return request("/audit");
  },
  add(entry: AuditEntry): Promise<AuditEntry> {
    return request("/audit", {
      method: "POST",
      body: JSON.stringify(entry),
    });
  },
};

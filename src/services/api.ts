import type { AuditEntry, UserData } from "../types";

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

  const body: unknown = await response.json();
  if (!response.ok) {
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
          : `API request failed with status ${response.status}.`;
    throw new ApiError(message, response.status);
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

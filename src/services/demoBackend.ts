import seed from "../../server/seed.json";
import type { AuditEntry, UserData } from "../types";
import { localStorageRepository } from "./localStorageRepository";

// In-browser stand-in for server/index.mjs, used when the app is deployed to a
// static host without the local API. Data lives in this browser's localStorage.

export type DemoResponse = {
  status: number;
  body: unknown;
};

const demoEmail = "nama@ruangrasa.id";
const demoPassword = "ruangrasa";
const demoMfaCode = "123456";

const usersKey = "rr_demo_users";
const auditKey = "rr_demo_audit";
const sessionKey = "rr_demo_session";

const seedData = seed as { users: UserData[]; audit: AuditEntry[] };

function readUsers(): UserData[] {
  return localStorageRepository.get(usersKey, seedData.users);
}

function readAudit(): AuditEntry[] {
  return localStorageRepository.get(auditKey, seedData.audit);
}

function parseBody(init?: RequestInit): Record<string, unknown> {
  if (typeof init?.body !== "string" || !init.body) return {};
  return JSON.parse(init.body) as Record<string, unknown>;
}

export function demoRequest(path: string, init?: RequestInit): DemoResponse {
  const method = init?.method || "GET";
  const authenticated = localStorageRepository.get(sessionKey, false);

  if (method === "GET" && path === "/health") {
    return { status: 200, body: { status: "ok", database: "browser" } };
  }

  if (method === "POST" && path === "/auth/login") {
    const body = parseBody(init);
    const validEmail =
      typeof body.email === "string" &&
      body.email.trim().toLowerCase() === demoEmail;
    const validPassword = body.password === demoPassword;
    const validCode = body.mfaCode === demoMfaCode;

    if (!validEmail || !validPassword || !validCode) {
      const failedEntry: AuditEntry = {
        id: `AUD-${Date.now()}`,
        time: new Date().toLocaleString("id-ID"),
        ageHours: 0,
        actor: "Tidak dikenal",
        role: "—",
        action: "Login gagal",
        object: "Admin CMS",
        reason: "Kredensial atau kode MFA tidak cocok",
      };
      localStorageRepository.set(auditKey, [failedEntry, ...readAudit()]);
      return {
        status: 401,
        body: {
          ok: false,
          message: !validCode
            ? "Kode MFA tidak cocok."
            : "Email atau kata sandi tidak cocok.",
        },
      };
    }

    localStorageRepository.set(sessionKey, true);
    return { status: 200, body: { ok: true, message: "Login berhasil." } };
  }

  if (method === "GET" && path === "/auth/session") {
    return { status: 200, body: { authenticated } };
  }

  if (method === "POST" && path === "/auth/logout") {
    localStorageRepository.remove(sessionKey);
    return { status: 200, body: { ok: true } };
  }

  if (!authenticated) {
    return {
      status: 401,
      body: { error: "Authentication required.", code: "UNAUTHENTICATED" },
    };
  }

  if (method === "GET" && path === "/users") {
    return { status: 200, body: readUsers() };
  }

  if (method === "POST" && path === "/users") {
    const user = parseBody(init) as unknown as UserData;
    if (typeof user.id !== "string" || typeof user.name !== "string") {
      return { status: 400, body: { error: "Invalid user record." } };
    }
    const users = readUsers();
    if (users.some((item) => item.id === user.id)) {
      return {
        status: 409,
        body: { error: `User already exists: ${user.id}` },
      };
    }
    localStorageRepository.set(usersKey, [...users, user]);
    return { status: 201, body: user };
  }

  const userMatch = path.match(/^\/users\/([^/]+)$/);
  if (userMatch) {
    const id = decodeURIComponent(userMatch[1]);
    const users = readUsers();
    if (!users.some((item) => item.id === id)) {
      return { status: 404, body: { error: `User not found: ${id}` } };
    }
    if (method === "PUT") {
      const user = parseBody(init) as unknown as UserData;
      if (user.id !== id || typeof user.name !== "string") {
        return { status: 400, body: { error: "Invalid user record." } };
      }
      localStorageRepository.set(
        usersKey,
        users.map((item) => (item.id === id ? user : item)),
      );
      return { status: 200, body: user };
    }
    if (method === "DELETE") {
      localStorageRepository.set(
        usersKey,
        users.filter((item) => item.id !== id),
      );
      return { status: 204, body: null };
    }
  }

  if (method === "GET" && path === "/audit") {
    return { status: 200, body: readAudit() };
  }

  if (method === "POST" && path === "/audit") {
    const entry = parseBody(init) as unknown as AuditEntry;
    if (
      typeof entry.id !== "string" ||
      typeof entry.action !== "string" ||
      typeof entry.actor !== "string" ||
      typeof entry.reason !== "string"
    ) {
      return { status: 400, body: { error: "Invalid audit entry." } };
    }
    const audit = readAudit();
    if (audit.some((item) => item.id === entry.id)) {
      return {
        status: 409,
        body: { error: `Audit entry already exists: ${entry.id}` },
      };
    }
    localStorageRepository.set(auditKey, [entry, ...audit]);
    return { status: 201, body: entry };
  }

  return { status: 404, body: { error: "Route not found." } };
}

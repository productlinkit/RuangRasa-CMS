import { randomBytes } from "node:crypto";
import { createServer } from "node:http";
import { mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";

const serverDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectDirectory = path.dirname(serverDirectory);
const defaultDatabasePath = path.join(
  projectDirectory,
  ".data",
  "ruangrasa.sqlite",
);
const demoMfaCode = "123456";
const demoEmail = "nama@ruangrasa.id";
const demoPassword = "ruangrasa";
const maxRequestBytes = 1024 * 1024;

function sendJson(response, status, value, headers = {}) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    ...headers,
  });
  response.end(JSON.stringify(value));
}

function parseCookies(header = "") {
  return Object.fromEntries(
    header
      .split(";")
      .map((part) => part.trim().split("="))
      .filter(([key, value]) => key && value !== undefined)
      .map(([key, ...value]) => [key, decodeURIComponent(value.join("="))]),
  );
}

async function readJson(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > maxRequestBytes) {
      const error = new Error("Request body is too large.");
      error.status = 413;
      throw error;
    }
    chunks.push(chunk);
  }

  if (size === 0) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    const error = new Error("Request body must be valid JSON.");
    error.status = 400;
    throw error;
  }
}

function createDatabase(databasePath, seed) {
  mkdirSync(path.dirname(databasePath), { recursive: true });
  const database = new DatabaseSync(databasePath);
  database.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS audit_entries (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS app_meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  const isSeeded =
    database
      .prepare("SELECT value FROM app_meta WHERE key = 'seed_version'")
      .get()?.value === "1";
  if (!isSeeded) {
    const insertUser = database.prepare(
      "INSERT INTO users (id, data) VALUES (?, ?)",
    );
    const insertAudit = database.prepare(
      "INSERT INTO audit_entries (id, data) VALUES (?, ?)",
    );
    const markSeeded = database.prepare(
      "INSERT INTO app_meta (key, value) VALUES ('seed_version', '1')",
    );
    database.exec("BEGIN");
    try {
      for (const user of seed.users) {
        insertUser.run(user.id, JSON.stringify(user));
      }
      for (const entry of [...seed.audit].reverse()) {
        insertAudit.run(entry.id, JSON.stringify(entry));
      }
      markSeeded.run();
      database.exec("COMMIT");
    } catch (error) {
      database.exec("ROLLBACK");
      database.close();
      throw error;
    }
  }

  return database;
}

function parseRecord(row) {
  return JSON.parse(row.data);
}

export function createAppServer({
  databasePath = process.env.RUANGRASA_DB_PATH || defaultDatabasePath,
  seedPath = path.join(serverDirectory, "seed.json"),
} = {}) {
  const seed = JSON.parse(readFileSync(seedPath, "utf8"));
  const database = createDatabase(databasePath, seed);
  const sessions = new Map();
  const app = createServer(async (request, response) => {
    const url = new URL(request.url || "/", "http://127.0.0.1");
    const method = request.method || "GET";
    const cookies = parseCookies(request.headers.cookie);
    const sessionId = cookies.rr_session;
    const authenticated = sessionId && sessions.get(sessionId);
    const jsonHeaders = {};

    try {
      if (method === "GET" && url.pathname === "/api/health") {
        return sendJson(response, 200, { status: "ok", database: "sqlite" });
      }

      if (method === "POST" && url.pathname === "/api/auth/login") {
        const body = await readJson(request);
        const validEmail =
          typeof body.email === "string" &&
          body.email.trim().toLowerCase() === demoEmail;
        const validPassword =
          typeof body.password === "string" && body.password === demoPassword;
        const validCode =
          typeof body.mfaCode === "string" && body.mfaCode === demoMfaCode;

        if (!validEmail || !validPassword || !validCode) {
          const failedEntry = {
            id: `AUD-${Date.now()}-${randomBytes(3).toString("hex")}`,
            time: new Date().toLocaleString("id-ID"),
            ageHours: 0,
            actor: "Tidak dikenal",
            role: "—",
            action: "Login gagal",
            object: "Admin CMS",
            reason: "Kredensial atau kode MFA tidak cocok",
          };
          database
            .prepare("INSERT INTO audit_entries (id, data) VALUES (?, ?)")
            .run(failedEntry.id, JSON.stringify(failedEntry));
          return sendJson(response, 401, {
            ok: false,
            message: !validCode
              ? "Kode MFA tidak cocok."
              : "Email atau kata sandi tidak cocok.",
          });
        }

        const nextSessionId = randomBytes(32).toString("base64url");
        sessions.set(nextSessionId, { email: demoEmail });
        const secureCookie =
          process.env.NODE_ENV === "production" ? "; Secure" : "";
        jsonHeaders["Set-Cookie"] =
          `rr_session=${nextSessionId}; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800${secureCookie}`;
        return sendJson(
          response,
          200,
          { ok: true, message: "Login berhasil." },
          jsonHeaders,
        );
      }

      if (method === "GET" && url.pathname === "/api/auth/session") {
        return sendJson(response, 200, {
          authenticated: Boolean(authenticated),
        });
      }

      if (method === "POST" && url.pathname === "/api/auth/logout") {
        if (sessionId) sessions.delete(sessionId);
        return sendJson(
          response,
          200,
          { ok: true },
          {
            "Set-Cookie":
              "rr_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0",
          },
        );
      }

      if (!authenticated) {
        return sendJson(response, 401, {
          error: "Authentication required.",
          code: "UNAUTHENTICATED",
        });
      }

      if (method === "GET" && url.pathname === "/api/users") {
        const rows = database
          .prepare("SELECT data FROM users ORDER BY rowid ASC")
          .all();
        return sendJson(response, 200, rows.map(parseRecord));
      }

      if (method === "POST" && url.pathname === "/api/users") {
        const user = await readJson(request);
        if (
          !user ||
          typeof user.id !== "string" ||
          typeof user.name !== "string" ||
          !user.id.trim() ||
          !user.name.trim()
        ) {
          return sendJson(response, 400, { error: "Invalid user record." });
        }
        try {
          database
            .prepare("INSERT INTO users (id, data) VALUES (?, ?)")
            .run(user.id, JSON.stringify(user));
        } catch (error) {
          if (error.code === "SQLITE_CONSTRAINT_PRIMARYKEY") {
            return sendJson(response, 409, {
              error: `User already exists: ${user.id}`,
            });
          }
          throw error;
        }
        return sendJson(response, 201, user);
      }

      const userMatch = url.pathname.match(/^\/api\/users\/([^/]+)$/);
      if (userMatch) {
        const id = decodeURIComponent(userMatch[1]);
        if (method === "PUT") {
          const user = await readJson(request);
          if (!user || user.id !== id || typeof user.name !== "string") {
            return sendJson(response, 400, { error: "Invalid user record." });
          }
          const result = database
            .prepare(
              "UPDATE users SET data = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
            )
            .run(JSON.stringify(user), id);
          if (result.changes === 0) {
            return sendJson(response, 404, { error: `User not found: ${id}` });
          }
          return sendJson(response, 200, user);
        }
        if (method === "DELETE") {
          const result = database
            .prepare("DELETE FROM users WHERE id = ?")
            .run(id);
          if (result.changes === 0) {
            return sendJson(response, 404, { error: `User not found: ${id}` });
          }
          return sendJson(response, 204, null);
        }
      }

      if (method === "GET" && url.pathname === "/api/audit") {
        const rows = database
          .prepare(
            "SELECT data FROM audit_entries ORDER BY created_at DESC, rowid DESC",
          )
          .all();
        return sendJson(response, 200, rows.map(parseRecord));
      }

      if (method === "POST" && url.pathname === "/api/audit") {
        const entry = await readJson(request);
        if (
          !entry ||
          typeof entry.id !== "string" ||
          typeof entry.action !== "string" ||
          typeof entry.actor !== "string" ||
          typeof entry.reason !== "string"
        ) {
          return sendJson(response, 400, { error: "Invalid audit entry." });
        }
        try {
          database
            .prepare("INSERT INTO audit_entries (id, data) VALUES (?, ?)")
            .run(entry.id, JSON.stringify(entry));
        } catch (error) {
          if (error.code === "SQLITE_CONSTRAINT_PRIMARYKEY") {
            return sendJson(response, 409, {
              error: `Audit entry already exists: ${entry.id}`,
            });
          }
          throw error;
        }
        return sendJson(response, 201, entry);
      }

      return sendJson(response, 404, { error: "Route not found." });
    } catch (error) {
      if (response.headersSent) {
        response.destroy(error);
        return;
      }
      if (error.status) {
        return sendJson(response, error.status, { error: error.message });
      }
      console.error("Local API request failed.", error);
      return sendJson(response, 500, { error: "Internal server error." });
    }
  });

  return {
    server: app,
    close() {
      sessions.clear();
      database.close();
    },
  };
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const { server } = createAppServer();
  const port = Number(process.env.API_PORT) || 3001;
  server.listen(port, "127.0.0.1", () => {
    console.log(`RuangRasa local API listening at http://127.0.0.1:${port}`);
  });
}

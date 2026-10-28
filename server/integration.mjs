import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { after, before, test } from "node:test";
import { createAppServer } from "./index.mjs";

let directory;
let databasePath;
let app;
let baseUrl;
let server;
let cookie;

async function startServer() {
  app = createAppServer({ databasePath });
  server = app.server;
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  baseUrl = `http://127.0.0.1:${address.port}`;
}

async function stopServer() {
  if (server?.listening) {
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  }
  app?.close();
}

async function login() {
  const response = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "nama@ruangrasa.id",
      password: "ruangrasa",
      mfaCode: "123456",
    }),
  });
  assert.equal(response.status, 200);
  cookie = response.headers.get("set-cookie").split(";")[0];
}

async function apiFetch(route, options = {}) {
  return fetch(`${baseUrl}/api${route}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      Cookie: cookie,
      ...options.headers,
    },
  });
}

before(async () => {
  directory = await mkdtemp(path.join(os.tmpdir(), "ruangrasa-api-"));
  databasePath = path.join(directory, "test.sqlite");
  await startServer();
});

after(async () => {
  await stopServer();
  await rm(directory, { recursive: true, force: true });
});

test("protects domain routes and verifies the simulated server-side MFA", async () => {
  const unauthorized = await fetch(`${baseUrl}/api/users`);
  assert.equal(unauthorized.status, 401);

  const rejected = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "nama@ruangrasa.id",
      password: "ruangrasa",
      mfaCode: "000000",
    }),
  });
  assert.equal(rejected.status, 401);
  assert.equal((await rejected.json()).message, "Kode MFA tidak cocok.");

  await login();
  const audit = await apiFetch("/audit");
  assert.equal(audit.status, 200);
  assert.ok(
    (await audit.json()).some((entry) => entry.action === "Login gagal"),
  );
});

test("supports user CRUD and persists user and audit changes in SQLite", async () => {
  const listResponse = await apiFetch("/users");
  assert.equal(listResponse.status, 200);
  const users = await listResponse.json();
  assert.equal(users.length, 12);

  const created = { ...users[0], id: "RR-API-TEST", name: "API Test" };
  const createResponse = await apiFetch("/users", {
    method: "POST",
    body: JSON.stringify(created),
  });
  assert.equal(createResponse.status, 201);

  const updated = { ...created, status: "Diblokir" };
  const updateResponse = await apiFetch(`/users/${created.id}`, {
    method: "PUT",
    body: JSON.stringify(updated),
  });
  assert.equal((await updateResponse.json()).status, "Diblokir");

  const auditEntry = {
    id: "AUD-API-TEST",
    time: "28 Okt 2026 · 15:00",
    ageHours: 0,
    actor: "Admin Demo",
    role: "Super Admin",
    action: "Tes API",
    object: created.id,
    reason: "Validasi integrasi API",
  };
  assert.equal(
    (
      await apiFetch("/audit", {
        method: "POST",
        body: JSON.stringify(auditEntry),
      })
    ).status,
    201,
  );

  await stopServer();
  await startServer();
  await login();
  const persistedUsers = await (await apiFetch("/users")).json();
  assert.equal(
    persistedUsers.find((user) => user.id === created.id).status,
    "Diblokir",
  );
  const persistedAudit = await (await apiFetch("/audit")).json();
  assert.ok(persistedAudit.some((entry) => entry.id === auditEntry.id));

  assert.equal(
    (
      await apiFetch(`/users/${created.id}`, {
        method: "DELETE",
      })
    ).status,
    204,
  );
  assert.equal(
    (await apiFetch(`/users/${created.id}`, { method: "DELETE" })).status,
    404,
  );
});

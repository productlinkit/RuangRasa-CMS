import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectDirectory = path.dirname(
  path.dirname(fileURLToPath(import.meta.url)),
);
const children = [
  spawn(
    process.execPath,
    [path.join(projectDirectory, "server", "index.mjs")],
    {
      cwd: projectDirectory,
      env: process.env,
      stdio: "inherit",
    },
  ),
  spawn(
    process.execPath,
    [path.join(projectDirectory, "node_modules", "vite", "bin", "vite.js")],
    {
      cwd: projectDirectory,
      env: process.env,
      stdio: "inherit",
    },
  ),
];

let stopping = false;

function stop(signal) {
  if (stopping) return;
  stopping = true;
  for (const child of children) {
    if (child.exitCode === null) child.kill(signal);
  }
}

for (const child of children) {
  child.on("error", (error) => {
    console.error("Unable to start a local development process.", error);
    stop("SIGTERM");
    process.exitCode = 1;
  });
  child.on("exit", (code) => {
    if (!stopping) {
      process.exitCode = code || 0;
      stop("SIGTERM");
    }
  });
}

process.on("SIGINT", () => stop("SIGINT"));
process.on("SIGTERM", () => stop("SIGTERM"));

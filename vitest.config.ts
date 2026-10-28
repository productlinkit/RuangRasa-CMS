import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    clearMocks: true,
    coverage: {
      provider: "v8",
      include: ["src/services/**/*.ts", "src/components/ProtectedRoute.tsx"],
      reporter: ["text", "html"],
    },
  },
});

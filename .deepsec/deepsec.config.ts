import { defineConfig } from "deepsec/config";

import { generatedMatchersPlugin } from "./generated-matchers.js";

export default defineConfig({
  ai: { mode: "gateway", provider: "vercel" },
  defaultAgent: "pi",
  defaultModel: "xai/grok-4.6",
  defaultThinkingLevel: "medium",
  projects: [
    {
      id: "tracker",
      root: "..",
      githubUrl: "https://github.com/blockmatic/basilic-tracker/blob/main",
      priorityPaths: [
        "apps/api",
        "apps/web",
        "packages/core",
        "packages/react",
        "packages/markets",
        "packages/onchain",
      ],
    },
    // <deepsec:projects-insert-above>
  ],
  plugins: [generatedMatchersPlugin],
});

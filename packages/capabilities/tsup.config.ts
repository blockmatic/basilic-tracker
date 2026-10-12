import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  dts: false,
  entry: { index: "src/index.ts" },
  external: [/^@repo\//, "@json-render/core", "zod"],
  format: ["esm"],
  outDir: "dist",
  sourcemap: true,
});

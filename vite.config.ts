/// <reference types="vitest/config" />
import path from "path";

import typescript from "@rollup/plugin-typescript";
import {defineConfig} from "vite";

import gas from "./plugins";

export default defineConfig({
  plugins: [
    gas({
      manifest: {
        copy: true,
        filepath: path.join("src", "appsscript.json"),
      },
      verbose: true,
    }),
    typescript(),
  ],
  build: {
    rollupOptions: {
      input: "src/index.ts",
      output: {
        dir: "dist",
        entryFileNames: "main.js",
      },
    },
    emptyOutDir: false,
    minify: false, // trueにすると関数名が消えるのでfalse必須
    target: "es2015",
    sourcemap: true,
  },
  esbuild: false,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "node",
  },
});

import federation from "@originjs/vite-plugin-federation"
import react from "@vitejs/plugin-react"
import path from "path"
import { defineConfig } from "vite"
import dts from "vite-plugin-dts"

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      include: ["src/components/form/**/*.ts", "src/components/form/**/*.tsx"],
      outDir: "dist/types",
      staticImport: true,
      rollupTypes: true,
    }),
    federation({
      name: "form",
      filename: "remoteEntry.js",
      exposes: {
        "./Forms": "./src/components/form/index.ts",
      },
      shared: ["react", "react-dom"],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "esnext",
    outDir: "dist",
    modulePreload: false,
    minify: false,
    cssCodeSplit: false,
  },
})

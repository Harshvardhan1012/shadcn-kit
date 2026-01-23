import federation from "@originjs/vite-plugin-federation"
import react from "@vitejs/plugin-react"
import path from "path"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "hostApp",
      filename: "remoteEntry.js",
      exposes: {
        "./card": "./src/components/ui/card.tsx",
      },
      shared: ["react", "react-dom"],
    }),
  ],
  server: {
    port: 3000,
    cors: true,
    strictPort: true,
  },
  preview: {
    port: 3000,
    strictPort: true,
  },
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

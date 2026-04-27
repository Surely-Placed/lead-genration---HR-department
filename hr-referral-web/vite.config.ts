import path from "node:path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  /** Expose GOOGLE_* alongside VITE_* so Apps Script URL/secret don’t need a VITE_ prefix. */
  envPrefix: ["VITE_", "GOOGLE_"],
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})

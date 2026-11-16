import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// BASE_PATH=/repo-name/ is for GitHub project pages. User/org sites and Vercel use /.
const base = process.env.BASE_PATH || "/";

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0",
    port: 47281,
    strictPort: true,
  },
  preview: {
    host: "0.0.0.0",
    port: 47281,
    strictPort: true,
  },
});

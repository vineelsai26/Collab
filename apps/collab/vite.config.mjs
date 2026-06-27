import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes("node_modules/monaco-editor") ||
            id.includes("node_modules/@monaco-editor")
          )
            return "editor";
          if (
            id.includes("node_modules/@mui") ||
            id.includes("node_modules/@emotion")
          )
            return "mui";
          if (id.includes("node_modules/@tanstack")) return "query";
        },
      },
    },
  },
});

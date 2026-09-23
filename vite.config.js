import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: { outDir: "build" }, // opcional: evita tocar la config del deploy
});

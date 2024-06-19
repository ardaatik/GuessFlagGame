/// <reference types="vitest" />
/// <reference types="vite/client" />

import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), svgr()],
	resolve: {
		alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
	},
	server: {
		port: 5173,
	},
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: "./src/tests/setup.ts",
	},
	build: {
		outDir: "../server/client-build",
	},
});

import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { codeInspectorPlugin } from "code-inspector-plugin";
import { codeJumpPlugin } from "./vite-plugins/code-jump-plugin.ts";

// https://astro.build/config
export default defineConfig({
  server: {
    host: true,
    open: true,
    port: 4321,
  },
  vite: {
    plugins: [
      tailwindcss(),
      codeInspectorPlugin({
        bundler: "vite",
      }),
      codeJumpPlugin({
        hotkey: "F2",
        editor: "cursor", // Note: need to configure the specific editor commands.
      }),
    ],
    ssr: {
      noExternal: ["katex"],
    },
  },

  integrations: [react(), mdx(), sitemap()],
  output: "server",
  adapter: cloudflare(),
});

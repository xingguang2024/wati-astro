// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { codeJumpPlugin } from "./vite-plugins/code-jump-plugin.ts";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [
      tailwindcss(),
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
  adapter: cloudflare(),
});

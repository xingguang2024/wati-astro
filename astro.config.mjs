// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { codeJumpPlugin } from "./vite-plugins/code-jump-plugin.ts";

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
  },

  integrations: [react(), mdx(), sitemap()],
});


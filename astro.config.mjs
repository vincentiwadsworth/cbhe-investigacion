// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  integrations: [
    icon({
      include: {
        "material-symbols": [
          "bolt",
          "search",
          "arrow-forward",
          "explore",
          "engineering",
          "factory",
          "local-shipping",
          "handyman",
          "check-circle",
          "send",
          "flag",
          "visibility",
          "landscape",
          "precision-manufacturing",
          "route",
          "support-agent",
          "school",
          "arrow-downward",
          "calendar-today",
          "schedule",
          "desktop-windows",
          "apartment",
          "devices",
          "refresh",
          "verified",
          "security",
          "account-balance",
          "science",
          "language",
          "architecture",
          "category",
          "history",
          "expand-more",
        ],
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});

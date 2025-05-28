import type { Config } from "tailwindcss";
import sharedConfigs from "@repo/tailwind-config";

const config: Config = {
  content: [
    "./**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./packages/ui/**/*.{js,ts,jsx,tsx}",
    "../../packages/**/*.{js,ts,jsx,tsx}",
    "./ui/**/*.{ts,tsx}",
  ],
  ...sharedConfigs,
};

export default config;

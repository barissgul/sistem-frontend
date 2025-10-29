import type { Config } from "tailwindcss";

const config: Pick<Config, "content"> = {
  content: [
    "./src/**/*.tsx",
    "./node_modules/rizzui/dist/*.{js,ts,jsx,tsx}",
  ],
};

export default config;

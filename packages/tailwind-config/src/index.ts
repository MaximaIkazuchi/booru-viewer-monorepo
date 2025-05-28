import type { Config } from "tailwindcss";

const sharedConfigs: Config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ["Montserrat", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default sharedConfigs;

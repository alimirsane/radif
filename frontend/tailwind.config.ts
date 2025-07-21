import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  safelist: [
    {
      pattern:
        /bg-(primary|secondary|info|success|error|warning|paper|pending)-(light|dark)/,
      variants: ["hover", "focus"],
    },
    {
      pattern:
        /bg-(primary|secondary|info|success|error|warning|paper|pending)/,
      variants: ["hover", "focus"],
    },
    {
      pattern: /bg-(common)-(black|white|gray)/,
      variants: ["hover", "focus"],
    },
    {
      pattern: /bg-(common)-(gray)-(dark)/,
      variants: ["hover", "focus"],
    },
    {
      pattern: /bg-(background)-(default)/,
      variants: ["hover", "focus"],
    },
    {
      pattern: /bg-(background)-(paper)/,
      variants: ["hover", "focus"],
    },
    {
      pattern: /bg-(background)-(paper)-(light|dark)/,
      variants: ["hover", "focus"],
    },
    {
      pattern: /text-(typography)-(main|secondary|gray)/,
      variants: ["hover", "focus"],
    },
    {
      pattern:
        /text-(primary|secondary|info|success|error|warning|paper|pending)-(constraint)/,
      variants: ["hover", "focus"],
    },
    {
      pattern:
        /text-(primary|secondary|info|success|error|warning|paper|pending)/,
      variants: ["hover", "focus"],
    },
  ],
  theme: {
    colors: {
      transparent: "#00000000",
      common: {
        black: "#000000",
        gray: {
          DEFAULT: "#667080",
          dark: "#373737",
        },
        white: "#ffffff",
      },
      typography: {
        main: "#000000",
        gray: "#6D6D6D",
        secondary: "#999CA0",
      },
      background: {
        default: "#FFFFFF",
        paper: {
          light: "#FAFAFA",
          DEFAULT: "#F1F1F1",
          dark: "#E8E8E8",
        },
      },
      paper: {
        light: "#b5b5b5",
        DEFAULT: "#999999",
        dark: "#E8E8E8",
        constraint: "#FFFFFF",
      },
      primary: {
        light: "#9c95ff",
        DEFAULT: "#4E46B4",
        dark: "#1e196a",
        constraint: "#FFFFFF",
      },
      secondary: {
        light: "#E1CAFF",
        DEFAULT: "#9747FF",
        dark: "#5e00d2",
        constraint: "#FFFFFF",
      },
      info: {
        light: "#07b0ff",
        DEFAULT: "#0D6DF2",
        dark: "#0045a0",
        constraint: "#FFFFFF",
      },
      error: {
        light: "#ffa0c6",
        DEFAULT: "#FF0000",
        dark: "#820000",
        constraint: "#FFFFFF",
      },
      success: {
        light: "#9bffdb",
        DEFAULT: "#07A570",
        dark: "#004a2f",
        constraint: "#FFFFFF",
      },
      warning: {
        light: "#ffe19d",
        DEFAULT: "#C68F00",
        dark: "#634a0c",
        constraint: "#FFFFFF",
      },
      pending: {
        light: "#f8a04d",
        DEFAULT: "#ff7d04",
        dark: "#bb5b02",
        constraint: "#FFFFFF",
      },
    },
    screens: {
      xxs: "0px",
      xs: "414px",
      sm: "576px",
      md: "768px",
      lg: "992px",
      xl: "1200px",
      xxl: "1500px",
    },
    extend: {},
  },
  plugins: [],
};
export default config;

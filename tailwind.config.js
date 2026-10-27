/** @type {import('tailwindcss').Config} */
const defaultColors = require("tailwindcss/colors");
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontsize: {
        base: "1px",
      },
      backgroundImage: {
        marketLinear: "linear-gradient(179.27deg, #CCDCEE 0.63%, #FFFFFF 73.46%)",
      },
    },
    colors: {
      ...defaultColors,
      primary: "#F21C29",
      backgroundcolor: "#F4F4F4",
    },

    container: {
      padding: {
        DEFAULT: "0px",
        xs: "0rem",
        sm: "0rem",
        md: "20px",
        lg: "10px",
        xl: "10px",
        "2xl": "10px",
      },
    },
    screens: {
      xs: "320px",
      sm: "576px",
      md: "768px",
      lg: "992px",
      xl: "1200px",
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};

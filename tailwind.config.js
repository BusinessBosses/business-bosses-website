/** @type {import('tailwindcss').Config} */
const defaultColors = require("tailwindcss/colors");
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontsize: {
        base: "1px",
      },
    },
    colors: {
      ...defaultColors,
      primary: "#F21C29",
      backgroundcolor: "#F4F4F4",
    },

    container: {
      // padding: "",

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
    backgroundImage: {
      marketLinear: "linear-gradient(179.27deg, #CCDCEE 0.63%, #FFFFFF 73.46%)",
      // walletBg: "linear-gradient(103.02deg, #00FFFF -16.21%, #336699 50.42%)",
      // transparentBgLight: "linear-gradient(127.41deg, #FFFFFF 13.29%, rgba(51, 102, 153, 0.1) 100.52%)",
      // transparentBgDark: "linear-gradient(127.41deg, rgba(255, 255, 255, 0.3) 13.29%, rgba(51, 102, 153, 0.1) 100.52%)",
    },
    screens: {
      // xxs: "300px",
      xs: "320px",
      sm: "576px",
      // => @media (min-width: 576px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "992px",
      // => @media (min-width: 992px) { ... }

      xl: "1200px",
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};

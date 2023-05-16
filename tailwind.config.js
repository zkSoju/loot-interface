module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        wagmi: "Gilroy",
      },
      colors: {
        dark: "#191a22",
        sage: "#45ff79",
      },
    },
  },
  plugins: [require("tailwind-gradient-mask-image")],
};

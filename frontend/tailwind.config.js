export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#1976d2",
        success: "#17a697",
        warning: "#f9a825",
        danger: "#d32f2f",
        light: "#f5f5f5",
      },
      spacing: {
        xs: "0.5rem",
        sm: "1rem",
        md: "1.5rem",
        lg: "2rem",
        xl: "3rem",
        "2xl": "4rem",
      },
    },
  },
  plugins: [],
};

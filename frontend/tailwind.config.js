export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        clinic: {
          navy: "#12343B",
          teal: "#0E7C7B",
          mint: "#D7F4EA",
          coral: "#F06449",
          ink: "#1F2937"
        }
      },
      boxShadow: {
        soft: "0 10px 30px rgba(18, 52, 59, 0.08)"
      }
    }
  },
  plugins: []
};

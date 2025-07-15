/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Esto le dice a Tailwind que escanee todos los archivos JS, TS, JSX, TSX en la carpeta src/
  ],
  theme: {
    extend: {
      // Aquí puedes extender el tema de Tailwind si necesitas colores personalizados, fuentes, etc.
      fontFamily: {
        sans: ["Inter", "sans-serif"], // Usar Inter como fuente principal
      },
    },
  },
  plugins: [],
};

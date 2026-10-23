// import react from '@vitejs/plugin-react'
// import { defineConfig } from 'vite'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })



import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/register": "http://127.0.0.1:8000",
      "/login": "http://127.0.0.1:8000",
      "/jobs": "http://127.0.0.1:8000",
      "/apply": "http://127.0.0.1:8000",
      "/my-applications": "http://127.0.0.1:8000",
      "/logout": "http://127.0.0.1:8000",
    },
  },
});

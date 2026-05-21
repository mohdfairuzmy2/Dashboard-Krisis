import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/** GitHub Pages project site: https://<user>.github.io/<repo>/ */
const ghPages = process.env.VITE_GH_PAGES === 'true'
const base = process.env.VITE_BASE_URL || '/'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: ghPages ? base : '/',
})

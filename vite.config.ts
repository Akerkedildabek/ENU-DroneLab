import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Actions provides GITHUB_REPOSITORY="username/ENU-DroneLab".
// Override via VITE_BASE_PATH when hosting in a differently named folder.
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1]
const base = process.env.VITE_BASE_PATH || (repo ? `/${repo}/` : '/')

export default defineConfig({
  plugins: [react()],
  base,
  build: { target: 'es2022', sourcemap: false },
})

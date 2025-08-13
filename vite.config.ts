import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/cognizant-employee-library-system/', // Correct GitHub Pages base path
  build: {
    target: 'es2015', // Use compatible target
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Let Vite handle chunking automatically to avoid circular dependency issues
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@mui/material', '@mui/icons-material'],
  },
})

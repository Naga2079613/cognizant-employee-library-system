import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/cognizant-employee-library-system/', // Correct GitHub Pages base path
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React core
          if (id.includes('react') || id.includes('react-dom')) {
            return 'react-vendor';
          }
          // React Router
          if (id.includes('react-router')) {
            return 'router-vendor';
          }
          // Material-UI core
          if (id.includes('@mui/material') || id.includes('@emotion')) {
            return 'mui-core';
          }
          // Material-UI icons (separate chunk for icons)
          if (id.includes('@mui/icons-material')) {
            return 'mui-icons';
          }
          // Admin portal components
          if (id.includes('src/components/AdminPortal')) {
            return 'admin-portal';
          }
          // Employee portal components
          if (id.includes('src/components/EmployeePortal')) {
            return 'employee-portal';
          }
          // Common components and contexts
          if (id.includes('src/components/common') || id.includes('src/contexts')) {
            return 'common-components';
          }
          // Other node_modules
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
    // Optimize build
    target: 'esnext',
    // Increase chunk size warning limit to 1000kb
    chunkSizeWarningLimit: 1000,
  },
  // Enable tree shaking
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
})

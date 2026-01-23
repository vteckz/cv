/**
 * Linton Evans - 3D Interactive CV Portfolio
 * Copyright (c) 2025 Linton Evans. All rights reserved.
 *
 * This source code is proprietary and confidential.
 * Unauthorized copying, modification, distribution, or use of this code,
 * via any medium, is strictly prohibited without express written permission.
 *
 * Contact: linton.evans@outlook.com
 */

import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser'
  },
  server: {
    port: 3000,
    open: true
  }
});

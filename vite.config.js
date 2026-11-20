import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { youtubeAudioPlugin } from './src/serverPlugin.js';

export default defineConfig({
  plugins: [react(), youtubeAudioPlugin()],
  server: {
    port: 3000,
    host: true
  }
});

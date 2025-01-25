import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env variables based on mode
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    // if local development, set base to '/' else set to '/snake-game/' but it will work on gh-pages only
    base: env.VITE_DEPLOY_ENV === 'local' ? '' : '/snake-game/',
  };
});
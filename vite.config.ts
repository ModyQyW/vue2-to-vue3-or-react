import { defineConfig } from 'vite';

export default defineConfig({
  // @ts-ignore
  slidev: {
    vue: {
      refTransform: true,
    },
  },
});

import react from '@vitejs/plugin-react';

const config = {
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
    },
    server: {
      deps: {
        inline: ['vitest-canvas-mock', '@patternfly'],
      },
    },
    testTimeout: 10000,
    fileParallelism: false,
  },
  resolve: {
    mainFields: ['module'],
  },
  esbuild: {
    loader: 'tsx',
    include: /src\/.*\.[tj]sx?$/,
    exclude: [],
  },
};

export default config;

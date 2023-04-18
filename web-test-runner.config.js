import { esbuildPlugin } from '@web/dev-server-esbuild';

export default {
  files: ['src/**/*.web.test.ts'],
  plugins: [esbuildPlugin({ ts: true })],
    nodeResolve: true
};
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/family-hub-card.js',
  output: { file: 'dist/family-hub-card.js', format: 'es', sourcemap: false },
  plugins: [resolve(), terser()],
};

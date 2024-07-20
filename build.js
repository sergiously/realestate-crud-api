import { build } from 'esbuild';
import { copy } from 'esbuild-plugin-copy';
import { dependencies } from './package.json';

build({
  entryPoints: ['src/app.ts'],
  bundle: true,
  minify: true,
  external: Object.keys(dependencies),
  platform: 'node',
  outfile: 'dist/app.js',
  plugins: [
    copy({
      assets: {
        from: ['./config/**'],
        to: ['./'],
      }
    })
  ]
});
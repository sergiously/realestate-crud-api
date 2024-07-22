const { build } = require('esbuild');
const { copy } = require('esbuild-plugin-copy');
const { dependencies } = require('./package.json');

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
        to: ['./config'],
      }
    })
  ]
});
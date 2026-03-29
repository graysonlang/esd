import pluginImp from './plugins/esbuild-plugin-imp.mjs';

export default function getOptions(args, verbose, logger) {
  return {
    assetNames: '[name]',
    bundle: true,
    entryPoints: ['./src/main.mjs'],
    format: 'esm',
    loader: {
      '.html': 'file',
    },
    metafile: true,
    outdir: 'dist',
    outExtension: {'.js': '.mjs'},
    plugins: [
      pluginImp({ logger, verbose }),
    ],
    sourcemap: true,
    target: [ 'esnext' ],
    ...args,
  };
}

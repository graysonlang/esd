import pluginGlobCopy from '@graysonlang/esp/esbuild-plugin-glob-copy';
import pluginImp from '@graysonlang/esp/esbuild-plugin-imp';

export default function getOptions(args, verbose, logger) {
  return {
    assetNames: '[name]',
    bundle: true,
    entryPoints: {
      'index': 'src/index.js',
      'main': 'app/main.js',
    },
    format: 'esm',
    loader: {
      '.html': 'file',
    },
    metafile: true,
    outdir: 'dist',
    plugins: [
      pluginGlobCopy({ logger }),
      pluginImp({ logger, verbose }),
    ],
    sourcemap: true,
    target: ['esnext'],
    ...args,
  };
}

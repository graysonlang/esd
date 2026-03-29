import { parseArgs } from 'node:util';

import esbuild from 'esbuild';
import getOptions from './options.mjs';

async function main() {
  const args = parseArgs({
    options: {
      verbose: { type: 'boolean', short: 'v', default: false },
      watch: { type: 'boolean', short: 'w', default: false },
    },
  });

  const options = getOptions(
    {
      minify: true,
    },
    args.values.verbose
  );

  try {
    if (args.values.watch) {
      const ctx = await esbuild.context(options);
      await ctx.watch();
    } else {
      await esbuild.build(options);
    }
  } catch(err) {
    console.error(err);
    process.exit(1);
  }

}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

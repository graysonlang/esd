import { parseArgs } from 'node:util';

import esbuild from 'esbuild';
import getOptions from './options.mjs';
import pluginVscodeProblemMatcher from './plugins/esbuild-plugin-vscode-problem-matcher.mjs';
import { printErrorsAndWarnings } from './plugins/esbuild-problem-format.mjs';

async function main() {
  const args = parseArgs({
    options: {
      vscode: { type: 'boolean', default: false },
      verbose: { type: 'boolean', short: 'v', default: false },
      watch: { type: 'boolean', short: 'w', default: false },
    },
  });

  const watch = args.values.watch;

  const options = getOptions(
    {
      minify: true,
    },
    args.values.verbose
  );
  if (args.values.vscode && watch) {
    options.plugins.push(pluginVscodeProblemMatcher());
  }

  try {
    if (watch) {
      const ctx = await esbuild.context(options);
      await ctx.watch();
    } else {
      await esbuild.build(options);
    }
  } catch (err) {
    if (err.errors || err.warnings) {
      printErrorsAndWarnings(err);
    } else {
    console.error(err);
    }
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

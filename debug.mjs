import path from 'node:path';
import { parseArgs } from 'node:util';

import esbuild from 'esbuild';
import getOptions from './options.mjs';

function getBanner() {
  return `(() => {
    if (typeof window === 'undefined') return;
    const s = new EventSource('/esbuild');
    s.addEventListener('change', () => location.reload());
    s.addEventListener('error', () => s.close());
    })();`;
}

async function main() {
  const args = parseArgs({
    options: {
      host: { type: 'string', default: '127.0.0.1' },
      port: { type: 'string', default: '8000' },
      verbose: { type: 'boolean', short: 'v', default: false },
      watch: { type: 'boolean', short: 'w', default: true },
    },
  });

  const options = getOptions(
    {
      banner: { js: getBanner() },
      minify: false,
    },
    args.values.verbose,
    undefined,
  );

  const ctx = await esbuild.context(options);

  if (args.values.watch) {
    await ctx.watch();
  }

  const { hosts, port } = await ctx.serve({
    host: args.values.host,
    port: Number(args.values.port),
    servedir: options.outdir || path.dirname(options.outfile),
  });
  console.log(`[esbuild-ready] http://${hosts[0]}:${port}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

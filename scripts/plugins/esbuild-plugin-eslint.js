import Freshness from './freshness.js';

let _eslintModulePromise = null;

async function importESLint() {
  if (!_eslintModulePromise) {
    _eslintModulePromise = import("eslint").then(m => m.ESLint).catch(() => {
      _eslintModulePromise = null;
      throw new Error(
        "esbuild-plugin-eslint requires 'eslint' to be installed. " +
        "Run: npm install --save-dev eslint"
      );
    });
  }
  return _eslintModulePromise;
}

const candidateExtensions = [
  "js", "jsx", "ts", "tsx", "mjs", "cjs", "mts", "cts", "vue", "svelte"
];

async function buildFilterFromEslintConfig(ESLint, eslintOptions) {
  const eslint = new ESLint(eslintOptions);
  const matched = (await Promise.all(
    candidateExtensions.map(async ext => {
      const config = await eslint.calculateConfigForFile(`dummy.${ext}`);
      return config ? ext : null;
    })
  )).filter(Boolean);

  return new RegExp(`\\.(?:${matched.join("|")})$`);
}

export default ({
  throwOnWarning = false,
  throwOnError = false,
  ...eslintOptions
} = {}) => {
  let buildStartTime = 0;
  let lastOnLoadTime = 0;

  const _freshness = new Freshness();

  return {
    name: "eslint",
    setup: async (build) => {
      const ESLint = await importESLint();
      const eslint = new ESLint(eslintOptions);
      const filter = await buildFilterFromEslintConfig(ESLint, eslintOptions);
      const seenFiles = new Set();
      const dirtyFiles = new Set();

      build.onStart(() => {
        buildStartTime = Date.now();
      });

      build.onLoad({ filter }, ({ path }) => {
        lastOnLoadTime = Date.now();
        seenFiles.add(path);
        return null;
      });

      build.onEnd(async () => {
        if (buildStartTime > lastOnLoadTime) {
          return;
        }

        const { changed } = await _freshness.update(seenFiles);
        const filesToLint = [...new Set([...changed, ...dirtyFiles])];

        if (filesToLint.length === 0) {
          return;
        }

        console.log(filesToLint);

        const results = await eslint.lintFiles(filesToLint);
        const formatter = await eslint.loadFormatter();
        const output = await formatter.format(results);

        const warnings = results.reduce((count, result) => count + result.warningCount, 0);
        const errors = results.reduce((count, result) => count + result.errorCount, 0);

        for (const result of results) {
          if (result.warningCount > 0 || result.errorCount > 0) {
            dirtyFiles.add(result.filePath);
          } else {
            dirtyFiles.delete(result.filePath);
          }
        }

        if (eslintOptions.fix) {
          await ESLint.outputFixes(results);
        }

        if (output.length > 0) {
          console.log(output);
        }

        return {
          ...throwOnWarning && warnings > 0 && {
            errors: [{ text: `${warnings} warnings were found by eslint!` }]
          },
          ...throwOnError && errors > 0 && {
            errors: [{ text: `${errors} errors were found by eslint!` }]
          }
        };
      });
    }
  };
};

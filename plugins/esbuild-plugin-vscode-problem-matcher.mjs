import { printErrorsAndWarnings } from './esbuild-problem-format.mjs';

export default function createPlugin() {
  return {
    name: 'vscode-problem-matcher',
    setup(build) {
      build.onStart(() => {
        console.log('[watch] build started');
      });
      build.onEnd((result) => {
        printErrorsAndWarnings(result);
      });
    },
  };
}

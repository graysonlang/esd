import "./console.mjs";
import index from './index.html' assert { type: 'html' };
export function getFilePaths() { return { index } }

window.addEventListener('load', async () => {
  console.log('Hello, world!');

  debugger
  let a = 1;
  let b = 4;
  let c = a + b;
  console.log(c);
});

import './console.js';
import index from './index.html';
export function getFilePaths() {
  return { index };
};

window.addEventListener('load', async () => {
  console.log('Hello, world!');
  let a = 1;
  let b = 4;
  let c = a + b;
  console.log(c);
});

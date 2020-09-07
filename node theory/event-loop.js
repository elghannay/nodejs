const fs = require('fs');

console.log('code from the top level code');
setTimeout(() => {
  console.log('one second');
}, 1000);
setTimeout(() => {
  console.log('two second');
}, 2000);
// setImmediate runs first since they is no io callbacks
setImmediate(() => {
  console.log('setImmediate', 2000);
});
// next tick is executed before all of them since it gets executed at the
// end of each phase in event loop
process.nextTick(() => {
  console.log('next tick');
});
fs.readFile('text.txt', () => {
  console.log('reading file');
});

// set the thread pool threads
process.env.UV_THREADPOOL_SIZE = 1;

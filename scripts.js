const { workerData } = require('worker_threads');

console.log({
  workerData,
});
// Get the list of all worker threads
// const workerThreadList = workerThreads.workerThreads;

// // Iterate over the worker threads and display information
// workerThreadList.forEach((workerThread) => {
//   console.log('Worker Thread ID:', workerThread.threadId);
//   console.log('Worker Thread State:', workerThread.state);
//   console.log('Worker Thread Data:', workerThread.workerData);
//   console.log('-----------------------------');
// });

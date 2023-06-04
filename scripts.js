const fs = require('fs');
// const { Worker } = require('worker_threads');
const { spawn } = require('child_process');
const configFile = 'generic.config.json';
const configData = fs.readFileSync(configFile, 'utf8');
const genericConfig = JSON.parse(configData);

// require('./' + genericConfig.location + '/scripts');


// Create a new worker and specify the script file to run
// const worker = new Worker('./' + genericConfig.location + '/scripts');

// Spawn a new process in detached mode
const childProcess = spawn('node', ['./' + genericConfig.location + '/scripts'], {
    detached: true,
    stdio: 'ignore'
});

  // Unref the child process to allow the parent process to exit independently
childProcess.unref();

// Handle any error that might occur during spawning the process
childProcess.on('error', (err) => {
  console.error('Failed to start the script:', err);
});

// Log the child process ID
console.log('Child process ID:', childProcess.pid);

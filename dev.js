const { spawn } = require('child_process');
const path = require('path');

// Start backend
const backend = spawn('npm', ['run', 'server'], {
  stdio: 'inherit',
  shell: true
});

// Wait for 2 seconds then start frontend
setTimeout(() => {
  const frontend = spawn('npm', ['start'], {
    stdio: 'inherit',
    shell: true
  });

  frontend.on('error', (err) => {
    console.error('Frontend Error:', err);
    backend.kill();
    process.exit(1);
  });
}, 2000);

backend.on('error', (err) => {
  console.error('Backend Error:', err);
  process.exit(1);
});
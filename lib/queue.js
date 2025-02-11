// lib/queue.js
import Queue from 'bull';

// Create and export a Bull queue instance named "userQueue"
// (Ensure Redis is running on localhost:6379)
const userQueue = new Queue('userQueue', {
  redis: { host: '127.0.0.1', port: 6379 },
});

export default userQueue;

// worker.js
import userQueue from './lib/queue';
import axios from 'axios';

// Process jobs from the queue.
userQueue.process(async (job) => {
  const userData = job.data;
  try {
    // Replace with the actual external API endpoint.
    const response = await axios.post('https://example.com/api/addUser', userData);
    console.log(`User added: ${userData.email}`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error adding user ${userData.email}:`, error.message);
    throw error;
  }
});

console.log('Worker is running and processing jobs...');

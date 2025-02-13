This file guides you on how to install all the necessary tools and run the application.

## Getting Started

First, create a new Nextjs project:

**npx create-next-app nextjs-csv-processing**
**cd nextjs-csv-processing**

install all the necessary packages:

**npm install multer csv-parser bull axios redis**

install redis from the link below:

**https://github.com/microsoftarchive/redis/releases**

start Redis:

**redis-server**

start Nextjs development server:

**npm run dev**

Start the worker process in a separate terminal:

**npm run worker**



##Summary of the project##

Frontend (index.js) → Uploads CSV.
Backend (upload.js) → Parses file, queues jobs.
Queue (queue.js) → Stores jobs in Redis.
Worker (worker.js) → Processes jobs (sends to API OR saves to MongoDB).
MongoDB (Optional) → Stores users locally.
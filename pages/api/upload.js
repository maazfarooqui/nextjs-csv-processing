// pages/api/upload.js
import multer from 'multer';
import csv from 'csv-parser';
import fs from 'fs';
import userQueue from '../../lib/queue';

// Configure multer storage to save files to the "uploads" directory.
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads'); // Ensure this folder exists.
    },
    filename: (req, file, cb) => {
      // Save using the original filename.
      cb(null, file.originalname);
    },
  }),
});

// Helper function to run middleware (since Next.js API routes are not Express-based)
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export const config = {
  api: {
    bodyParser: false, // Disable Next.js's default body parser to allow Multer to work.
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Process the file upload using Multer.
      await runMiddleware(req, res, upload.single('file'));
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }

    // Get the path of the uploaded file.
    const filePath = req.file.path;
    const results = [];

    // Parse the CSV file.
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        // Validate that required fields "name" and "email" exist.
        if (data.name && data.email) {
          results.push(data);
        }
      })
      .on('end', async () => {
        // Remove the temporary file.
        fs.unlinkSync(filePath);

        // Add a job for each valid user record.
        for (const userData of results) {
          await userQueue.add(userData);
        }

        res.status(200).json({
          message: 'File processed and jobs added.',
          users: results.length,
        });
      })
      .on('error', (err) => {
        res.status(500).json({ error: err.message });
      });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

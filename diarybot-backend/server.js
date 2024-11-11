// server.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// PostgreSQL Pool Setup (Neon)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// AWS SDK Configuration for Cloudflare R2
const s3 = new AWS.S3({
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  accessKeyId: process.env.R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  region: 'auto',
  signatureVersion: 'v4',
});

// Multer-S3 Setup for File Uploads to R2
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.R2_BUCKET_NAME,
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + '-' + file.originalname);
    },
  }),
});

// Helper Function to Authenticate JWT Tokens
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Access Token Required' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid Token' });
    req.user = user;
    next();
  });
};

// Routes

// User Registration
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Validate Input
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    // Check if user already exists
    const userCheck = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (userCheck.rows.length > 0) {
      return res.status(409).json({ message: 'Username already exists.' });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert User into Database
    const newUser = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username',
      [username, hashedPassword]
    );

    res.status(201).json({ message: 'User registered successfully.', user: newUser.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error.' });
  }
});

// User Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Validate Input
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    // Check if user exists
    const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Compare Passwords
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Generate JWT Token
    const token = jwt.sign({ userId: user.rows[0].id, username: user.rows[0].username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get All Diary Entries (Protected)
app.get('/entries', authenticateToken, async (req, res) => {
  try {
    const entries = await pool.query('SELECT * FROM entries WHERE user_id = $1 ORDER BY date DESC', [req.user.userId]);
    res.json(entries.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Create a New Diary Entry (Protected)
app.post('/entries', authenticateToken, async (req, res) => {
  const { date, content } = req.body;

  if (!date) {
    return res.status(400).json({ message: 'Date is required.' });
  }

  try {
    const newEntry = await pool.query(
      'INSERT INTO entries (user_id, date, content) VALUES ($1, $2, $3) RETURNING *',
      [req.user.userId, date, content]
    );
    res.status(201).json(newEntry.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Update a Diary Entry (Protected)
app.put('/entries/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { date, content } = req.body;

  try {
    // Check if entry exists and belongs to the user
    const entry = await pool.query('SELECT * FROM entries WHERE id = $1 AND user_id = $2', [id, req.user.userId]);
    if (entry.rows.length === 0) {
      return res.status(404).json({ message: 'Entry not found.' });
    }

    // Update Entry
    const updatedEntry = await pool.query(
      'UPDATE entries SET date = $1, content = $2 WHERE id = $3 RETURNING *',
      [date, content, id]
    );

    res.json(updatedEntry.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Delete a Diary Entry (Protected)
app.delete('/entries/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    // Check if entry exists and belongs to the user
    const entry = await pool.query('SELECT * FROM entries WHERE id = $1 AND user_id = $2', [id, req.user.userId]);
    if (entry.rows.length === 0) {
      return res.status(404).json({ message: 'Entry not found.' });
    }

    // Delete Entry
    await pool.query('DELETE FROM entries WHERE id = $1', [id]);

    res.json({ message: 'Entry deleted successfully.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get All Notes (Protected)
app.get('/notes', authenticateToken, async (req, res) => {
  try {
    const notes = await pool.query('SELECT * FROM notes WHERE user_id = $1 ORDER BY id DESC', [req.user.userId]);
    res.json(notes.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Create a New Note (Protected)
app.post('/notes', authenticateToken, async (req, res) => {
  const { parent_id, name, content, type } = req.body;

  if (!name || !type) {
    return res.status(400).json({ message: 'Name and type are required.' });
  }

  if (!['note', 'flashcard'].includes(type)) {
    return res.status(400).json({ message: 'Invalid type. Must be "note" or "flashcard".' });
  }

  try {
    const newNote = await pool.query(
      'INSERT INTO notes (user_id, parent_id, name, content, type) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.user.userId, parent_id || null, name, content || null, type]
    );
    res.status(201).json(newNote.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Update a Note (Protected)
app.put('/notes/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, content, type } = req.body;

  if (type && !['note', 'flashcard'].includes(type)) {
    return res.status(400).json({ message: 'Invalid type. Must be "note" or "flashcard".' });
  }

  try {
    // Check if note exists and belongs to the user
    const note = await pool.query('SELECT * FROM notes WHERE id = $1 AND user_id = $2', [id, req.user.userId]);
    if (note.rows.length === 0) {
      return res.status(404).json({ message: 'Note not found.' });
    }

    // Update Note
    const updatedNote = await pool.query(
      'UPDATE notes SET name = $1, content = $2, type = $3 WHERE id = $4 RETURNING *',
      [name || note.rows[0].name, content || note.rows[0].content, type || note.rows[0].type, id]
    );

    res.json(updatedNote.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Delete a Note (Protected)
app.delete('/notes/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    // Check if note exists and belongs to the user
    const note = await pool.query('SELECT * FROM notes WHERE id = $1 AND user_id = $2', [id, req.user.userId]);
    if (note.rows.length === 0) {
      return res.status(404).json({ message: 'Note not found.' });
    }

    // Delete Note
    await pool.query('DELETE FROM notes WHERE id = $1', [id]);

    res.json({ message: 'Note deleted successfully.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Upload a File to Cloudflare R2 (Protected)
app.post('/upload', authenticateToken, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'File upload failed.' });
  }

  res.status(201).json({
    message: 'File uploaded successfully.',
    fileUrl: req.file.location, // URL to access the file
  });
});

// Download a File from Cloudflare R2 (Protected)
app.get('/download/:key', authenticateToken, async (req, res) => {
  const { key } = req.params;

  try {
    const params = {
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
    };

    // Get the file from R2
    const fileStream = s3.getObject(params).createReadStream();

    // Set headers
    res.attachment(key);
    fileStream.pipe(res);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Error downloading file.' });
  }
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});

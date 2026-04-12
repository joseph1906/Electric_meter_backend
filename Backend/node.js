const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log('🚀 Starting server...');

const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'Mamanlucie1906@@',
  database: 'ReactTask',
  port: 3306
});

let isDbConnected = false;

db.connect((err) => {
  if (err) {
    console.error('❌ MySQL connection error:', err.message);
  } else {
    isDbConnected = true;
    console.log('✅ MySQL connected successfully');

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS Registration (
        id INT PRIMARY KEY AUTO_INCREMENT,
        Firstname VARCHAR(100) NOT NULL,
        Lastname VARCHAR(100) NOT NULL,
        NationalId VARCHAR(50),
        Telephone VARCHAR(20) NOT NULL,
        Email VARCHAR(100) UNIQUE NOT NULL,
        Password VARCHAR(255) NOT NULL,
        District VARCHAR(100),
        MeterNumber VARCHAR(50),
        PhaseType VARCHAR(50),
        Declaration BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    db.query(createTableQuery, (err) => {
      if (err) {
        console.error('❌ Table creation error:', err);
      } else {
        console.log('✅ Registration table ready');
      }
    });
  }
});

app.get('/test', (req, res) => {
  res.json({ success: true, message: 'Backend is running!', timestamp: new Date().toISOString() });
});

// ✅ LOGIN ENDPOINT - with detailed logging
app.post('/api/login', async (req, res) => {
  console.log('\n========================================');
  console.log('🔐 Login attempt!');
  console.log('Raw body received:', req.body);
  console.log('========================================\n');

  const { Email, Password } = req.body;

  // ✅ Log exactly what was received
  console.log('Email received:', Email);
  console.log('Password received:', Password ? '✅ yes (hidden)' : '❌ missing');

  if (!Email || !Password) {
    console.log('❌ Missing email or password');
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  if (!isDbConnected) {
    console.log('❌ DB not connected');
    return res.status(500).json({ success: false, message: 'Database not connected' });
  }

  // ✅ Search DB for user
  console.log('🔍 Searching DB for email:', Email);

  db.query('SELECT * FROM Registration WHERE Email = ?', [Email], async (err, results) => {
    if (err) {
      console.error('❌ Database query error:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    console.log('🔍 DB search results count:', results.length);

    if (results.length === 0) {
      console.log('❌ No user found with email:', Email);
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const user = results[0];
    console.log('✅ User found:', user.Firstname, user.Lastname);
    console.log('🔑 Stored hashed password:', user.Password);

    // ✅ Compare passwords
    try {
      console.log('🔑 Comparing passwords...');
      const passwordMatch = await bcrypt.compare(Password, user.Password);
      console.log('🔑 Password match result:', passwordMatch);

      if (!passwordMatch) {
        console.log('❌ Password does not match');
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      console.log('✅ Login successful for:', Email);
      return res.json({
        success: true,
        message: 'Login successful',
        user: {
          id: user.id,
          Firstname: user.Firstname,
          Lastname: user.Lastname,
          Email: user.Email,
        }
      });

    } catch (bcryptError) {
      console.error('❌ bcrypt error:', bcryptError);
      return res.status(500).json({ success: false, message: 'Server error during authentication' });
    }
  });
});

app.post('/api/register', async (req, res) => {
  console.log('\n========================================');
  console.log('📝 Registration request received!');
  console.log('Body:', req.body);
  console.log('========================================\n');

  const {
    Firstname, Lastname, NationalId, Telephone, Email,
    Password, District, MeterNumber, PhaseType, Declaration
  } = req.body;

  if (!Firstname || !Lastname || !Telephone || !Email || !Password) {
    console.log('❌ Missing required fields');
    return res.status(400).json({ success: false, message: 'Please fill all required fields' });
  }

  if (isDbConnected) {
    db.query('SELECT * FROM Registration WHERE Email = ?', [Email], async (err, emailResults) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ success: false, message: 'Database error' });
      }

      if (emailResults.length > 0) {
        console.log('❌ Email already registered:', Email);
        return res.status(400).json({ success: false, message: 'Email already registered' });
      }

      if (MeterNumber) {
        db.query('SELECT * FROM Registration WHERE MeterNumber = ?', [MeterNumber], async (err, meterResults) => {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
          }

          if (meterResults.length > 0) {
            console.log('❌ Meter number already registered:', MeterNumber);
            return res.status(400).json({ success: false, message: 'Meter number already registered' });
          }

          await saveUser(res, { Firstname, Lastname, NationalId, Telephone, Email, Password, District, MeterNumber, PhaseType, Declaration });
        });
      } else {
        await saveUser(res, { Firstname, Lastname, NationalId, Telephone, Email, Password, District, MeterNumber, PhaseType, Declaration });
      }
    });
  } else {
    console.log('⚠️ No database connection');
    return res.status(500).json({ success: false, message: 'Database not connected. Please try again later.' });
  }
});

async function saveUser(res, data) {
  const { Firstname, Lastname, NationalId, Telephone, Email, Password, District, MeterNumber, PhaseType, Declaration } = data;

  try {
    const hashedPassword = await bcrypt.hash(Password, 10);

    const query = `
      INSERT INTO Registration 
      (Firstname, Lastname, NationalId, Telephone, Email, Password, District, MeterNumber, PhaseType, Declaration) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      Firstname, Lastname, NationalId || null, Telephone,
      Email, hashedPassword, District || null, MeterNumber || null,
      PhaseType || null, Declaration ? 1 : 0
    ];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error('Insert error:', err);
        return res.status(500).json({ success: false, message: 'Failed to save user' });
      }
      console.log('✅ User saved to database! ID:', result.insertId);
      res.json({ success: true, message: 'Registration successful!', userId: result.insertId });
    });
  } catch (error) {
    console.error('Hash error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

app.get('/debug', (req, res) => {
  if (isDbConnected) {
    db.query('SELECT id, Firstname, Lastname, Email, Telephone, created_at FROM Registration', (err, users) => {
      if (err) {
        res.json({ success: false, error: err.message });
      } else {
        res.json({ success: true, database: 'Connected', user_count: users.length, users });
      }
    });
  } else {
    res.json({ success: true, database: 'Not connected', message: 'MySQL is not running.' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n========================================`);
  console.log(`✅ Server is running!`);
  console.log(`📍 Local: http://localhost:${PORT}`);

  const { networkInterfaces } = require('os');
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        console.log(`📍 Network: http://${net.address}:${PORT}`);
      }
    }
  }

  console.log(`🧪 Test: http://localhost:${PORT}/test`);
  console.log(`========================================\n`);
});
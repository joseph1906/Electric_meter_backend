const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log('🚀 Starting server...');

const db = mysql.createConnection({
  host: process.env.DatabaseHost,
  user: process.env.DatabaseUser,
  password: process.env.DatabasePassword,
  database: process.env.DatabaseName,
  port: process.env.DatabasePort
});

db.connect((err) => {
  if (err) {
    console.error('❌ MySQL connection error:', err.message);
  } else {
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
        Declaration BOOLEAN DEFAULT FALSE
      )
    `;

    db.query(createTableQuery, (err) => {
      if (err) {
        console.error('❌ Table creation error:', err);
      } else {
        console.log('✅ Registration table ready');
      }
    });

    const createPaymentTable = `
      CREATE TABLE IF NOT EXISTS PaymentMode (
        TransactionID VARCHAR(100) PRIMARY KEY,
        ID INT,
        Phone_number VARCHAR(255),
        Method VARCHAR(255) NOT NULL,
        Amount DECIMAL(10,2) NOT NULL,
        Unit_purchase DECIMAL(10,2) NOT NULL,
        deleted_by_user BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (ID) REFERENCES Registration(ID) ON DELETE SET NULL
      )
    `;

    db.query(createPaymentTable, (err) => {
      if (err) {
        console.error('❌ PaymentMode table error:', err);
      } else {
        console.log('✅ PaymentMode table ready');
      }
    });
  }
});

app.get('/test', (req, res) => {
  res.json({ success: true, message: 'Backend is running!' });
});

// LOGIN
app.post('/api/login', async (req, res) => {
  console.log('🔐 Login attempt:', req.body.Email);
  const { Email, Password } = req.body;

  if (!Email || !Password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  db.query('SELECT * FROM Registration WHERE Email = ?', [Email], async (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error' });
    if (results.length === 0) return res.status(401).json({ success: false, message: 'Invalid email or password' });

    const user = results[0];
    const passwordMatch = await bcrypt.compare(Password, user.Password);
    if (!passwordMatch) return res.status(401).json({ success: false, message: 'Invalid email or password' });

    res.json({
      success: true,
      user: {
        id: user.id,
        Firstname: user.Firstname,
        Lastname: user.Lastname,
        Email: user.Email,
        Telephone: user.Telephone,
      }
    });
  });
});

// REGISTER
app.post('/api/register', async (req, res) => {
  console.log('📝 Registration request received');
  const { Firstname, Lastname, NationalId, Telephone, Email, Password, District, MeterNumber, PhaseType, Declaration } = req.body;

  if (!Firstname || !Lastname || !Telephone || !Email || !Password) {
    return res.status(400).json({ success: false, message: 'Please fill all required fields' });
  }

  try {
    const hashedPassword = await bcrypt.hash(Password, 10);
    const query = `INSERT INTO Registration (Firstname, Lastname, NationalId, Telephone, Email, Password, District, MeterNumber, PhaseType, Declaration) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [Firstname, Lastname, NationalId || null, Telephone, Email, hashedPassword, District || null, MeterNumber || null, PhaseType || null, Declaration ? 1 : 0];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error('Insert error:', err);
        return res.status(500).json({ success: false, message: 'Failed to save user' });
      }
      res.json({ success: true, message: 'Registration successful!', userId: result.insertId });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// SAVE TRANSACTION
app.post('/api/record-transaction', (req, res) => {
  console.log('💰 TRANSACTION RECEIVED:', req.body);

  const { userId, phoneNumber, method, amount, unitPurchase } = req.body;

  if (!userId || !amount) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  const transactionId = 'TXN' + Date.now() + Math.floor(Math.random() * 10000);
  const insertQuery = `INSERT INTO PaymentMode (TransactionID, ID, Phone_number, Method, Amount, Unit_purchase, deleted_by_user) VALUES (?, ?, ?, ?, ?, ?, FALSE)`;

  db.query(insertQuery, [transactionId, userId, phoneNumber || null, method, amount, unitPurchase], (err, result) => {
    if (err) {
      console.error('❌ Insert error:', err);
      return res.status(500).json({ success: false, message: err.message });
    }

    console.log('✅ Transaction saved! ID:', transactionId);
    res.json({ success: true, transactionId: transactionId });
  });
});

// GET TRANSACTIONS - Only shows non-deleted transactions to user
app.get('/api/user-transactions/:userId', (req, res) => {
  const { userId } = req.params;
  console.log(`📋 Fetching transactions for user ID: ${userId}`);

  const query = `SELECT TransactionID, ID, Phone_number, Method, Amount, Unit_purchase 
                 FROM PaymentMode 
                 WHERE ID = ? AND deleted_by_user = FALSE 
                 ORDER BY TransactionID DESC`;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('❌ Error fetching transactions:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    console.log(`✅ Found ${results.length} transactions`);
    res.json({ success: true, transactions: results });
  });
});

// SOFT DELETE - Hides transaction from user but keeps it for admin
app.put('/api/soft-delete-transaction/:transactionId', (req, res) => {
  const { transactionId } = req.params;
  const cleanId = transactionId?.trim();

  console.log('🗑️ SOFT DELETE REQUEST FOR:', cleanId);

  if (!cleanId) {
    return res.status(400).json({ success: false, message: 'Transaction ID required' });
  }

  const updateQuery = 'UPDATE PaymentMode SET deleted_by_user = TRUE WHERE TransactionID = ?';

  db.query(updateQuery, [cleanId], (err, result) => {
    if (err) {
      console.error('❌ Soft delete error:', err);
      return res.status(500).json({ success: false, message: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    console.log('✅ Transaction soft deleted:', cleanId);
    res.json({ success: true, message: 'Transaction hidden successfully' });
  });
});

// ADMIN - Get ALL transactions including soft deleted ones
app.get('/api/admin/all-transactions', (req, res) => {
  console.log('👑 Admin fetching all transactions');

  const query = `
    SELECT 
      p.TransactionID, 
      p.ID, 
      r.Firstname,
      r.Lastname,
      r.Email,
      p.Phone_number, 
      p.Method, 
      p.Amount, 
      p.Unit_purchase,
      p.deleted_by_user
    FROM PaymentMode p
    LEFT JOIN Registration r ON p.ID = r.id
    ORDER BY p.TransactionID DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Error fetching all transactions:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    const total = results.reduce((sum, t) => sum + Number(t.Amount), 0);
    const totalUnits = results.reduce((sum, t) => sum + Number(t.Unit_purchase), 0);

    console.log(`✅ Admin found ${results.length} total transactions`);
    res.json({
      success: true,
      transactions: results,
      summary: {
        totalTransactions: results.length,
        totalAmount: total,
        totalUnits: totalUnits,
      }
    });
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n✅ Server running on http://192.168.1.4:${PORT}`);
  console.log('========================================\n');
});
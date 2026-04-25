const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('*', cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

console.log('🚀 Starting server...');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  requireTLS: true,
  auth: {
    user: process.env.Email_user,
    pass: process.env.Email_pass,
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify email transporter
transporter.verify((error) => {
  if (error) {
    console.error('❌ Email transporter error:', error);
  } else {
    console.log('✅ Email transporter ready');
  }
});

const db = mysql.createConnection({
  host: process.env.PUBLIC_NETWORKING,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: parseInt(process.env.PUBLIC_NETWORKING_PORT),  // ← parseInt!
  connectTimeout: 30000,
  ssl: { rejectUnauthorized: false }
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
        Declaration BOOLEAN DEFAULT FALSE,
        otp VARCHAR(6) DEFAULT NULL,
        otp_expires DATETIME DEFAULT NULL,
        is_verified BOOLEAN DEFAULT FALSE
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

    // ✅ Check if email is verified
    if (!user.is_verified) {
      return res.status(401).json({ 
        success: false, 
        message: 'Please verify your email first. Check your inbox for the OTP code.',
        needsVerification: true,
        email: Email
      });
    }

    const passwordMatch = await bcrypt.compare(Password, user.Password);
    if (!passwordMatch) return res.status(401).json({ success: false, message: 'Invalid email or password' });

    // LOGIN - Find this in server.js and replace the res.json part
res.json({
  success: true,
  user: {
    id: user.id,
    Firstname: user.Firstname,
    Lastname: user.Lastname,
    Email: user.Email,
    Telephone: user.Telephone,
    District: user.District,       // ← ADD THIS
    MeterNumber: user.MeterNumber, // ← ADD THIS
    PhaseType: user.PhaseType,     // ← ADD THIS
     }
   });
  });
});

// REGISTER - Sends OTP after registration
app.post('/api/register', async (req, res) => {
  console.log('📝 Registration request received');
  const { Firstname, Lastname, NationalId, Telephone, Email, Password, District, MeterNumber, PhaseType, Declaration } = req.body;

  if (!Firstname || !Lastname || !Telephone || !Email || !Password) {
    return res.status(400).json({ success: false, message: 'Please fill all required fields' });
  }

  try {
    const hashedPassword = await bcrypt.hash(Password, 10);

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // expires in 10 minutes

    const query = `INSERT INTO Registration 
      (Firstname, Lastname, NationalId, Telephone, Email, Password, District, MeterNumber, PhaseType, Declaration, otp, otp_expires, is_verified) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, FALSE)`;

    const values = [
      Firstname, Lastname, NationalId || null, Telephone, Email,
      hashedPassword, District || null, MeterNumber || null,
      PhaseType || null, Declaration ? 1 : 0, otp, otpExpires
    ];

    db.query(query, values, async (err, result) => {
      if (err) {
        console.error('Insert error:', err);
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ success: false, message: 'Email already registered' });
        }
        return res.status(500).json({ success: false, message: 'Failed to save user' });
      }

      // Send OTP email
      const mailOptions = {
        from: `"Electric Meter Uganda" <${process.env.EMAIL_USER}>`,
        to: Email,
        subject: 'Your Verification Code - Electric Meter Uganda',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #1B1A31; text-align: center;">Email Verification</h2>
            <p>Hello <strong>${Firstname}</strong>,</p>
            <p>Thank you for registering with Electric Meter Uganda. Use the code below to verify your email:</p>
            <div style="background-color: #484763; color: white; font-size: 36px; font-weight: bold; text-align: center; padding: 20px; border-radius: 10px; letter-spacing: 10px; margin: 20px 0;">
              ${otp}
            </div>
            <p style="color: red;"><strong>⚠️ This code expires in 10 minutes.</strong></p>
            <p>If you did not register, please ignore this email.</p>
            <hr/>
            <p style="color: gray; font-size: 12px; text-align: center;">Electric Meter Uganda &copy; ${new Date().getFullYear()}</p>
          </div>
        `
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log('✅ OTP email sent to:', Email);
        res.json({ 
          success: true, 
          message: 'Registration successful! Please check your email for the verification code.',
          userId: result.insertId,
          email: Email
        });
      } catch (emailError) {
        console.error('❌ Email sending error:', emailError);
        res.json({ 
          success: true, 
          message: 'Registration successful but email could not be sent. Please contact support.',
          userId: result.insertId,
          email: Email
        });
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// VERIFY OTP
app.post('/api/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  console.log('🔍 OTP verification attempt for:', email);

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Email and OTP are required' });
  }

  db.query('SELECT * FROM Registration WHERE Email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error' });
    if (results.length === 0) return res.status(404).json({ success: false, message: 'User not found' });

    const user = results[0];

    // Check if already verified
    if (user.is_verified) {
      return res.json({ success: true, message: 'Email already verified. You can login.' });
    }

    // Check OTP match
    if (user.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP code. Please try again.' });
    }

    // Check OTP expiry
    if (new Date() > new Date(user.otp_expires)) {
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }

    // Mark as verified
    db.query(
      'UPDATE Registration SET is_verified = TRUE, otp = NULL, otp_expires = NULL WHERE Email = ?',
      [email],
      (err) => {
        if (err) return res.status(500).json({ success: false, message: 'Database error' });
        console.log('✅ Email verified for:', email);
        res.json({ success: true, message: 'Email verified successfully! You can now login.' });
      }
    );
  });
});

// RESEND OTP
app.post('/api/resend-otp', async (req, res) => {
  const { email } = req.body;
  console.log('🔄 Resend OTP request for:', email);

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  db.query('SELECT * FROM Registration WHERE Email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error' });
    if (results.length === 0) return res.status(404).json({ success: false, message: 'User not found' });

    const user = results[0];

    if (user.is_verified) {
      return res.json({ success: true, message: 'Email already verified. You can login.' });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    db.query(
      'UPDATE Registration SET otp = ?, otp_expires = ? WHERE Email = ?',
      [otp, otpExpires, email],
      async (err) => {
        if (err) return res.status(500).json({ success: false, message: 'Database error' });

        const mailOptions = {
          from: `"Electric Meter Uganda" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: 'New Verification Code - Electric Meter Uganda',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #1B1A31; text-align: center;">New Verification Code</h2>
              <p>Hello <strong>${user.Firstname}</strong>,</p>
              <p>Here is your new verification code:</p>
              <div style="background-color: #484763; color: white; font-size: 36px; font-weight: bold; text-align: center; padding: 20px; border-radius: 10px; letter-spacing: 10px; margin: 20px 0;">
                ${otp}
              </div>
              <p style="color: red;"><strong>⚠️ This code expires in 10 minutes.</strong></p>
              <hr/>
              <p style="color: gray; font-size: 12px; text-align: center;">Electric Meter Uganda &copy; ${new Date().getFullYear()}</p>
            </div>
          `
        };

        try {
          await transporter.sendMail(mailOptions);
          console.log('✅ New OTP sent to:', email);
          res.json({ success: true, message: 'New verification code sent to your email.' });
        } catch (emailError) {
          console.error('❌ Email error:', emailError);
          res.status(500).json({ success: false, message: 'Failed to send email. Please try again.' });
        }
      }
    );
  });
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

// GET TRANSACTIONS
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

// SOFT DELETE
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

// ADMIN
app.get('/api/admin/all-transactions', (req, res) => {
  console.log('👑 Admin fetching all transactions');

  const query = `
    SELECT 
      p.TransactionID, p.ID, r.Firstname, r.Lastname, r.Email,
      p.Phone_number, p.Method, p.Amount, p.Unit_purchase, p.deleted_by_user
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

// FORGOT PASSWORD - Send OTP to email
app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;
  console.log('🔑 Forgot password request for:', email);

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  db.query('SELECT * FROM Registration WHERE Email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error' });
    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'No account found with this email' });
    }

    const user = results[0];

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    db.query(
      'UPDATE Registration SET otp = ?, otp_expires = ? WHERE Email = ?',
      [otp, otpExpires, email],
      async (err) => {
        if (err) return res.status(500).json({ success: false, message: 'Database error' });

        const mailOptions = {
          from: `"Electric Meter Uganda" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: 'Password Reset Code - Electric Meter Uganda',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #1B1A31; text-align: center;">Password Reset</h2>
              <p>Hello <strong>${user.Firstname}</strong>,</p>
              <p>We received a request to reset your password. Use the code below:</p>
              <div style="background-color: #484763; color: white; font-size: 36px; font-weight: bold; text-align: center; padding: 20px; border-radius: 10px; letter-spacing: 10px; margin: 20px 0;">
                ${otp}
              </div>
              <p style="color: red;"><strong>⚠️ This code expires in 10 minutes.</strong></p>
              <p>If you did not request a password reset, please ignore this email.</p>
              <hr/>
              <p style="color: gray; font-size: 12px; text-align: center;">Electric Meter Uganda &copy; ${new Date().getFullYear()}</p>
            </div>
          `
        };

        try {
          await transporter.sendMail(mailOptions);
          console.log('✅ Password reset OTP sent to:', email);
          res.json({ success: true, message: 'Password reset code sent to your email.' });
        } catch (emailError) {
          console.error('❌ Email error:', emailError);
          res.status(500).json({ success: false, message: 'Failed to send email. Please try again.' });
        }
      }
    );
  });
});

// VERIFY RESET OTP
app.post('/api/verify-reset-otp', (req, res) => {
  const { email, otp } = req.body;
  console.log('🔍 Reset OTP verification for:', email);

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Email and OTP are required' });
  }

  db.query('SELECT * FROM Registration WHERE Email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error' });
    if (results.length === 0) return res.status(404).json({ success: false, message: 'User not found' });

    const user = results[0];

    if (user.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP code. Please try again.' });
    }

    if (new Date() > new Date(user.otp_expires)) {
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }

    console.log('✅ Reset OTP verified for:', email);
    res.json({ success: true, message: 'OTP verified. You can now reset your password.' });
  });
});

// RESET PASSWORD
app.post('/api/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  console.log('🔑 Password reset for:', email);

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
  }

  db.query('SELECT * FROM Registration WHERE Email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error' });
    if (results.length === 0) return res.status(404).json({ success: false, message: 'User not found' });

    const user = results[0];

    if (user.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP code.' });
    }

    if (new Date() > new Date(user.otp_expires)) {
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }

    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      db.query(
        'UPDATE Registration SET Password = ?, otp = NULL, otp_expires = NULL WHERE Email = ?',
        [hashedPassword, email],
        (err) => {
          if (err) return res.status(500).json({ success: false, message: 'Database error' });
          console.log('✅ Password reset successfully for:', email);
          res.json({ success: true, message: 'Password reset successfully! You can now login.' });
        }
      );
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });
});

// SAVE PROFILE IMAGE
app.post('/api/upload-profile-image', (req, res) => {
  const { userId, imageBase64 } = req.body;

  if (!userId || !imageBase64) {
    return res.status(400).json({ success: false, message: 'Missing data' });
  }

  db.query(
    'UPDATE Registration SET ProfileImage = ? WHERE id = ?',
    [imageBase64, userId],
    (err) => {
      if (err) {
        console.error('❌ Profile image save error:', err);
        return res.status(500).json({ success: false, message: 'DB error' });
      }
      console.log('✅ Profile image saved for user:', userId);
      res.json({ success: true, message: 'Profile image saved!' });
    }
  );
});

// GET PROFILE IMAGE
app.get('/api/get-profile-image/:userId', (req, res) => {
  db.query(
    'SELECT ProfileImage FROM Registration WHERE id = ?',
    [req.params.userId],
    (err, results) => {
      if (err) {
        console.error('❌ Profile image fetch error:', err);
        return res.status(500).json({ success: false });
      }
      res.json({ 
        success: true, 
        image: results[0]?.ProfileImage || null 
      });
    }
  );
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n✅ Server running on http://192.168.1.2:${PORT}`);
  console.log('========================================\n');
});